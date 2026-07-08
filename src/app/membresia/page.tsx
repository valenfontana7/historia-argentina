import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/membresia/CheckoutForm";
import { esMecenasActivo } from "@/lib/auth";
import { FAQ_MEMBRESIA, QUE_ES_MECENAS } from "@/lib/copy";
import { formatearPrecio } from "@/lib/membresia.config";
import { planesVisiblesPublico } from "@/lib/membresia-settings";
import { construirMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { sitio } from "@/lib/site.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = construirMetadata({
  titulo: "Membresía Mecenas",
  descripcion:
    "Sostené Argent y accedé a crónicas exclusivas, mapa completo y recorridos especiales.",
  ruta: "/membresia",
});

const faqs = FAQ_MEMBRESIA;

export default async function MembresiaPage() {
  if (await esMecenasActivo()) redirect("/mecenas");

  const planesPublicos = await planesVisiblesPublico();

  return (
    <div className="pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(faqs.map((f) => ({ pregunta: f.q, respuesta: f.a }))),
          ),
        }}
      />
      <section className="mx-auto max-w-3xl px-5 pb-16 text-center">
        <p className="kicker">Mecenazgo cultural</p>
        <h1 className="titulo-display mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
          Mecenas de {sitio.nombre}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave">
          {QUE_ES_MECENAS} El museo sigue siendo gratis; pagás por contenido
          exclusivo y herramientas extra.
        </p>
        <p className="mt-4 text-sm text-tinta-tenue">
          ¿Ya sos mecenas?{" "}
          <Link
            href="/membresia/acceder"
            className="text-oro-claro underline-offset-4 hover:underline"
          >
            Pedí tu enlace de acceso
          </Link>
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 pb-20 md:grid-cols-2">
        {planesPublicos.length === 0 ? (
          <div className="rounded-sm border border-linea bg-fondo-2 p-10 text-center md:col-span-2">
            <h2 className="titulo-display text-2xl font-semibold">Mecenas próximamente</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
              Estamos preparando la apertura. Si ya sos mecenas, pedí tu enlace de
              acceso abajo.
            </p>
            <Link
              href="/membresia/acceder"
              className="mt-6 inline-block text-sm text-oro-claro underline-offset-4 hover:underline"
            >
              Ya soy mecenas →
            </Link>
          </div>
        ) : (
          planesPublicos.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-sm border p-8 ${
                plan.destacado
                  ? "border-oro/50 bg-gradient-to-b from-[#1a160f] to-fondo-2"
                  : "border-linea bg-fondo-2"
              }`}
            >
              {plan.destacado && (
                <p className="mb-3 text-[0.65rem] uppercase tracking-[0.22em] text-oro">
                  Recomendado para el lanzamiento
                </p>
              )}
              <h2 className="titulo-display text-2xl font-semibold">
                {plan.nombre}
              </h2>
              <p className="mt-2 text-sm text-tinta-suave">{plan.descripcion}</p>
              <p className="mt-6">
                <span className="titulo-display text-4xl font-semibold text-oro">
                  {formatearPrecio(plan.precio)}
                </span>
                <span className="ml-2 text-sm text-tinta-tenue">
                  {plan.periodo}
                </span>
              </p>
              <ul className="mt-6 space-y-2 text-left text-sm text-tinta-suave">
                {plan.beneficios.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-oro">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <CheckoutForm
                plan={plan.id}
                destacado={plan.destacado}
                etiqueta={
                  plan.id === "fundador"
                    ? "Pagar con Mercado Pago (fundador)"
                    : "Pagar con Mercado Pago"
                }
              />
            </div>
          ))
        )}
      </section>

      <section className="border-y border-linea-suave bg-fondo-2 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="titulo-display text-center text-2xl font-semibold">
            Preguntas frecuentes
          </h2>
          <dl className="mt-10 space-y-8">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-oro-claro">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-tinta-suave">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
