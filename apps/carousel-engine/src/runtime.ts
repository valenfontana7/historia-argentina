import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  CAROUSEL_PIPELINE_VERSION,
  type Carousel,
  type CarouselJob,
  type CarouselJobView,
  type CreateCarouselJobRequest,
  type ExportFormat,
  type PatchCarouselJob,
  type RenderCarouselRequest,
  type RenderPlan,
} from "@museoargent/carousel-contracts";
import {
  loadCarouselEngineConfig,
  type CarouselEngineConfig,
} from "./application/config";
import { CarouselJobStore } from "./application/job-store";
import { buildRenderPlan } from "./application/pipeline";
import type { SlideRenderer } from "./application/ports/slide-renderer";
import { prewarmHttpAssets } from "./application/stages/asset-composer";
import { resolveTemplate } from "./application/stages/template-resolver";
import { resolveTheme } from "./application/stages/theme-resolver";
import { CarouselEngineError } from "./domain/errors";
import { FakeSlideRenderer } from "./infrastructure/fake-renderer";
import { PlaywrightSlideRenderer } from "./infrastructure/playwright-renderer";
import { buildStoreZip } from "./infrastructure/zip-store";

function nowIso(): string {
  return new Date().toISOString();
}

function collectHttpAssetUrls(carousel: Carousel): string[] {
  const urls: string[] = [];
  for (const slide of carousel.slides) {
    if ("image" in slide && slide.image?.src) urls.push(slide.image.src);
    if ("images" in slide && Array.isArray(slide.images)) {
      for (const img of slide.images) {
        if (img.src) urls.push(img.src);
      }
    }
  }
  return urls;
}

function changedSlideIds(prev: Carousel, next: Carousel): string[] {
  const prevMap = new Map(prev.slides.map((s) => [s.id, s]));
  const dirty: string[] = [];
  for (const slide of next.slides) {
    const before = prevMap.get(slide.id);
    if (!before || JSON.stringify(before) !== JSON.stringify(slide)) {
      dirty.push(slide.id);
    }
  }
  for (const id of prevMap.keys()) {
    if (!next.slides.some((s) => s.id === id)) {
      // deleted — nothing to render
    }
  }
  return dirty;
}

export type CarouselEngineRuntime = {
  config: CarouselEngineConfig;
  store: CarouselJobStore;
  getHealth(): {
    ok: true;
    service: "carousel-engine";
    renderer: "playwright" | "fake";
    chromiumOk: boolean;
    storageRoot: string;
  };
  createJob(req: CreateCarouselJobRequest): Promise<CarouselJobView>;
  listJobs(limit?: number): Promise<CarouselJobView[]>;
  getJob(id: string): Promise<CarouselJobView | null>;
  deleteJob(id: string): Promise<boolean>;
  patchJob(id: string, patch: PatchCarouselJob): Promise<CarouselJobView>;
  renderJob(
    id: string,
    req?: RenderCarouselRequest,
  ): Promise<CarouselJobView>;
  exportZip(id: string): Promise<Buffer>;
  getSlideImagePath(
    id: string,
    slideId: string,
  ): Promise<{ path: string; format: ExportFormat } | null>;
  dispose(): Promise<void>;
};

function toView(job: CarouselJob, title?: string): CarouselJobView {
  return {
    ...job,
    title,
    slideCount: job.slideOrder.length,
  };
}

export async function createCarouselEngineRuntime(
  env: NodeJS.ProcessEnv = process.env,
): Promise<CarouselEngineRuntime> {
  const config = loadCarouselEngineConfig(env);
  const store = new CarouselJobStore(config.storageRoot);
  const libraryRoot = path.resolve(
    config.engineRoot,
    "../../data/video-engine/library",
  );

  let renderer: SlideRenderer;
  let rendererKind: "playwright" | "fake" = "fake";
  let chromiumOk = false;

  if (config.useFakeRenderer) {
    renderer = new FakeSlideRenderer();
    rendererKind = "fake";
    chromiumOk = false;
  } else {
    try {
      const { chromium } = await import("playwright");
      const browser = await chromium.launch({ headless: true });
      await browser.close();
      renderer = new PlaywrightSlideRenderer();
      rendererKind = "playwright";
      chromiumOk = true;
    } catch (err) {
      console.warn(
        JSON.stringify({
          msg: "Playwright Chromium missing; using fake renderer",
          error: err instanceof Error ? err.message : String(err),
          hint: "En apps/carousel-engine: npm run playwright:install",
        }),
      );
      renderer = new FakeSlideRenderer();
      rendererKind = "fake";
      chromiumOk = false;
    }
  }

  async function loadTitle(id: string): Promise<string | undefined> {
    const c = await store.readCarousel(id);
    return c?.title;
  }

  async function rebuildPlan(job: CarouselJob, carousel: Carousel): Promise<RenderPlan> {
    return buildRenderPlan({
      carousel,
      templateId: job.meta.templateId,
      templateVersion: job.meta.templateVersion,
      themeId: job.meta.themeId,
      profileId: job.meta.profileId,
      engineRoot: config.engineRoot,
      libraryRoot,
      cacheRoot: path.join(config.storageRoot, "cache"),
      exportFormat: job.meta.exportFormat,
    });
  }

  async function markAllDirty(job: CarouselJob, carousel: Carousel): Promise<CarouselJob> {
    const plan = await rebuildPlan(job, carousel);
    await store.writeRenderPlan(job.id, plan);
    const next: CarouselJob = {
      ...job,
      dirtySlideIds: plan.slides.map((s) => s.slideId),
      renderedSlideIds: [],
      status: "ready",
      updatedAt: nowIso(),
      error: undefined,
    };
    await store.writeJob(next);
    await store.writeMeta(job.id, next.meta);
    return next;
  }

  return {
    config,
    store,

    getHealth() {
      return {
        ok: true as const,
        service: "carousel-engine" as const,
        renderer: rendererKind,
        chromiumOk,
        storageRoot: config.storageRoot,
      };
    },

    async createJob(req) {
      const id = `car_${randomUUID().slice(0, 8)}_${Date.now()}`;
      const ts = nowIso();
      const job: CarouselJob = {
        id,
        status: "ready",
        createdAt: ts,
        updatedAt: ts,
        carouselId: req.carousel.id,
        slideOrder: req.carousel.slides.map((s) => s.id),
        dirtySlideIds: req.carousel.slides.map((s) => s.id),
        renderedSlideIds: [],
        meta: {
          templateId: req.templateId,
          templateVersion: req.templateVersion,
          themeId: req.themeId,
          profileId: req.profileId,
          exportFormat: req.exportFormat,
          pipelineVersion: CAROUSEL_PIPELINE_VERSION,
        },
      };
      await store.writeCarousel(id, req.carousel);
      await store.writeJob(job);
      const plan = await rebuildPlan(job, req.carousel);
      await store.writeRenderPlan(id, plan);
      await store.writeMeta(id, job.meta);
      // Best-effort: warm HTTP asset cache before first render
      void prewarmHttpAssets(
        collectHttpAssetUrls(req.carousel),
        path.join(config.storageRoot, "cache"),
      ).catch(() => undefined);
      return toView(job, req.carousel.title);
    },

    async listJobs(limit = 50) {
      const jobs = await store.listJobs(limit);
      const views: CarouselJobView[] = [];
      for (const job of jobs) {
        views.push(toView(job, await loadTitle(job.id)));
      }
      return views;
    },

    async getJob(id) {
      const job = await store.readJob(id);
      if (!job) return null;
      return toView(job, await loadTitle(id));
    },

    async deleteJob(id) {
      const job = await store.readJob(id);
      if (!job) return false;
      return store.deleteJob(id);
    },

    async patchJob(id, patch) {
      const job = await store.readJob(id);
      if (!job) throw new CarouselEngineError("Job not found", "not_found");
      let carousel = await store.readCarousel(id);
      if (!carousel) throw new CarouselEngineError("Carousel missing", "not_found");

      let presentationChanged = false;
      let contentChanged = false;
      let selectiveDirty: string[] | null = null;
      const prevCarousel = carousel;

      if (patch.carousel) {
        selectiveDirty = changedSlideIds(prevCarousel, patch.carousel);
        carousel = patch.carousel;
        contentChanged = true;
        job.slideOrder = carousel.slides.map((s) => s.id);
      }

      if (patch.slideOrder) {
        const set = new Set(carousel.slides.map((s) => s.id));
        if (
          patch.slideOrder.length !== set.size ||
          patch.slideOrder.some((sid) => !set.has(sid))
        ) {
          throw new CarouselEngineError("Invalid slideOrder", "bad_patch");
        }
        job.slideOrder = patch.slideOrder;
        carousel = {
          ...carousel,
          slides: job.slideOrder.map(
            (sid) => carousel!.slides.find((s) => s.id === sid)!,
          ),
        };
        contentChanged = true;
        selectiveDirty = null;
      }

      if (patch.deleteSlideId) {
        carousel = {
          ...carousel,
          slides: carousel.slides.filter((s) => s.id !== patch.deleteSlideId),
        };
        job.slideOrder = job.slideOrder.filter((s) => s !== patch.deleteSlideId);
        job.renderedSlideIds = job.renderedSlideIds.filter(
          (s) => s !== patch.deleteSlideId,
        );
        contentChanged = true;
        selectiveDirty = null;
      }

      if (patch.duplicateSlideId) {
        const src = carousel.slides.find((s) => s.id === patch.duplicateSlideId);
        if (!src) {
          throw new CarouselEngineError("Slide to duplicate not found", "bad_patch");
        }
        const copy = {
          ...structuredClone(src),
          id: `${src.id}_copy_${Date.now().toString(36)}`,
        };
        const idx = job.slideOrder.indexOf(src.id);
        carousel = {
          ...carousel,
          slides: [
            ...carousel.slides.slice(0, idx + 1),
            copy,
            ...carousel.slides.slice(idx + 1),
          ],
        };
        job.slideOrder = [
          ...job.slideOrder.slice(0, idx + 1),
          copy.id,
          ...job.slideOrder.slice(idx + 1),
        ];
        job.dirtySlideIds = [...new Set([...job.dirtySlideIds, copy.id])];
        contentChanged = true;
        selectiveDirty = [copy.id];
      }

      if (patch.templateId) {
        job.meta.templateId = patch.templateId;
        presentationChanged = true;
      }
      if (patch.templateVersion) {
        job.meta.templateVersion = patch.templateVersion;
        presentationChanged = true;
      }
      if (patch.themeId) {
        job.meta.themeId = patch.themeId;
        presentationChanged = true;
      }
      if (patch.profileId) {
        job.meta.profileId = patch.profileId;
        presentationChanged = true;
      }
      if (patch.exportFormat) {
        job.meta.exportFormat = patch.exportFormat;
        presentationChanged = true;
      }

      await store.writeCarousel(id, carousel);
      job.updatedAt = nowIso();

      if (presentationChanged) {
        return toView(await markAllDirty(job, carousel), carousel.title);
      }

      if (contentChanged && selectiveDirty) {
        const plan = await rebuildPlan(job, carousel);
        await store.writeRenderPlan(id, plan);
        const next: CarouselJob = {
          ...job,
          dirtySlideIds: [...new Set([...job.dirtySlideIds, ...selectiveDirty])],
          renderedSlideIds: job.renderedSlideIds.filter(
            (sid) => !selectiveDirty!.includes(sid),
          ),
          status: "ready",
          updatedAt: nowIso(),
          error: undefined,
        };
        await store.writeJob(next);
        await store.writeMeta(id, next.meta);
        return toView(next, carousel.title);
      }

      if (contentChanged) {
        return toView(await markAllDirty(job, carousel), carousel.title);
      }

      await store.writeJob(job);
      return toView(job, carousel.title);
    },

    async renderJob(id, req = {}) {
      let job = await store.readJob(id);
      if (!job) throw new CarouselEngineError("Job not found", "not_found");
      const carousel = await store.readCarousel(id);
      if (!carousel) throw new CarouselEngineError("Carousel missing", "not_found");

      const format = req.format ?? job.meta.exportFormat;
      job = {
        ...job,
        status: "rendering",
        updatedAt: nowIso(),
        meta: { ...job.meta, exportFormat: format },
      };
      await store.writeJob(job);

      try {
        const prevPlan = await store.readRenderPlan(id);
        const prevHashes = new Map(
          (prevPlan?.slides ?? []).map((s) => [s.slideId, s.irHash]),
        );
        const plan = await rebuildPlan(job, carousel);
        await store.writeRenderPlan(id, plan);

        const theme = await resolveTheme(config.engineRoot, job.meta.themeId);
        const manifest = await resolveTemplate(
          config.engineRoot,
          job.meta.templateId,
          job.meta.templateVersion,
        );

        const rendered = new Set(job.renderedSlideIds);
        const explicit = req.slideIds && req.slideIds.length > 0;
        const targetIds = new Set(
          explicit
            ? req.slideIds!
            : job.dirtySlideIds.length > 0
              ? job.dirtySlideIds
              : plan.slides.map((s) => s.slideId),
        );

        // Hash drift always dirties even if not in dirtySlideIds
        if (!explicit) {
          for (const entry of plan.slides) {
            const prev = prevHashes.get(entry.slideId);
            if (prev !== entry.irHash || !rendered.has(entry.slideId)) {
              targetIds.add(entry.slideId);
            }
          }
        }

        const exportSlides = [];

        for (const entry of plan.slides) {
          const needsRender = targetIds.has(entry.slideId);
          if (!needsRender && rendered.has(entry.slideId)) {
            exportSlides.push({
              slideId: entry.slideId,
              format: "png" as const,
              path: store.slidePath(id, entry.slideId, "png"),
              width: entry.ir.width,
              height: entry.ir.height,
              irHash: entry.irHash,
            });
            continue;
          }
          if (!needsRender) continue;

          let buffer: Buffer;
          try {
            buffer = await renderer.renderSlide({
              ir: entry.ir,
              theme,
              manifest,
              format: "png",
            });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (
              !(renderer instanceof FakeSlideRenderer) &&
              /Executable doesn't exist|playwright install/i.test(msg)
            ) {
              throw new CarouselEngineError(
                "Chromium de Playwright no está instalado. En apps/carousel-engine ejecutá: npm run playwright:install",
                "playwright_missing",
              );
            }
            throw err;
          }

          const file = await store.writeSlideImage(
            id,
            entry.slideId,
            "png",
            buffer,
          );
          rendered.add(entry.slideId);
          exportSlides.push({
            slideId: entry.slideId,
            format: "png" as const,
            path: file,
            width: entry.ir.width,
            height: entry.ir.height,
            irHash: entry.irHash,
          });
        }

        await store.writeExportManifest(id, {
          jobId: id,
          templateId: job.meta.templateId,
          templateVersion: job.meta.templateVersion,
          themeId: job.meta.themeId,
          profileId: job.meta.profileId,
          format: "png",
          slides: exportSlides,
          createdAt: nowIso(),
        });

        job = {
          ...job,
          status: "succeeded",
          dirtySlideIds: [],
          renderedSlideIds: [...rendered],
          updatedAt: nowIso(),
          error: undefined,
        };
        await store.writeJob(job);
        return toView(job, carousel.title);
      } catch (err) {
        job = {
          ...job,
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
          updatedAt: nowIso(),
        };
        await store.writeJob(job);
        throw err;
      }
    },

    async getSlideImagePath(id, slideId) {
      const job = await store.readJob(id);
      if (!job) return null;
      const file = store.slidePath(id, slideId, "png");
      try {
        const { stat } = await import("node:fs/promises");
        await stat(file);
        return { path: file, format: "png" };
      } catch {
        return null;
      }
    },

    async exportZip(id) {
      const job = await store.readJob(id);
      if (!job) throw new CarouselEngineError("Job not found", "not_found");
      const files: { name: string; data: Buffer }[] = [];
      for (const slideId of job.slideOrder) {
        if (!job.renderedSlideIds.includes(slideId)) continue;
        const file = store.slidePath(id, slideId, "png");
        try {
          const data = await readFile(file);
          files.push({ name: `${slideId}.png`, data });
        } catch {
          // skip missing
        }
      }
      if (files.length === 0) {
        throw new CarouselEngineError(
          "No rendered slides to export",
          "not_found",
        );
      }
      return buildStoreZip(files);
    },

    async dispose() {
      await renderer.dispose?.();
    },
  };
}
