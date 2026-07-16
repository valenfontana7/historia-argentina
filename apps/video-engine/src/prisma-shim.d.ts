/** Ambient shim so tsc builds even before `prisma generate`. */
declare module "../generated/prisma" {
  export class PrismaClient {
    constructor(args?: { datasources?: { db?: { url?: string } } });
    $connect(): Promise<void>;
    $queryRaw<T = unknown>(
      query: TemplateStringsArray,
      ...values: unknown[]
    ): Promise<T>;
    videoJob: {
      findUnique(args: unknown): Promise<unknown>;
      findFirst(args: unknown): Promise<unknown>;
      create(args: unknown): Promise<unknown>;
      update(args: unknown): Promise<unknown>;
      delete(args: unknown): Promise<unknown>;
      deleteMany(args: unknown): Promise<unknown>;
    };
    videoJobEvent: {
      create(args: unknown): Promise<unknown>;
    };
  }
}

declare module "./generated/prisma" {
  export class PrismaClient {
    constructor(args?: { datasources?: { db?: { url?: string } } });
    $connect(): Promise<void>;
    $queryRaw<T = unknown>(
      query: TemplateStringsArray,
      ...values: unknown[]
    ): Promise<T>;
    videoJob: Record<string, (...args: never[]) => Promise<unknown>>;
    videoJobEvent: Record<string, (...args: never[]) => Promise<unknown>>;
  }
}
