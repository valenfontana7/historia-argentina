export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class InsufficientAssetScoreError extends DomainError {
  constructor(scene: number, score: number, threshold: number) {
    super(
      `Scene ${scene}: asset score ${score.toFixed(2)} below threshold ${threshold}`,
    );
    this.name = "InsufficientAssetScoreError";
  }
}

export class MissingBinaryError extends DomainError {
  constructor(binary: string) {
    super(`Required binary not found: ${binary}`);
    this.name = "MissingBinaryError";
  }
}
