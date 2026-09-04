import assert from "node:assert/strict";
import test from "node:test";
import { defaultVideoCta, videoBrandFor, VIDEO_BRANDS } from "../src/branding/video-brand";

test("perfiles de marca seleccionan prompt, CTA, voz y paleta", () => {
  const brecha = videoBrandFor("labrechahoy");
  const museo = videoBrandFor("museoargent");
  assert.equal(brecha.id, "labrechahoy");
  assert.notEqual(brecha.promptRole, museo.promptRole);
  assert.notEqual(brecha.ttsVoice, museo.ttsVoice);
  assert.notEqual(brecha.colors.accent, museo.colors.accent);
  assert.equal(defaultVideoCta("labrechahoy"), brecha.cta);
  assert.equal(videoBrandFor(), VIDEO_BRANDS.museoargent);
});
