import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
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

export const ApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.header("x-api-key");
  },
);
