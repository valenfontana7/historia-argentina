import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CarouselSchema } from "./carousel";
import { CreateCarouselJobRequestSchema } from "./job";
import { DEFAULT_RENDERING_PROFILES, IMPLEMENTED_PROFILES } from "./profile";
import { DEFAULT_TEMPLATE } from "./template";
import { DEFAULT_THEME } from "./theme";

const sample = {
  id: "fixture-cruzada",
  title: "La Cruzada Libertadora",
  locale: "es-AR",
  slides: [
    {
      id: "s1",
      type: "cover",
      title: "La Cruzada Libertadora",
      subtitle: "1955",
      kicker: "Historia argentina",
    },
    {
      id: "s2",
      type: "content",
      title: "El contexto",
      body: "Un país tensionado entre lealtades y rupturas institucionales.",
    },
    {
      id: "s3",
      type: "quote",
      quote: "La historia no se escribe con consignas.",
      attribution: "Argent",
    },
    {
      id: "s4",
      type: "statistic",
      value: "1955",
      label: "Año bisagra",
      context: "Golpe y exilio",
    },
    {
      id: "s5",
      type: "gallery",
      images: [
        { id: "a1", src: "fixture://a.png" },
        { id: "a2", src: "fixture://b.png" },
      ],
    },
    {
      id: "s6",
      type: "ending_cta",
      title: "Seguí explorando",
      cta: "Leé la crónica",
    },
  ],
};

describe("carousel-contracts", () => {
  it("parses a full carousel fixture", () => {
    const doc = CarouselSchema.parse(sample);
    assert.equal(doc.slides.length, 6);
    assert.equal(doc.locale, "es-AR");
  });

  it("creates a job request with defaults", () => {
    const req = CreateCarouselJobRequestSchema.parse({ carousel: sample });
    assert.equal(req.templateId, DEFAULT_TEMPLATE.id);
    assert.equal(req.templateVersion, DEFAULT_TEMPLATE.version);
    assert.equal(req.themeId, DEFAULT_THEME);
    assert.equal(req.profileId, "instagram_feed");
  });

  it("exposes implemented profiles", () => {
    for (const id of IMPLEMENTED_PROFILES) {
      assert.ok(DEFAULT_RENDERING_PROFILES[id]);
    }
  });
});
