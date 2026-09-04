import type { VoiceTrack } from "@museoargent/video-contracts";

export interface VoiceProvider {
  readonly name: string;
  synthesize(input: {
    text: string;
    voice?: string;
    instructions?: string;
    outputUri: string;
    scene?: number;
  }): Promise<VoiceTrack>;
}
