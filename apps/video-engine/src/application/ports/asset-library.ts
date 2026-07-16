import type { AssetHint, AssetRecord } from "@museoargent/video-contracts";

export interface AssetLibrary {
  getById(id: string): Promise<AssetRecord | null>;
  search(hint: AssetHint): Promise<AssetRecord[]>;
  listVisual(): Promise<AssetRecord[]>;
  upsert(asset: AssetRecord): Promise<void>;
}

export interface RankedAsset {
  asset: AssetRecord;
  score: number;
  reason: string;
}

export interface AssetRanker {
  rank(hint: AssetHint, candidates: AssetRecord[]): Promise<RankedAsset[]>;
}
