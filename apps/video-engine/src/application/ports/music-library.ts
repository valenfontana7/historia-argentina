import type { AssetRecord, MusicCategory } from "@museoargent/video-contracts";

export interface MusicLibrary {
  findByCategory(category: MusicCategory): Promise<AssetRecord[]>;
}
