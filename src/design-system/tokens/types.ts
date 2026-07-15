export type DtcgType =
  | "color"
  | "dimension"
  | "fontFamily"
  | "fontWeight"
  | "duration"
  | "cubicBezier"
  | "number";

export interface DtcgColor {
  colorSpace: "hsl";
  components: [number | "none", number | "none", number | "none"];
  alpha?: number;
  hex?: string;
}

export interface DtcgDimension {
  value: number;
  unit: "px" | "rem";
}

export interface DtcgDuration {
  value: number;
  unit: "ms" | "s";
}

export type DtcgCubicBezier = [number, number, number, number];
export type DtcgValue =
  | string
  | number
  | string[]
  | DtcgColor
  | DtcgDimension
  | DtcgDuration
  | DtcgCubicBezier;
export type TokenOverrides = Record<string, DtcgValue>;

export interface TokenSource {
  filename: string;
  document: Record<string, unknown>;
}

export interface TokenIssue {
  path: string;
  code: string;
  message: string;
}

export interface TokenRecord {
  path: string;
  sourceFile: string;
  type: DtcgType;
  value: DtcgValue;
  resolvedValue: DtcgValue;
  description: string;
  cssVariable: `--${string}`;
  cssValue: string;
  aliasOf?: string;
  dependents: string[];
}

export interface TokenBundle {
  schemaVersion: 1;
  tokenHash: string;
  documents: Record<string, Record<string, unknown>>;
  tokens: TokenRecord[];
}
