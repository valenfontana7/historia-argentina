import type { SubtitleCue } from "@museoargent/video-contracts";

/** Captions estilo plataforma: cortos, 1–2 líneas. */
const MAX_CHARS_LINE = 20;
const MAX_WORDS_PER_CUE = 5;
const MIN_CUE_SEC = 0.85;

/** Divide narración en cues cortos (≈3–6 palabras / línea ≤20 chars). */
export function splitNarrationIntoCues(
  narration: string,
  startSec: number,
  endSec: number,
  startIndex: number,
): SubtitleCue[] {
  const sentences = narration
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const sentence of sentences.length ? sentences : [narration.trim()]) {
    chunks.push(...toCueBlocks(sentence));
  }

  const total = Math.max(
    1,
    chunks.reduce((n, c) => n + c.replace(/\n/g, "").length, 0),
  );
  const duration = Math.max(MIN_CUE_SEC, endSec - startSec);
  let cursor = startSec;
  let index = startIndex;
  const cues: SubtitleCue[] = [];

  for (const text of chunks) {
    const share = text.replace(/\n/g, "").length / total;
    const len = Math.max(MIN_CUE_SEC, duration * share);
    let cueEnd = Math.min(endSec, cursor + len);
    if (cueEnd - cursor < MIN_CUE_SEC) {
      cueEnd = Math.min(endSec, cursor + MIN_CUE_SEC);
    }
    cues.push({
      index: index++,
      startSec: Number(cursor.toFixed(3)),
      endSec: Number(cueEnd.toFixed(3)),
      text,
    });
    cursor = cueEnd;
  }

  if (cues.length) {
    cues[cues.length - 1].endSec = endSec;
  }
  return cues;
}

function toCueBlocks(sentence: string): string[] {
  const words = sentence.split(/\s+/).filter(Boolean);
  const groups: string[][] = [];
  let current: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prev = current[current.length - 1] ?? "";
    const keepWithPrev =
      /^\d{3,4}$/.test(word) && /^(año|en|de|del)$/i.test(prev);

    const next = [...current, word];
    const line = next.join(" ");
    const tooLong =
      !keepWithPrev &&
      (next.length > MAX_WORDS_PER_CUE || line.length > MAX_CHARS_LINE * 2);

    if (tooLong && current.length) {
      groups.push(current);
      current = [word];
    } else {
      current = next;
    }
  }
  if (current.length) groups.push(current);

  return groups.map((g) => formatCueLines(g)).filter(Boolean);
}

function formatCueLines(words: string[]): string {
  if (words.length <= 3) return words.join(" ");
  const mid = Math.ceil(words.length / 2);
  const a = words.slice(0, mid).join(" ");
  const b = words.slice(mid).join(" ");
  if (a.length <= MAX_CHARS_LINE && b.length <= MAX_CHARS_LINE) {
    return `${a}\n${b}`;
  }
  // Re-wrap greedily
  const lines = wrapLines(words.join(" "));
  return lines.slice(0, 2).join("\n");
}

function wrapLines(text: string): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prev = current.trim().split(/\s+/).pop() ?? "";
    const keepWithPrev =
      /^\d{3,4}$/.test(word) && /^(año|en|de|del)$/i.test(prev);

    const candidate = current ? `${current} ${word}` : word;
    if (!keepWithPrev && candidate.length > MAX_CHARS_LINE && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function toSrt(cues: SubtitleCue[]): string {
  return cues
    .map(
      (c) =>
        `${c.index}\n${formatSrtTime(c.startSec)} --> ${formatSrtTime(c.endSec)}\n${c.text}\n`,
    )
    .join("\n");
}

export function toVtt(cues: SubtitleCue[]): string {
  return (
    "WEBVTT\n\n" +
    cues
      .map(
        (c) =>
          `${formatVttTime(c.startSec)} --> ${formatVttTime(c.endSec)}\n${c.text}\n`,
      )
      .join("\n")
  );
}

/** ASS 1080×1920 — evita el escalado erróneo de SRT+force_style (PlayRes ~384). */
export function toAss(cues: SubtitleCue[]): string {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Inter,52,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,0,2,48,48,160,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
  const events = cues
    .map(
      (c) =>
        `Dialogue: 0,${formatAssTime(c.startSec)},${formatAssTime(c.endSec)},Default,,0,0,0,,${escapeAssText(c.text)}`,
    )
    .join("\n");
  return `${header}${events}\n`;
}

function escapeAssText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\n/g, "\\N");
}

function formatAssTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const cs = Math.round((sec % 1) * 100);
  return `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`;
}

function formatSrtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function formatVttTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
}

function pad(n: number, size = 2): string {
  return String(n).padStart(size, "0");
}
