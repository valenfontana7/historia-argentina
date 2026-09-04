import assert from "node:assert/strict";
import { carouselFromEditorial } from "../src/lib/editorial/carousel-from-editorial";
import { canTransitionAngle, canTransitionStory, canTransitionVariant } from "../src/lib/editorial/contracts";

assert.equal(canTransitionStory("discovered", "triaged"), true);
assert.equal(canTransitionStory("discovered", "researching"), false);
assert.equal(canTransitionAngle("proposed", "approved"), true);
assert.equal(canTransitionVariant("production_ready", "rendered"), true);
assert.equal(canTransitionVariant("production_ready", "approved"), false);

const weak = carouselFromEditorial({ id: "fixture-weak", brand: "labrechahoy", title: "Historia débil", body: "LaBrecha avanza con datos, impacto y límites.", claims: [{ text: "Dato 42%", sourceTitles: ["Fuente oficial"] }] });
const museum = carouselFromEditorial({ id: "fixture-strong", brand: "museoargent", title: "Historia fuerte", body: "MuseoArgent contextualiza similitudes y diferencias.", claims: [{ text: "Dato histórico", sourceTitles: ["Archivo Nacional"] }] });
assert.equal(weak.slides.some((slide) => slide.id === "sources"), true);
assert.equal(museum.slides.some((slide) => slide.id === "sources"), true);
console.log("Smoke editorial OK: transiciones humanas, fuentes visibles y variantes por marca sin publicación automática.");
