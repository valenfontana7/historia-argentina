/** Señales de abort por jobId (cancelación desde HTTP mientras corre el pipeline). */

const controllers = new Map<string, AbortController>();

export function registerJobAbort(jobId: string): AbortSignal {
  controllers.get(jobId)?.abort();
  const ac = new AbortController();
  controllers.set(jobId, ac);
  return ac.signal;
}

export function abortJob(jobId: string): void {
  const ac = controllers.get(jobId);
  if (ac) {
    ac.abort();
    controllers.delete(jobId);
  }
}

export function clearJobAbort(jobId: string): void {
  controllers.delete(jobId);
}

export function jobAbortSignal(jobId: string): AbortSignal | undefined {
  return controllers.get(jobId)?.signal;
}
