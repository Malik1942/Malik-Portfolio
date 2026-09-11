import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Fan,
  House,
  Info,
  Lock,
  Plus,
  Settings,
  Thermometer,
  Wifi,
} from "lucide-react";

import welcomeBg from "@/assets/flowprint-hmi-welcome.webp";
import printerPhoto from "@/assets/flowprint-hmi-printer.webp";
import headPhoto from "@/assets/flowprint-hmi-head.webp";
import printingPhoto from "@/assets/flowprint-hmi-printing.webp";
import filamentPla from "@/assets/flowprint-filament-pla.webp";
import filamentPetg from "@/assets/flowprint-filament-petg.webp";
import filamentAbs from "@/assets/flowprint-filament-abs.webp";
import filamentTpu from "@/assets/flowprint-filament-tpu.webp";
import filamentPc from "@/assets/flowprint-filament-pc.webp";

export const PRINT_MS = 5000;

type Screen =
  | "welcome"
  | "network"
  | "password"
  | "connected"
  | "filament"
  | "filament-load"
  | "home"
  | "models"
  | "prepare"
  | "printing"
  | "finished";

const NETWORKS = [
  "Malik Design",
  "University of Washington",
  "Trader Joe's Guest",
  "IKEA Guest",
  "Starbucks Guest",
  "Apple University Village",
];

const KEY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const FILAMENTS = [
  {
    id: "PLA",
    best: "Everyday prints, prototypes, decor",
    pros: "Easiest to use, low warp, good detail",
    watch: "Softens with heat",
    img: filamentPla,
  },
  {
    id: "PETG",
    best: "Functional parts, outdoor use",
    pros: "Strong, slightly flexible, more heat-resistant",
    watch: "Can string; needs good cooling",
    img: filamentPetg,
  },
  {
    id: "ABS",
    best: "Durable parts, higher-heat",
    pros: "Tough, heat-resistant",
    watch: "Warps easily, smells; needs enclosure",
    img: filamentAbs,
  },
  {
    id: "TPU",
    best: "Flexible parts, grips, gaskets",
    pros: "Very flexible, impact-resistant",
    watch: "Prints slower; harder for beginners",
    img: filamentTpu,
  },
  {
    id: "PC",
    best: "Very strong, high-heat parts",
    pros: "Super tough",
    watch: "Hard to print, high temp & dry storage",
    img: filamentPc,
  },
] as const;

const MODELS = [
  { name: "Studio bust", time: "9h 45min", grams: "107.2g" },
  { name: "Alien bust", time: "7h 21min", grams: "85.6g" },
  { name: "Garden gnome", time: "7h 21min", grams: "85.6g" },
  { name: "Benchy", time: "6h 10min", grams: "62.4g" },
  { name: "Vase study", time: "4h 02min", grams: "41.8g" },
  { name: "Helmet", time: "11h 16min", grams: "188.0g" },
];

const glass =
  "bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_40px_rgba(0,0,0,0.45)]";
const glassQuiet =
  "bg-black/35 backdrop-blur-xl border border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]";

function Scene({ src, blur, dim }: { src: string; blur?: boolean; dim?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover ${blur ? "scale-110 blur-2xl" : ""} ${dim ? "opacity-70" : ""}`}
    />
  );
}

function CircleNav({
  dir,
  label,
  onClick,
  disabled,
}: {
  dir: "back" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = dir === "back" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`${glassQuiet} flex h-[7.2cqw] w-[7.2cqw] items-center justify-center rounded-full text-white disabled:opacity-35`}
    >
      <Icon aria-hidden="true" strokeWidth={1.6} className="h-[3.1cqw] w-[3.1cqw]" />
    </button>
  );
}

function Pill({
  children,
  onClick,
  disabled,
  name,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={name}
      disabled={disabled}
      onClick={onClick}
      className={`${glassQuiet} rounded-full px-[2.4cqw] py-[1.15cqw] text-[2.05cqw] font-normal leading-none text-white disabled:opacity-35 ${className}`}
    >
      {children}
    </button>
  );
}

function SquareIcon({ children }: { children: ReactNode }) {
  return (
    <div className={`${glassQuiet} flex h-[5.6cqw] w-[5.6cqw] items-center justify-center rounded-[1.1cqw] text-white`}>
      {children}
    </div>
  );
}

export function FlowPrintHmi() {
  const reduceMotion = useReducedMotion();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [ssid, setSsid] = useState("Malik Design");
  const [password, setPassword] = useState("");
  const [filamentIndex, setFilamentIndex] = useState(0);

  useEffect(() => {
    if (screen !== "printing") return;
    if (reduceMotion) {
      setScreen("finished");
      return;
    }
    const t = window.setTimeout(() => setScreen("finished"), PRINT_MS);
    return () => window.clearTimeout(t);
  }, [screen, reduceMotion]);

  const restart = () => {
    setScreen("welcome");
    setSsid("Malik Design");
    setPassword("");
    setFilamentIndex(0);
  };

  const pickNetwork = (name: string) => {
    setSsid(name);
    setPassword("");
    setScreen("password");
  };

  const filament = FILAMENTS[filamentIndex];

  return (
    <div
      data-testid="flowprint-hmi"
      className="relative w-full overflow-hidden rounded-[1.35rem] bg-black text-white antialiased"
      style={{ aspectRatio: "16 / 9", containerType: "size" }}
    >
      <style>{`
        @keyframes flowprint-print-fill {
          from { transform: scaleY(0.06); }
          to { transform: scaleY(1); }
        }
        @keyframes flowprint-spin-dots {
          to { transform: rotate(1turn); }
        }
        @keyframes flowprint-caret {
          50% { opacity: 0; }
        }
      `}</style>

      {screen === "welcome" && (
        <>
          <Scene src={welcomeBg} blur dim />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center p-[6cqw]">
            <div className={`${glass} w-[58cqw] rounded-[2.2cqw] px-[4.2cqw] py-[4.6cqw] text-center`}>
              <p className="text-[2.15cqw] font-normal text-white/[0.88]">Welcome! Before we get started...</p>
              <h2 className="mt-[2.4cqw] text-[3.15cqw] font-medium leading-snug tracking-tight text-white">
                How experienced are you with 3D printing?
              </h2>
              <div className="mt-[3.6cqw] flex justify-center gap-[1.6cqw]">
                <Pill
                  className="min-w-[16cqw] border-white/40 bg-white/[0.06]"
                  onClick={() => {
                    setPassword("");
                    setFilamentIndex(0);
                    setScreen("network");
                  }}
                >
                  First time user
                </Pill>
                <Pill
                  className="min-w-[16cqw]"
                  onClick={() => {
                    setFilamentIndex(0);
                    setScreen("home");
                  }}
                >
                  Pro user
                </Pill>
              </div>
            </div>
          </div>
        </>
      )}

      {(screen === "network" || screen === "connected") && (
        <>
          <Scene src={welcomeBg} blur dim />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-[4.5cqw]">
            <h2 className="mb-[2.2cqw] text-[2.7cqw] font-medium tracking-tight">
              {screen === "connected" ? "Connected Successfully" : "Set up your network"}
            </h2>
            <div className={`${glass} w-[52cqw] rounded-[1.8cqw] px-[2.4cqw] py-[1.4cqw]`}>
              {NETWORKS.map((name) => (
                <button
                  key={name}
                  type="button"
                  disabled={screen === "connected"}
                  onClick={() => pickNetwork(name)}
                  className="flex w-full items-center justify-between border-b border-white/[0.12] py-[1.35cqw] text-left last:border-b-0 disabled:cursor-default"
                >
                  <span className="flex items-center gap-[1.2cqw] text-[2.05cqw] font-normal">
                    {screen === "connected" && name === ssid ? (
                      <Check aria-hidden="true" strokeWidth={2.2} className="h-[2.1cqw] w-[2.1cqw]" />
                    ) : null}
                    {name}
                  </span>
                  <span className="flex items-center gap-[1.1cqw] text-white/80">
                    <Lock aria-hidden="true" strokeWidth={1.6} className="h-[1.85cqw] w-[1.85cqw]" />
                    <Wifi aria-hidden="true" strokeWidth={1.6} className="h-[1.95cqw] w-[1.95cqw]" />
                    <Info aria-hidden="true" strokeWidth={1.6} className="h-[1.85cqw] w-[1.85cqw]" />
                  </span>
                </button>
              ))}
              <div className="border-t border-white/[0.18] py-[1.35cqw] text-[2.05cqw] text-white/80">Other...</div>
            </div>
          </div>
          <div className="absolute bottom-[3.2cqw] right-[3.2cqw] flex gap-[1.1cqw]">
            {screen === "network" ? (
              <CircleNav dir="back" label="Back" onClick={() => setScreen("welcome")} />
            ) : (
              <CircleNav dir="next" label="Continue" onClick={() => setScreen("filament")} />
            )}
          </div>
        </>
      )}

      {screen === "password" && (
        <>
          <Scene src={welcomeBg} blur dim />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center pt-[6cqw]">
            <h2 className="text-[2.7cqw] font-medium tracking-tight">Join {ssid}</h2>
            <div className="mt-[2.6cqw] flex items-center gap-[1.2cqw]">
              <div
                className={`${glass} flex h-[5.6cqw] w-[38cqw] items-center rounded-full px-[2cqw] text-[2.05cqw] text-white/90`}
              >
                <span className={password ? "tracking-[0.18em]" : "text-white/45"}>
                  {password || "Password"}
                </span>
                <span
                  className="ml-[0.35cqw] inline-block h-[2.2cqw] w-[0.18cqw] bg-white"
                  style={{ animation: "flowprint-caret 1s step-end infinite" }}
                />
              </div>
              <button
                type="button"
                aria-label="Continue"
                disabled={!password}
                onClick={() => setScreen("connected")}
                className={`${glassQuiet} flex h-[5.6cqw] w-[5.6cqw] items-center justify-center rounded-full disabled:opacity-35`}
              >
                <Check aria-hidden="true" strokeWidth={2} className="h-[2.4cqw] w-[2.4cqw]" />
              </button>
            </div>

            <div className={`${glassQuiet} mt-[3.4cqw] w-[78cqw] rounded-[1.6cqw] px-[1.4cqw] py-[1.3cqw]`}>
              {KEY_ROWS.map((row) => (
                <div key={row[0]} className="mb-[0.7cqw] flex justify-center gap-[0.55cqw] last:mb-0">
                  {row.map((key) => (
                    <button
                      key={key}
                      type="button"
                      aria-label={key}
                      onClick={() => setPassword((p) => p + key)}
                      className="h-[5.1cqw] w-[6.4cqw] rounded-[0.85cqw] bg-white/[0.09] text-[2.05cqw] font-normal text-white"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
              <div className="mt-[0.7cqw] flex justify-center gap-[0.55cqw]">
                <button
                  type="button"
                  aria-label="delete"
                  onClick={() => setPassword((p) => p.slice(0, -1))}
                  className="h-[5.1cqw] w-[10cqw] rounded-[0.85cqw] bg-white/[0.09] text-[1.7cqw] text-white/80"
                >
                  ⌫
                </button>
                <button
                  type="button"
                  aria-label="spc"
                  onClick={() => setPassword((p) => p + " ")}
                  className="h-[5.1cqw] w-[28cqw] rounded-[0.85cqw] bg-white/[0.09]"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {screen === "filament" && filament && (
        <>
          <div className="absolute inset-0 bg-[#1a1a1a]" />
          <div className="absolute inset-0 flex flex-col items-center px-[6cqw] pt-[4.2cqw] text-center">
            <p className="text-[2.15cqw] font-normal text-white/80">Filaments instructions</p>
            <h2 className="mt-[0.6cqw] text-[3.4cqw] font-medium tracking-tight">{filament.id}</h2>
            <img
              src={filament.img}
              alt=""
              className="mt-[1.4cqw] h-[28cqh] w-auto object-contain"
            />
            <ul className="mt-[1.6cqw] space-y-[0.55cqw] text-left text-[1.85cqw] font-normal leading-snug text-white/[0.92]">
              <li>
                <span className="font-medium">Best for –</span> {filament.best}
              </li>
              <li>
                <span className="font-medium">Pros –</span> {filament.pros}
              </li>
              <li>
                <span className="font-medium">Watch out –</span> {filament.watch}
              </li>
            </ul>
            <div className="mt-auto mb-[4.5cqw] flex gap-[0.7cqw]">
              {FILAMENTS.map((item, i) => (
                <span
                  key={item.id}
                  className={`h-[0.85cqw] w-[0.85cqw] rounded-full ${i === filamentIndex ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-[3.2cqw] right-[3.2cqw] flex gap-[1.1cqw]">
            <CircleNav
              dir="back"
              label="Back"
              onClick={() => {
                if (filamentIndex === 0) setScreen("connected");
                else setFilamentIndex((i) => i - 1);
              }}
            />
            <CircleNav
              dir="next"
              label="Next"
              onClick={() => {
                if (filamentIndex === FILAMENTS.length - 1) setScreen("filament-load");
                else setFilamentIndex((i) => i + 1);
              }}
            />
          </div>
        </>
      )}

      {screen === "filament-load" && (
        <>
          <Scene src={printerPhoto} dim />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex items-center justify-center p-[6cqw]">
            <div className={`${glass} w-[48cqw] rounded-[2cqw] px-[3.4cqw] py-[3.6cqw] text-center`}>
              <h2 className="text-[2.7cqw] font-medium tracking-tight">Load filament</h2>
              <p className="mt-[1.4cqw] text-[1.95cqw] leading-snug text-white/80">
                Slot 1 is ready for PLA. Confirm to finish setup and go to the printer home.
              </p>
              <div className="mt-[2.6cqw] flex justify-center">
                <Pill className="min-w-[18cqw] border-white/40" onClick={() => setScreen("home")}>
                  Load filament
                </Pill>
              </div>
            </div>
          </div>
        </>
      )}

      {screen === "home" && (
        <>
          <div className="absolute inset-0 bg-[#050505]" />
          <img
            src={printerPhoto}
            alt=""
            className="pointer-events-none absolute left-[11cqw] top-1/2 h-[90cqh] w-[56cqw] -translate-y-1/2 object-contain"
          />
          <div className="absolute left-[2.2cqw] top-[6cqw] bottom-[6cqw] flex w-[7.6cqw] flex-col items-center justify-between rounded-full bg-black/55 py-[2.4cqw] text-white/85 backdrop-blur-xl border border-white/[0.12]">
            <Wifi aria-hidden="true" strokeWidth={1.5} className="h-[2.4cqw] w-[2.4cqw]" />
            <Plus aria-hidden="true" strokeWidth={1.5} className="h-[2.4cqw] w-[2.4cqw]" />
            <span className="flex h-[4.4cqw] w-[4.4cqw] items-center justify-center rounded-full bg-white/15 shadow-[0_0_18px_rgba(255,255,255,0.28)]">
              <House aria-hidden="true" strokeWidth={1.6} className="h-[2.3cqw] w-[2.3cqw]" />
            </span>
            <Settings aria-hidden="true" strokeWidth={1.5} className="h-[2.4cqw] w-[2.4cqw]" />
          </div>

          <button
            type="button"
            onClick={() => setScreen("models")}
            className={`${glass} absolute left-[36cqw] top-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full px-[2.8cqw] py-[1.25cqw] text-[2.05cqw] font-normal`}
          >
            Tap to Start Printing
          </button>

          <div className="absolute right-[3cqw] top-[8cqh] flex w-[24cqw] flex-col gap-[1.6cqw]">
            <div className={`${glassQuiet} overflow-hidden rounded-[1.4cqw] p-[1.3cqw]`}>
              <div className="mb-[0.8cqw] text-[1.35cqw] tracking-wide text-white/55">AMS</div>
              <div className="grid grid-cols-4 gap-[0.55cqw]">
                {["#f4f0ea", "#3b82f6", "#22c55e", "#f97316"].map((color) => (
                  <div key={color} className="flex aspect-square items-center justify-center rounded-[0.7cqw] bg-white/10">
                    <span className="h-[70%] w-[70%] rounded-full" style={{ background: color }} />
                  </div>
                ))}
              </div>
            </div>
            <div className={`${glassQuiet} flex items-center gap-[1.1cqw] rounded-[1.4cqw] p-[1.2cqw]`}>
              <img src={headPhoto} alt="" className="h-[8.5cqw] w-[8.5cqw] object-contain" />
              <div className="space-y-[0.7cqw] text-[1.85cqw]">
                <div className="flex items-center gap-[0.55cqw]">
                  <Thermometer aria-hidden="true" className="h-[1.8cqw] w-[1.8cqw]" strokeWidth={1.6} />
                  205°C
                </div>
                <div className="flex items-center gap-[0.55cqw]">
                  <Fan aria-hidden="true" className="h-[1.8cqw] w-[1.8cqw]" strokeWidth={1.6} />
                  30%
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={restart}
            className="absolute bottom-[2.4cqw] left-[2.4cqw] text-[1.45cqw] font-normal text-white/45"
          >
            Start over
          </button>
        </>
      )}

      {screen === "models" && (
        <>
          <Scene src={welcomeBg} blur />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex flex-col px-[4cqw] pt-[2.6cqw]">
            <div className="relative mb-[2cqw] flex items-center justify-between">
              <SquareIcon>
                <span className="h-[2.3cqw] w-[2.3cqw] rounded-full border-2 border-emerald-400" />
              </SquareIcon>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-[2.7cqw] font-light italic tracking-tight">
                Models
              </h2>
              <div className="flex gap-[0.8cqw]">
                <CircleNav dir="back" label="Back" onClick={() => setScreen("home")} />
                <CircleNav dir="next" label="Forward" onClick={() => {}} disabled />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[1.3cqw]">
              {MODELS.map((model) => (
                <button
                  key={model.name}
                  type="button"
                  aria-label={model.name}
                  onClick={() => setScreen("prepare")}
                  className={`${glassQuiet} flex items-center gap-[1.1cqw] rounded-[1.3cqw] p-[1.1cqw] text-left`}
                >
                  <img src={printingPhoto} alt="" className="h-[7.6cqw] w-[7.6cqw] rounded-[0.7cqw] object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-[1.7cqw] font-medium">{model.name}</span>
                    <span className="mt-[0.25cqw] block text-[1.45cqw] text-white/70">{model.time}</span>
                    <span className="block text-[1.45cqw] text-white/70">PLA · {model.grams}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {screen === "prepare" && (
        <>
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <img
            src={printingPhoto}
            alt=""
            className="absolute left-1/2 top-[54%] h-[62cqh] w-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
          />
          <div className="absolute left-[3cqw] top-[3cqw] flex flex-col items-start gap-[0.9cqw]">
            <div className={`${glassQuiet} rounded-full px-[2.4cqw] py-[1.15cqw] text-[2.05cqw] font-normal leading-none`}>
              Extra Fine
            </div>
            <div className="flex gap-[0.7cqw]">
              <SquareIcon>
                <span className="h-[2.2cqw] w-[2.2cqw] rounded-full bg-emerald-500" />
              </SquareIcon>
              <SquareIcon>
                <Settings aria-hidden="true" className="h-[2.2cqw] w-[2.2cqw]" strokeWidth={1.5} />
              </SquareIcon>
            </div>
          </div>
          <div className="absolute right-[3cqw] top-[3cqw] flex items-center gap-[0.8cqw]">
            <div className={`${glassQuiet} rounded-full px-[2.4cqw] py-[1.15cqw] text-[2.05cqw] font-normal leading-none`}>
              Auto Setting
            </div>
            <CircleNav dir="back" label="Back" onClick={() => setScreen("models")} />
          </div>
          <div className={`${glass} absolute left-1/2 top-[46%] w-[46cqw] -translate-x-1/2 -translate-y-1/2 rounded-[2cqw] px-[2.4cqw] py-[2.2cqw] text-center`}>
            <h2 className="text-[2.5cqw] font-medium">Prepare</h2>
            <div className="mt-[1.8cqw] grid grid-cols-3 gap-[1cqw] text-[1.7cqw]">
              <div>
                <div className="font-light italic">9h 45min</div>
                <div className="mx-auto mt-[0.9cqw] h-[4.4cqw] w-[4.4cqw] rounded-[0.8cqw] border border-white/30" />
                <div className={`${glassQuiet} mx-auto mt-[0.8cqw] w-fit rounded-full px-[1.1cqw] py-[0.35cqw] text-[1.35cqw]`}>
                  Model
                </div>
              </div>
              <div>
                <div className="font-light italic">PLA</div>
                <div className="relative mx-auto mt-[0.9cqw] h-[4.4cqw] w-[4.4cqw]">
                  <span className="absolute inset-[-30%] rounded-full bg-emerald-500/35 blur-md" />
                  <span className="relative block h-full w-full rounded-full border-2 border-white/40" />
                </div>
                <div className={`${glassQuiet} mx-auto mt-[0.8cqw] w-fit rounded-full px-[1.1cqw] py-[0.35cqw] text-[1.35cqw]`}>
                  Filament
                </div>
              </div>
              <div>
                <div className="font-light italic">60°C</div>
                <div className="mx-auto mt-[0.9cqw] h-[4.4cqw] w-[4.4cqw] rounded-[0.8cqw] border border-white/30" />
                <div className={`${glassQuiet} mx-auto mt-[0.8cqw] w-fit rounded-full px-[1.1cqw] py-[0.35cqw] text-[1.35cqw]`}>
                  Bed
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setScreen("printing")}
              className={`${glassQuiet} mt-[2cqw] rounded-full px-[3.4cqw] py-[1.15cqw] text-[2.05cqw]`}
            >
              Start Print
            </button>
          </div>
        </>
      )}

      {screen === "printing" && (
        <>
          <Scene src={printingPhoto} />
          <div className="absolute inset-0 bg-black/25" />
          <h2 className="absolute left-1/2 top-[4.2cqw] -translate-x-1/2 text-[3.2cqw] font-light italic tracking-tight">
            Printing
          </h2>
          <div className="absolute right-[3.4cqw] top-[18cqh] flex h-[58cqh] flex-col items-center gap-[1.2cqw]">
            <div className="relative h-full w-[1.15cqw] overflow-hidden rounded-full bg-white/20">
              <div
                className="absolute bottom-0 left-0 right-0 h-full origin-bottom rounded-full bg-white/80"
                style={{
                  animation: reduceMotion ? undefined : `flowprint-print-fill ${PRINT_MS}ms linear forwards`,
                  transform: reduceMotion ? "scaleY(1)" : undefined,
                }}
              />
            </div>
            <div
              className="grid h-[2.4cqw] w-[2.4cqw] grid-cols-2 gap-[0.25cqw]"
              style={{ animation: "flowprint-spin-dots 1.1s linear infinite" }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="rounded-full bg-white/80" />
              ))}
            </div>
          </div>
        </>
      )}

      {screen === "finished" && (
        <>
          <Scene src={printingPhoto} blur dim />
          <div className="absolute inset-0 bg-black/50" />
          <h2 className="absolute left-1/2 top-[4.2cqw] -translate-x-1/2 text-[3.2cqw] font-light italic tracking-tight">
            Finished Printing
          </h2>
          <div className="absolute right-[3.2cqw] top-[3.2cqw]">
            <CircleNav dir="next" label="Continue" onClick={() => setScreen("home")} />
          </div>
          <div className="absolute left-1/2 top-[52%] grid w-[52cqw] -translate-x-1/2 -translate-y-1/2 grid-cols-2 gap-[1.4cqw]">
            {[
              ["Duration", "8h 23min"],
              ["Filament", "76g PLA Basic"],
              ["Print Errors", "0 times"],
              ["Layer", "237 / 237"],
            ].map(([label, value]) => (
              <div key={label} className={`${glass} rounded-[1.5cqw] px-[2cqw] py-[1.8cqw]`}>
                <div className="text-[1.7cqw] text-white/75">{label}</div>
                <div className="mt-[0.5cqw] text-[2.35cqw] font-light italic">{value}</div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-[3.2cqw] left-1/2 flex -translate-x-1/2 gap-[0.7cqw]">
            <span className="h-[0.85cqw] w-[0.85cqw] rounded-full bg-white/30" />
            <span className="h-[0.85cqw] w-[0.85cqw] rounded-full bg-white" />
          </div>
        </>
      )}
    </div>
  );
}
