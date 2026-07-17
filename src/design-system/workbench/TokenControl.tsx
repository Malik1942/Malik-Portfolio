import { useEffect, useMemo, useState } from "react";
import { tokenBundle } from "../generated/token-manifest.generated";
import type {
  DtcgColor,
  DtcgCubicBezier,
  DtcgDimension,
  DtcgDuration,
  DtcgValue,
  TokenRecord,
} from "../tokens/types";

interface TokenControlProps {
  token: TokenRecord;
  value: DtcgValue;
  onChange: (value: DtcgValue) => void;
}

const WEIGHTS: Record<string, number> = {
  thin: 100,
  "extra-light": 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  "semi-bold": 600,
  bold: 700,
  "extra-bold": 800,
  black: 900,
};

function formatValue(value: DtcgValue): string {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if ("colorSpace" in value) {
    const [h, s, l] = value.components;
    return `hsl(${h} ${s}% ${l}% / ${value.alpha ?? 1})`;
  }
  return `${value.value}${value.unit}`;
}

function Field({ label, text, onText, min, max, step = "any" }: {
  label: string;
  text: string;
  onText: (text: string) => void;
  min?: number;
  max?: number;
  step?: number | "any";
}) {
  return (
    <label className="grid min-w-0 gap-1 text-label text-foreground/72">
      <span className="min-w-0 break-all">{label}</span>
      <input
        aria-label={label}
        type="number"
        value={text}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onText(event.target.value)}
        className="min-h-11 min-w-0 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
      />
    </label>
  );
}

export function TokenControl({ token, value, onChange }: TokenControlProps) {
  const [error, setError] = useState("");

  return (
    <fieldset aria-label={token.path} className="min-w-0 rounded-lg border border-border/60 p-4">
      <legend className="max-w-full px-1 font-mono text-label text-foreground/72 break-all">{token.path}</legend>
      <p className="mt-1 text-xs text-foreground/55">{token.description}</p>
      <div className="mt-3 grid gap-1 text-xs">
        <span>Production: {formatValue(token.resolvedValue)}</span>
        <span>Draft: {formatValue(value)}</span>
      </div>
      <div className="mt-4">
        <TypedControl token={token} value={value} onChange={(next) => { setError(""); onChange(next); }} setError={setError} />
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-4 text-xs text-destructive">{error}</p>
    </fieldset>
  );
}

function TypedControl({ token, value, onChange, setError }: TokenControlProps & { setError: (error: string) => void }) {
  if (token.type === "color") return <ColorControl path={token.path} value={value as DtcgColor} onChange={onChange} setError={setError} />;
  if (token.type === "dimension") return <DimensionControl path={token.path} value={value as DtcgDimension} onChange={onChange} setError={setError} />;
  if (token.type === "duration") return <DurationControl path={token.path} value={value as DtcgDuration} onChange={onChange} setError={setError} />;
  if (token.type === "number") return <NumberControl path={token.path} value={value as number} onChange={onChange} setError={setError} />;
  if (token.type === "fontWeight") return <WeightControl path={token.path} value={value as string | number} onChange={onChange} setError={setError} />;
  if (token.type === "fontFamily") return <FamilyControl path={token.path} value={value as string | string[]} onChange={onChange} />;
  return <BezierControl path={token.path} value={value as DtcgCubicBezier} onChange={onChange} setError={setError} />;
}

function parseFinite(text: string, message: string, setError: (error: string) => void): number | null {
  if (text.trim() === "" || !Number.isFinite(Number(text))) {
    setError(message);
    return null;
  }
  return Number(text);
}

function ColorControl({ path, value, onChange, setError }: { path: string; value: DtcgColor; onChange: (value: DtcgValue) => void; setError: (error: string) => void }) {
  const numeric = value.components.every((channel) => typeof channel === "number");
  const channels = numeric ? value.components as [number, number, number] : [0, 0, 0];
  const [texts, setTexts] = useState(() => [...channels.map(String), String(value.alpha ?? 1)]);
  useEffect(() => {
    const nextChannels = value.components.every((channel) => typeof channel === "number")
      ? value.components
      : [0, 0, 0];
    setTexts([...nextChannels.map(String), String(value.alpha ?? 1)]);
  }, [value]);
  if (!numeric) return <p className="text-xs text-foreground/72">This color contains an unspecified channel and is read-only.</p>;

  const change = (index: number, text: string) => {
    const nextTexts = [...texts];
    nextTexts[index] = text;
    setTexts(nextTexts);
    const number = parseFinite(text, "Enter a finite color channel.", setError);
    if (number === null) return;
    const max = index === 0 ? 359 : index === 3 ? 1 : 100;
    if (number < 0 || number > max) {
      setError(`Value must be between 0 and ${max}.`);
      return;
    }
    const components = [...channels] as [number, number, number];
    if (index < 3) components[index] = number;
    const next: DtcgColor = { colorSpace: "hsl", components };
    if (index === 3 || value.alpha !== undefined) next.alpha = index === 3 ? number : value.alpha;
    onChange(next);
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {(["hue", "saturation", "lightness", "alpha"] as const).map((name, index) => (
        <Field key={name} label={`${path} ${name}`} text={texts[index]} min={0} max={index === 0 ? 359 : index === 3 ? 1 : 100} step={index === 3 ? 0.01 : 1} onText={(text) => change(index, text)} />
      ))}
    </div>
  );
}

function DimensionControl({ path, value, onChange, setError }: { path: string; value: DtcgDimension; onChange: (value: DtcgValue) => void; setError: (error: string) => void }) {
  const [text, setText] = useState(String(value.value));
  useEffect(() => setText(String(value.value)), [value]);
  return <Field label={`${path} value`} text={text} onText={(next) => { setText(next); const number = parseFinite(next, "Enter a finite dimension.", setError); if (number !== null) onChange({ value: number, unit: value.unit }); }} />;
}

function DurationControl({ path, value, onChange, setError }: { path: string; value: DtcgDuration; onChange: (value: DtcgValue) => void; setError: (error: string) => void }) {
  const milliseconds = value.unit === "s" ? value.value * 1000 : value.value;
  const [text, setText] = useState(String(milliseconds));
  useEffect(() => setText(String(milliseconds)), [milliseconds]);
  return <Field label={`${path} duration`} text={text} min={0} max={5000} onText={(next) => { setText(next); const number = parseFinite(next, "Enter a finite duration.", setError); if (number === null) return; if (number < 0 || number > 5000) { setError("Duration must be between 0 and 5000 milliseconds."); return; } onChange({ value: value.unit === "s" ? number / 1000 : number, unit: value.unit }); }} />;
}

function NumberControl({ path, value, onChange, setError }: { path: string; value: number; onChange: (value: DtcgValue) => void; setError: (error: string) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return <Field label={`${path} value`} text={text} onText={(next) => { setText(next); const number = parseFinite(next, "Enter a finite number.", setError); if (number !== null) onChange(number); }} />;
}

function WeightControl({ path, value, onChange, setError }: { path: string; value: string | number; onChange: (value: DtcgValue) => void; setError: (error: string) => void }) {
  const numericValue = typeof value === "number" ? value : WEIGHTS[value] ?? 400;
  const [text, setText] = useState(String(numericValue));
  useEffect(() => setText(String(numericValue)), [numericValue]);
  return <Field label={`${path} weight`} text={text} min={1} max={1000} step={1} onText={(next) => { setText(next); const number = parseFinite(next, "Enter a finite font weight.", setError); if (number === null) return; if (number < 1 || number > 1000) { setError("Font weight must be between 1 and 1000."); return; } onChange(number); }} />;
}

function FamilyControl({ path, value, onChange }: { path: string; value: string | string[]; onChange: (value: DtcgValue) => void }) {
  const families = useMemo(() => {
    const unique = new Map<string, string[]>();
    tokenBundle.tokens.filter((token) => token.path.startsWith("font.family.")).forEach((token) => {
      const family = Array.isArray(token.resolvedValue)
        ? token.resolvedValue.map(String)
        : [String(token.resolvedValue)];
      unique.set(family.join("|"), family);
    });
    return [...unique.entries()];
  }, []);
  const current = (Array.isArray(value) ? value : [value]).join("|");
  return (
    <label className="grid gap-1 text-label text-foreground/72">
      <span>{path} family</span>
      <select aria-label={`${path} family`} value={current} onChange={(event) => onChange(families.find(([key]) => key === event.target.value)![1])} className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
        {families.map(([key, family]) => <option key={key} value={key}>{family.join(", ")}</option>)}
      </select>
    </label>
  );
}

function BezierControl({ path, value, onChange, setError }: { path: string; value: DtcgCubicBezier; onChange: (value: DtcgValue) => void; setError: (error: string) => void }) {
  const [texts, setTexts] = useState(value.map(String));
  useEffect(() => setTexts(value.map(String)), [value]);
  const names = ["x1", "y1", "x2", "y2"];
  const change = (index: number, text: string) => {
    const nextTexts = [...texts]; nextTexts[index] = text; setTexts(nextTexts);
    const number = parseFinite(text, "Enter a finite curve coordinate.", setError);
    if (number === null) return;
    if ((index === 0 || index === 2) && (number < 0 || number > 1)) { setError("Curve x coordinates must be between 0 and 1."); return; }
    const next = [...value] as DtcgCubicBezier; next[index] = number; onChange(next);
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{names.map((name, index) => <Field key={name} label={`${path} ${name}`} text={texts[index]} onText={(text) => change(index, text)} />)}</div>
      <svg data-testid="curve-preview" aria-label={`${path} curve preview`} viewBox="0 0 100 48" className="mt-3 h-12 w-full text-foreground/72"><path d={`M 0 48 C ${value[0] * 100} ${48 - value[1] * 48}, ${value[2] * 100} ${48 - value[3] * 48}, 100 0`} fill="none" stroke="currentColor" strokeWidth="2" /></svg>
    </div>
  );
}
