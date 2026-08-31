// ── Boulder wall sound ──
// Synthesised with Web Audio rather than shipped as audio files: the whole
// palette is a few hundred bytes of code instead of a network request, which
// keeps it off the critical path alongside the fonts and analytics work.
//
// The voice is deliberately quiet and short. Every sound is triggered by a
// direct tap on the wall; nothing plays on load, on scroll, or in the
// background, and the whole thing can be muted from the wall itself.

export type BoulderSoundName = "step" | "down" | "reject" | "send" | "fall" | "brush";

const STORAGE_KEY = "boulder-sound";
/** Ceiling for every voice. Audible on laptop speakers, never startling. */
const MASTER_GAIN = 0.09;
/** Major pentatonic degrees: any subset of these sounds consonant together, so
    a climb composes a small tune no matter which line the visitor picks. */
const PENTATONIC = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const BASE_HZ = 392; // G4

type Ctx = AudioContext & { __boulderMaster?: GainNode };

let ctx: Ctx | null = null;
let enabled: boolean | null = null;

const canPlay = () =>
  typeof window !== "undefined" &&
  typeof (window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext) !==
    "undefined";

export function isBoulderSoundEnabled(): boolean {
  if (enabled !== null) return enabled;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: fall back to the default.
  }
  enabled = stored === null ? true : stored === "on";
  return enabled;
}

export function setBoulderSoundEnabled(next: boolean): void {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Preference simply does not persist; the session still respects it.
  }
}

/** Lazily built on the first tap, which is also the user gesture browsers
    require before audio may start. */
function audio(): Ctx | null {
  if (!canPlay()) return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor() as Ctx;
    const master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
    ctx.__boulderMaster = master;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One soft voice: sine body, exponential decay, no click at either end. */
function tone(
  c: Ctx,
  { at, hz, toHz, dur, peak = 1, type = "sine" }:
    { at: number; hz: number; toHz?: number; dur: number; peak?: number; type?: OscillatorType },
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(hz, at);
  if (toHz) osc.frequency.exponentialRampToValueAtTime(toHz, at + dur);
  // 8ms fade in, exponential tail out: the two ends that would otherwise click
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain);
  gain.connect(c.__boulderMaster!);
  osc.start(at);
  osc.stop(at + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

/** Filtered noise, used for the chalk brush. */
function brush(c: Ctx, at: number) {
  const frames = Math.floor(c.sampleRate * 0.26);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(2400, at);
  band.frequency.exponentialRampToValueAtTime(700, at + 0.26);
  band.Q.value = 0.8;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.5, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
  src.connect(band);
  band.connect(gain);
  gain.connect(c.__boulderMaster!);
  src.start(at);
  src.onended = () => {
    src.disconnect();
    band.disconnect();
    gain.disconnect();
  };
}

/**
 * @param step Zero-based move index; walks the pentatonic so the pitch climbs
 *             with the route and the send lands on a resolved note.
 */
export function playBoulderSound(name: BoulderSoundName, step = 0): void {
  if (!isBoulderSoundEnabled()) return;
  let c: Ctx | null = null;
  try {
    c = audio();
  } catch {
    return; // Audio unavailable or blocked: stay silent rather than throw.
  }
  if (!c) return;
  const t = c.currentTime;
  const degree = (n: number) => BASE_HZ * Math.pow(2, PENTATONIC[Math.min(n, PENTATONIC.length - 1)] / 12);

  switch (name) {
    case "step":
      tone(c, { at: t, hz: degree(step), dur: 0.16, peak: 0.9 });
      // a quiet octave above gives the tap a little sparkle
      tone(c, { at: t, hz: degree(step) * 2, dur: 0.1, peak: 0.18, type: "triangle" });
      break;
    case "down":
      tone(c, { at: t, hz: degree(Math.max(0, step)) * 0.75, dur: 0.13, peak: 0.5 });
      break;
    case "reject":
      // muted low double-knock, not an error buzz
      tone(c, { at: t, hz: 150, toHz: 110, dur: 0.1, peak: 0.7, type: "triangle" });
      tone(c, { at: t + 0.09, hz: 132, toHz: 96, dur: 0.12, peak: 0.45, type: "triangle" });
      break;
    case "send":
      [0, 2, 4, 6].forEach((d, i) => {
        tone(c, { at: t + i * 0.075, hz: degree(d + 2), dur: 0.3, peak: i === 3 ? 1 : 0.7 });
      });
      break;
    case "fall":
      tone(c, { at: t, hz: degree(Math.max(2, step)), toHz: 90, dur: 0.5, peak: 0.85, type: "triangle" });
      brush(c, t + 0.28);
      break;
    case "brush":
      brush(c, t);
      break;
  }
}
