import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ObjectStorage } from "../../application/ports/object-storage";

export class LocalObjectStorage implements ObjectStorage {
  constructor(private readonly root: string) {}

  private keyToPath(key: string): string {
    const normalized = key.replace(/^\/+/, "").replace(/\.\./g, "");
    return path.join(this.root, normalized);
  }

  resolvePath(uri: string): string {
    if (uri.startsWith("file://")) {
      return uri.slice("file://".length);
    }
    if (path.isAbsolute(uri)) {
      return uri;
    }
    return this.keyToPath(uri);
  }

  async put(
    key: string,
    data: Buffer | string,
    _contentType?: string,
  ): Promise<string> {
    const full = this.keyToPath(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data);
    return `file://${full}`;
  }

  async get(uri: string): Promise<Buffer> {
    return readFile(this.resolvePath(uri));
  }

  async exists(uri: string): Promise<boolean> {
    try {
      await stat(this.resolvePath(uri));
      return true;
    } catch {
      return false;
    }
  }
}

/** Stub preparado para S3; no cableado en v1. */
export class S3ObjectStorage implements ObjectStorage {
  constructor(
    private readonly _bucket: string,
    private readonly _region: string,
  ) {}

  put(): Promise<string> {
    return Promise.reject(new Error("S3ObjectStorage not configured in v1"));
  }

  get(): Promise<Buffer> {
    return Promise.reject(new Error("S3ObjectStorage not configured in v1"));
  }

  resolvePath(): string {
    throw new Error("S3ObjectStorage not configured in v1");
  }

  exists(): Promise<boolean> {
    return Promise.reject(new Error("S3ObjectStorage not configured in v1"));
  }
}

export function hashPayload(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
