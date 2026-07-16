import type { AssetRecord, MusicCategory } from "@museoargent/video-contracts";
import type { MusicLibrary } from "../../application/ports/music-library";
import type { AssetLibrary } from "../../application/ports/asset-library";

export class AssetBackedMusicLibrary implements MusicLibrary {
  constructor(private readonly assets: AssetLibrary) {}

  async findByCategory(category: MusicCategory): Promise<AssetRecord[]> {
    const all = await this.assets.listVisual().catch(async () => []);
    // listVisual filters music; use search workaround via get — store music separately
    void all;
    const music = await listMusic(this.assets);
    return music
      .filter((m) => m.musicCategory === category)
      .sort((a, b) => (b.durationSec ?? 0) - (a.durationSec ?? 0));
  }
}

async function listMusic(assets: AssetLibrary): Promise<AssetRecord[]> {
  // InMemory and Prisma libraries expose music via a dedicated method if present
  const anyLib = assets as AssetLibrary & {
    listMusic?: () => Promise<AssetRecord[]>;
  };
  if (anyLib.listMusic) return anyLib.listMusic();
  return [];
}

export class InMemoryMusicLibrary implements MusicLibrary {
  constructor(private readonly tracks: AssetRecord[]) {}

  async findByCategory(category: MusicCategory): Promise<AssetRecord[]> {
    return this.tracks
      .filter((t) => t.type === "musica" && t.musicCategory === category)
      .sort((a, b) => {
        // Prefer tracks with matching duration metadata and higher weight — never random
        if (b.weight !== a.weight) return b.weight - a.weight;
        return (b.durationSec ?? 0) - (a.durationSec ?? 0);
      });
  }
}
