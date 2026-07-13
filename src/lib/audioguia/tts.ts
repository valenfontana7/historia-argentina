/** Utilidades para audioguías con Web Speech API (TTS del dispositivo). */

const FRASES_UI =
  /\s*(Deslizá el comparador de imágenes mientras escuchás\.?|Al final de la sala, elegí tu próxima puerta de salida\.?)/gi;

/** Quita instrucciones de interfaz que el TTS lee mal en mobile. */
export function prepararTextoTts(texto: string): string {
  return texto
    .replace(FRASES_UI, "")
    .replace(/—/g, ", ")
    .replace(/[«»""]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Trocea texto largo para evitar cortes en iOS Safari. */
export function fragmentarOraciones(texto: string, maxChars = 160): string[] {
  const limpio = prepararTextoTts(texto);
  if (!limpio) return [];

  const oraciones = limpio.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (oraciones.length === 0) return [limpio];

  const trozos: string[] = [];
  let actual = "";

  for (const oracion of oraciones) {
    const candidato = actual ? `${actual} ${oracion}` : oracion;
    if (candidato.length > maxChars && actual) {
      trozos.push(actual);
      actual = oracion;
    } else {
      actual = candidato;
    }
  }

  if (actual) trozos.push(actual);
  return trozos;
}

function puntajeVoz(voz: SpeechSynthesisVoice): number {
  let puntaje = 0;
  const lang = voz.lang.toLowerCase();
  const nombre = voz.name.toLowerCase();

  if (lang === "es-ar") puntaje += 100;
  else if (lang.startsWith("es-")) puntaje += 60;
  else if (lang === "es-es" || lang === "es") puntaje += 40;

  if (nombre.includes("premium") || nombre.includes("enhanced") || nombre.includes("neural")) {
    puntaje += 35;
  }
  if (nombre.includes("paulina") || nombre.includes("diego") || nombre.includes("lucia")) {
    puntaje += 10;
  }
  if (voz.localService) puntaje += 5;

  return puntaje;
}

/** Elige la mejor voz en español disponible en el dispositivo. */
export function mejorVozEs(voces: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const candidatas = voces.filter((v) => v.lang.toLowerCase().startsWith("es"));
  if (candidatas.length === 0) return null;
  return [...candidatas].sort((a, b) => puntajeVoz(b) - puntajeVoz(a))[0] ?? null;
}

export function cargarVoces(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  const actuales = window.speechSynthesis.getVoices();
  if (actuales.length > 0) return Promise.resolve(actuales);

  return new Promise((resolve) => {
    const resolver = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", resolver);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", resolver);
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", resolver);
      resolve(window.speechSynthesis.getVoices());
    }, 800);
  });
}

export function esDispositivoMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 640px)").matches ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

type OpcionesHablar = {
  texto: string;
  voz: SpeechSynthesisVoice | null;
  onFin: () => void;
  onError: () => void;
};

let keepAliveId: number | undefined;

function iniciarKeepAlive() {
  detenerKeepAlive();
  // iOS Safari corta colas largas; el pause/resume periódico las mantiene vivas.
  keepAliveId = window.setInterval(() => {
    const synth = window.speechSynthesis;
    if (!synth.speaking) return;
    synth.pause();
    synth.resume();
  }, 8000);
}

function detenerKeepAlive() {
  if (keepAliveId !== undefined) {
    window.clearInterval(keepAliveId);
    keepAliveId = undefined;
  }
}

/** Reproduce texto en cola secuencial (más estable en mobile que encolar todo junto). */
export function hablarTexto({ texto, voz, onFin, onError }: OpcionesHablar): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError();
    return;
  }

  const trozos = fragmentarOraciones(texto, esDispositivoMobile() ? 140 : 180);
  if (trozos.length === 0) {
    onError();
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  let indice = 0;

  const siguiente = () => {
    if (indice >= trozos.length) {
      detenerKeepAlive();
      onFin();
      return;
    }

    const trozo = trozos[indice];
    indice += 1;

    const utter = new SpeechSynthesisUtterance(trozo);
    utter.lang = voz?.lang ?? "es-AR";
    if (voz) utter.voice = voz;
    utter.rate = esDispositivoMobile() ? 0.9 : 0.95;
    utter.pitch = 1;
    utter.volume = 1;
    utter.onend = siguiente;
    utter.onerror = () => {
      detenerKeepAlive();
      onError();
    };

    synth.speak(utter);
  };

  iniciarKeepAlive();
  siguiente();
}

export function detenerHabla(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  detenerKeepAlive();
}
