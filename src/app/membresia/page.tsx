import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/membresia/CheckoutForm";
import { esMecenasActivo } from "@/lib/auth";
import { formatearPrecio } from "@/lib/membresia.config";
import { planesVisiblesPublico } from "@/lib/membresia-settings";
import { construirMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { sitio } from "@/lib/site.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = construirMetadata({
  titulo: "Membresía Mecenas",
  descripcion:
    "Sostené Argent y desbloqueá la capa narrativa exclusiva: crónicas inmersivas, 2 recorridos premium, mapa completo y carta editorial.",
  ruta: "/membresia",
});

const faqs = [
  {
    q: "¿El museo sigue siendo gratis?",
    a: "Sí. Crónicas públicas, el Panteón, lugares, períodos, 5 recorridos base y la efeméride del archivo siguen abiertos para todos. Mecenas desbloquea narrativa exclusiva y exploración avanzada.",
  },
  {
    q: "¿Qué desbloquea Mecenas hoy?",
    a: "Crónicas exclusivas mensuales, dos recorridos premium (Democracia y memoria; San Martín continental), carta editorial, mapa completo con filtros por época, timeline avanzada y navegación sin publicidad.",
  },
  {
    q: "¿Cómo pago?",
    a: "Con MercadoPago: tarjeta, débito, dinero en cuenta o los medios que ofrezca tu checkout. El plan mensual es una suscripción; el fundador es un pago anual.",
  },
  {
    q: "¿Cómo entro después de pagar?",
    a: "Te mandamos un magic link al email del pago. También podés pedir uno nuevo desde «Ya soy mecenas».",
  },
  {
    q: "¿Puedo cancelar?",
    a: "El plan mensual se cancela cuando quieras desde MercadoPago. El fundador dura un año completo desde el pago.",
  },
];

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
          No pagás por más artículos: pagás por la capa narrativa exclusiva de
          Argent. Crónicas inmersivas mensuales, dos recorridos premium, mapa
          completo con filtros y carta editorial — con el rigor visual que ya
          conocés.
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
              Estamos preparando la apertura de la membresía. Si ya sos mecenas, podés
              pedir tu enlace de acceso abajo.
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
                    ? "Ser fundador con MercadoPago"
                    : "Suscribirme con MercadoPago"
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
