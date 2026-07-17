import http from "node:http";
import https from "node:https";
import { URL } from "node:url";
import type { Express, Request, Response } from "express";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

export function resolveCarouselUpstream(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const raw =
    env.CAROUSEL_ENGINE_UPSTREAM?.trim() ||
    `http://127.0.0.1:${env.CAROUSEL_ENGINE_PORT?.trim() || "4120"}`;
  return raw.replace(/\/$/, "");
}

function filterHeaders(
  incoming: Request["headers"],
): http.OutgoingHttpHeaders {
  const out: http.OutgoingHttpHeaders = {};
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    if (HOP_BY_HOP.has(key.toLowerCase())) continue;
    out[key] = value;
  }
  return out;
}

function proxyToCarousel(
  upstreamBase: string,
  req: Request,
  res: Response,
): void {
  const suffix = req.url && req.url.length > 0 ? req.url : "/";
  let target: URL;
  try {
    target = new URL(suffix, `${upstreamBase}/`);
  } catch {
    res.status(502).json({ error: "Invalid carousel upstream URL" });
    return;
  }

  const lib = target.protocol === "https:" ? https : http;
  const upstreamReq = lib.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === "https:" ? 443 : 80),
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers: filterHeaders(req.headers),
    },
    (upstreamRes) => {
      const status = upstreamRes.statusCode ?? 502;
      const headers: Record<string, string | string[] | undefined> = {};
      for (const [key, value] of Object.entries(upstreamRes.headers)) {
        if (value === undefined) continue;
        if (HOP_BY_HOP.has(key.toLowerCase())) continue;
        headers[key] = value;
      }
      res.writeHead(status, headers);
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on("error", (err) => {
    if (res.headersSent) {
      res.end();
      return;
    }
    res.status(502).json({
      error: "Carousel engine unreachable",
      detail: err instanceof Error ? err.message : String(err),
      upstream: upstreamBase,
    });
  });

  req.pipe(upstreamReq);
}

/** Mount before Nest so /carousel/* never hits video controllers. */
export function mountCarouselProxy(
  app: Express,
  upstream: string = resolveCarouselUpstream(),
): void {
  app.use("/carousel", (req, res) => {
    proxyToCarousel(upstream, req, res);
  });
}
