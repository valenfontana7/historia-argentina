import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import express from "express";
import { describe, it } from "node:test";
import {
  mountCarouselProxy,
  resolveCarouselUpstream,
} from "../src/interface/http/carousel-proxy";

describe("carousel-proxy", () => {
  it("resolveCarouselUpstream defaults to :4120", () => {
    assert.equal(
      resolveCarouselUpstream({}),
      "http://127.0.0.1:4120",
    );
    assert.equal(
      resolveCarouselUpstream({ CAROUSEL_ENGINE_PORT: "4133" }),
      "http://127.0.0.1:4133",
    );
    assert.equal(
      resolveCarouselUpstream({
        CAROUSEL_ENGINE_UPSTREAM: "http://127.0.0.1:9999/",
      }),
      "http://127.0.0.1:9999",
    );
  });

  it("proxies /carousel/* to upstream with path rewrite", async () => {
    const upstream = http.createServer((req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          path: req.url,
          key: req.headers["x-api-key"] ?? null,
        }),
      );
    });
    upstream.listen(0, "127.0.0.1");
    await once(upstream, "listening");
    const upstreamPort = (upstream.address() as { port: number }).port;

    const app = express();
    mountCarouselProxy(app, `http://127.0.0.1:${upstreamPort}`);
    const proxyServer = http.createServer(app);
    proxyServer.listen(0, "127.0.0.1");
    await once(proxyServer, "listening");
    const proxyPort = (proxyServer.address() as { port: number }).port;

    try {
      const res = await fetch(
        `http://127.0.0.1:${proxyPort}/carousel/jobs?limit=2`,
        { headers: { "x-api-key": "media-key" } },
      );
      assert.equal(res.status, 200);
      const body = (await res.json()) as { path: string; key: string };
      assert.equal(body.path, "/jobs?limit=2");
      assert.equal(body.key, "media-key");
    } finally {
      proxyServer.close();
      upstream.close();
    }
  });

  it("proxies /carousel/health preserving enriched shape", async () => {
    const healthPayload = {
      ok: true,
      service: "carousel-engine",
      renderer: "playwright",
      chromiumOk: true,
      storageRoot: "/tmp/carousel",
    };
    const upstream = http.createServer((req, res) => {
      assert.equal(req.url, "/health");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(healthPayload));
    });
    upstream.listen(0, "127.0.0.1");
    await once(upstream, "listening");
    const upstreamPort = (upstream.address() as { port: number }).port;

    const app = express();
    mountCarouselProxy(app, `http://127.0.0.1:${upstreamPort}`);
    const proxyServer = http.createServer(app);
    proxyServer.listen(0, "127.0.0.1");
    await once(proxyServer, "listening");
    const proxyPort = (proxyServer.address() as { port: number }).port;

    try {
      const res = await fetch(
        `http://127.0.0.1:${proxyPort}/carousel/health`,
      );
      assert.equal(res.status, 200);
      const body = (await res.json()) as typeof healthPayload;
      assert.equal(body.ok, true);
      assert.equal(body.service, "carousel-engine");
      assert.equal(body.renderer, "playwright");
      assert.equal(body.chromiumOk, true);
      assert.equal(body.storageRoot, "/tmp/carousel");
    } finally {
      proxyServer.close();
      upstream.close();
    }
  });
});
