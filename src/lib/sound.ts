/**
 * Sonidos de la web, sintetizados con WebAudio (ruido filtrado + envolventes): sin archivos, sin licencias.
 *
 * Uso:
 *   import { playSound, toggleMuted } from '../lib/sound';
 *   playSound('flame-on');
 *
 * Nombres disponibles (SoundName):
 *   'flame-on'       cerilla que raspa y llama que prende (candelabro encendido / modo dia)
 *   'flame-off'      soplo y siseo de llama que se apaga (modo noche)
 *   'pick'           coger un objeto (inicio de arrastre)
 *   'drop'           soltar un objeto sobre la mesa
 *   'eye'            clic en el retrato / ojo
 *   'hover'          rotulo al pasar el cursor (muy sutil)
 *   'paper'          roce de papel (carta de About)
 *   'seal-break'     el lacre se rompe
 *   'envelope-open'  el sobre se abre
 *
 * Reglas:
 *  - Nada suena hasta el primer gesto real del usuario (clic, tecla o toque): antes, playSound no hace nada.
 *  - Volumen general bajo (MASTER). El silencio se recuerda en localStorage['as-sound'] ('off' | 'on').
 *  - Si el usuario ha pedido reducir movimiento, no se cambia nada: el sonido solo lo controla el interruptor.
 *  - setMuted / toggleMuted avisan con el evento 'as-sound-change' (detail: { muted }) para sincronizar botones.
 */

export type SoundName =
  | 'flame-on' | 'flame-off' | 'pick' | 'drop' | 'eye' | 'hover'
  | 'paper' | 'seal-break' | 'envelope-open';

const KEY = 'as-sound';
const MASTER = 0.35;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let gesture = false;
let muted = readMuted();
const lastPlayed = new Map<SoundName, number>();

function readMuted(): boolean {
  try { return localStorage.getItem(KEY) === 'off'; } catch { return false; }
}

// el primer gesto real habilita el audio (los navegadores no dejan sonar antes)
if (typeof window !== 'undefined') {
  const arm = () => { gesture = true; };
  for (const ev of ['pointerdown', 'keydown', 'touchstart'] as const) {
    window.addEventListener(ev, arm, { once: true, capture: true, passive: true });
  }
}

export function isMuted(): boolean { return muted; }

export function setMuted(value: boolean): void {
  muted = value;
  try { localStorage.setItem(KEY, value ? 'off' : 'on'); } catch { /* sin almacenamiento: solo vale para esta pagina */ }
  window.dispatchEvent(new CustomEvent('as-sound-change', { detail: { muted: value } }));
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

/** Contexto creado de forma perezosa; devuelve null si aun no hay gesto o no hay WebAudio. */
function audio(): AudioContext | null {
  if (!gesture) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = MASTER;
    master.connect(ctx.destination);
    // 2 s de ruido blanco reutilizable
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface NoiseOpts { at?: number; dur: number; type?: BiquadFilterType; f0: number; f1?: number; q?: number; gain: number; attack?: number }

/** Ruido filtrado con barrido de frecuencia y envolvente de ataque/caida. */
function burst(c: AudioContext, o: NoiseOpts): void {
  const t = c.currentTime + (o.at ?? 0);
  const src = c.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = o.type ?? 'bandpass';
  filter.Q.value = o.q ?? 0.8;
  filter.frequency.setValueAtTime(o.f0, t);
  if (o.f1) filter.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur);
  const g = c.createGain();
  const a = o.attack ?? 0.005;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  src.connect(filter).connect(g).connect(master!);
  src.start(t, Math.random() * 1.5);
  src.stop(t + o.dur + 0.05);
}

interface ToneOpts { at?: number; dur: number; f0: number; f1?: number; type?: OscillatorType; gain: number }

function tone(c: AudioContext, o: ToneOpts): void {
  const t = c.currentTime + (o.at ?? 0);
  const osc = c.createOscillator();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.f0, t);
  if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  osc.connect(g).connect(master!);
  osc.start(t);
  osc.stop(t + o.dur + 0.05);
}

/** Varios roces cortos seguidos: suena a papel que se arrastra. */
function rustle(c: AudioContext, at: number, n: number, gain: number): void {
  for (let i = 0; i < n; i++) {
    burst(c, { at: at + i * 0.055 + Math.random() * 0.03, dur: 0.07 + Math.random() * 0.05, type: 'bandpass', f0: 2600 + Math.random() * 2400, q: 0.5, gain: gain * (0.5 + Math.random() * 0.5) });
  }
}

const RECIPES: Record<SoundName, (c: AudioContext) => void> = {
  'flame-on': (c) => {
    burst(c, { dur: 0.2, f0: 3400, f1: 1600, q: 0.7, gain: 0.5, attack: 0.01 });           // raspa la cerilla
    burst(c, { at: 0.17, dur: 0.7, f0: 350, f1: 1400, q: 0.6, gain: 0.55, attack: 0.08 });  // prende
    for (let i = 0; i < 5; i++) burst(c, { at: 0.4 + Math.random() * 0.8, dur: 0.02, type: 'highpass', f0: 3000, gain: 0.12 + Math.random() * 0.1 }); // chisporroteo
  },
  'flame-off': (c) => {
    burst(c, { dur: 0.35, f0: 900, f1: 250, q: 0.5, gain: 0.45, attack: 0.03 });             // soplo
    burst(c, { at: 0.1, dur: 0.7, type: 'highpass', f0: 4200, q: 0.4, gain: 0.12, attack: 0.1 }); // siseo del pabilo
  },
  pick: (c) => {
    tone(c, { dur: 0.09, f0: 200, f1: 130, gain: 0.22 });
    burst(c, { dur: 0.05, f0: 1300, q: 1, gain: 0.12 });
  },
  drop: (c) => {
    tone(c, { dur: 0.16, f0: 120, f1: 55, gain: 0.4 });
    burst(c, { dur: 0.08, type: 'lowpass', f0: 700, f1: 250, gain: 0.3 });
  },
  eye: (c) => {
    tone(c, { dur: 0.05, f0: 950, f1: 600, type: 'triangle', gain: 0.1 });
    tone(c, { at: 0.07, dur: 0.22, f0: 1480, type: 'sine', gain: 0.06 }); // vidrio
    burst(c, { dur: 0.04, f0: 2500, q: 1.2, gain: 0.08 });
  },
  hover: (c) => {
    burst(c, { dur: 0.07, f0: 2300, f1: 1800, q: 1, gain: 0.035, attack: 0.02 });
  },
  paper: (c) => rustle(c, 0, 5, 0.16),
  'seal-break': (c) => {
    burst(c, { dur: 0.05, f0: 1900, q: 1.5, gain: 0.55, attack: 0.002 });                    // crac seco
    tone(c, { dur: 0.14, f0: 240, f1: 80, type: 'triangle', gain: 0.35 });
    burst(c, { at: 0.06, dur: 0.12, type: 'highpass', f0: 3500, gain: 0.2 });                // esquirlas de cera
  },
  'envelope-open': (c) => {
    rustle(c, 0, 7, 0.2);
    burst(c, { at: 0.05, dur: 0.3, type: 'lowpass', f0: 500, gain: 0.12, attack: 0.1 });
    tone(c, { at: 0.34, dur: 0.1, f0: 150, f1: 100, gain: 0.12 });                            // el papel se asienta
  },
};

/** Cada sonido se puede lanzar como mucho una vez por este intervalo (ms), para que el hover no ametralle. */
const MIN_GAP: Partial<Record<SoundName, number>> = { hover: 140, pick: 60, drop: 60 };

export function playSound(name: SoundName): void {
  if (muted || typeof window === 'undefined') return;
  const now = performance.now();
  if (now - (lastPlayed.get(name) ?? -1e9) < (MIN_GAP[name] ?? 0)) return;
  const c = audio();
  if (!c) return;
  lastPlayed.set(name, now);
  RECIPES[name](c);
}
