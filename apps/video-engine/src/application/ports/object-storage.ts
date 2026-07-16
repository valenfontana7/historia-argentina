export interface ObjectStorage {
  put(key: string, data: Buffer | string, contentType?: string): Promise<string>;
  get(uri: string): Promise<Buffer>;
  resolvePath(uri: string): string;
  exists(uri: string): Promise<boolean>;
}
