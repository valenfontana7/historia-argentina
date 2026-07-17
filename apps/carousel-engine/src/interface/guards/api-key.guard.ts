import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKey: string) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.path === "/health" || req.url?.startsWith("/health")) {
      return true;
    }
    const header = req.header("x-api-key") ?? req.header("authorization");
    const token = header?.startsWith("Bearer ")
      ? header.slice("Bearer ".length)
      : header;
    if (!token || token !== this.apiKey) {
      throw new UnauthorizedException("Invalid API key");
    }
    return true;
  }
}
