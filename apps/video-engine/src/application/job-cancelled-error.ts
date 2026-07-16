export class JobCancelledError extends Error {
  constructor(jobId: string) {
    super(`Job ${jobId} cancelado`);
    this.name = "JobCancelledError";
  }
}

export function isJobCancelledError(err: unknown): boolean {
  return err instanceof JobCancelledError;
}
