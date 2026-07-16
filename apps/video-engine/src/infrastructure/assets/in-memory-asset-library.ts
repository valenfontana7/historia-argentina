import type { AssetHint, AssetRecord } from "@museoargent/video-contracts";
import type {
  AssetLibrary,
  AssetRanker,
  RankedAsset,
} from "../../application/ports/asset-library";

export class InMemoryAssetLibrary implements AssetLibrary {
  private readonly assets = new Map<string, AssetRecord>();

  async getById(id: string): Promise<AssetRecord | null> {
    return this.assets.get(id) ?? null;
  }

  async search(hint: AssetHint): Promise<AssetRecord[]> {
    const all = [...this.assets.values()].filter((a) => a.type !== "musica");
    if (!hint.preferredTypes.length && !hint.tags.length) return all;
    return all.filter((a) => {
      const typeOk =
        !hint.preferredTypes.length ||
        hint.preferredTypes.includes(
          a.type as (typeof hint.preferredTypes)[number],
        );
      const tagOk =
        !hint.tags.length ||
        hint.tags.some((t) =>
          a.tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()),
        );
      const charOk =
        !hint.characters.length ||
        hint.characters.some((c) =>
          a.characters.map((x) => x.toLowerCase()).includes(c.toLowerCase()),
        );
      return typeOk || tagOk || charOk;
    });
  }

  async listVisual(): Promise<AssetRecord[]> {
    return [...this.assets.values()].filter((a) => a.type !== "musica");
  }

  async listMusic(): Promise<AssetRecord[]> {
    return [...this.assets.values()].filter((a) => a.type === "musica");
  }

  async upsert(asset: AssetRecord): Promise<void> {
    this.assets.set(asset.id, asset);
  }
}

export class HeuristicAssetRanker implements AssetRanker {
  async rank(hint: AssetHint, candidates: AssetRecord[]): Promise<RankedAsset[]> {
    const ranked = candidates.map((asset) => {
      let score = 0.12 * asset.weight;
      const reasons: string[] = [];

      if (
        hint.preferredTypes.length &&
        hint.preferredTypes.includes(
          asset.type as (typeof hint.preferredTypes)[number],
        )
      ) {
        score += 0.45;
        reasons.push(`type:${asset.type}`);
      }

      const tagHits = hint.tags.filter((t) =>
        asset.tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()),
      ).length;
      if (tagHits) {
        score += Math.min(0.3, tagHits * 0.1);
        reasons.push(`tags:${tagHits}`);
      }

      const charHits = hint.characters.filter((c) =>
        asset.characters.map((x) => x.toLowerCase()).includes(c.toLowerCase()),
      ).length;
      if (charHits) {
        score += Math.min(0.25, charHits * 0.15);
        reasons.push(`characters:${charHits}`);
      }

      if (hint.epoch && asset.epoch === hint.epoch) {
        score += 0.1;
        reasons.push("epoch");
      }

      if (asset.orientation === "vertical") {
        score += 0.08;
        reasons.push("vertical");
      }

      if ((asset.width ?? 0) >= 1000) {
        score += 0.05;
        reasons.push("hires");
      }

      return {
        asset,
        score,
        reason: reasons.join(",") || "baseline",
      };
    });

    return ranked.sort((a, b) => b.score - a.score);
  }
}
