import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { TokenRecord } from "../tokens/types";
import { TokenTable } from "./TokenTable";

const token = (overrides: Partial<TokenRecord>): TokenRecord => ({
  path: "color.text.primary",
  sourceFile: "semantic.tokens.json",
  type: "color",
  value: "{color.warm.100}",
  resolvedValue: { colorSpace: "hsl", components: [40, 6, 90], hex: "#e7e6e4" },
  description: "Primary foreground for readable portfolio copy.",
  cssVariable: "--color-text-primary",
  cssValue: "40 6% 90%",
  aliasOf: "color.warm.100",
  dependents: [],
  ...overrides,
});

describe("TokenTable", () => {
  afterEach(cleanup);

  it("shows every canonical field and an accessible visual sample", () => {
    render(
      <TokenTable
        title="Color roles"
        tokens={[
          token({}),
          token({
            path: "space.4",
            type: "dimension",
            value: { value: 16, unit: "px" },
            resolvedValue: { value: 16, unit: "px" },
            cssVariable: "--space-4",
            cssValue: "16px",
            description: "Base spacing step for standard component rhythm.",
            aliasOf: undefined,
          }),
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Color roles" })).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("color.text.primary")).toBeInTheDocument();
    expect(screen.getByText("--color-text-primary")).toBeInTheDocument();
    expect(screen.getByText("40 6% 90%")).toBeInTheDocument();
    expect(screen.getByText("Primary foreground for readable portfolio copy.")).toBeInTheDocument();
    expect(screen.getByText("Aliases color.warm.100")).toBeInTheDocument();
    expect(screen.getByLabelText("Visual sample for color.text.primary")).toBeInTheDocument();
    expect(screen.getByLabelText("Visual sample for space.4")).toBeInTheDocument();
  });

  it("renders an explanatory sample for every supported token type", () => {
    const types: TokenRecord["type"][] = [
      "color",
      "dimension",
      "fontFamily",
      "fontWeight",
      "duration",
      "cubicBezier",
      "number",
    ];
    render(
      <TokenTable
        title="All types"
        tokens={types.map((type, index) =>
          token({
            path: `sample.${type}`,
            type,
            value: index,
            resolvedValue: index,
            cssVariable: `--sample-${type.toLowerCase()}`,
            cssValue: String(index),
            aliasOf: undefined,
          }),
        )}
      />,
    );

    for (const type of types) {
      expect(screen.getByLabelText(`Visual sample for sample.${type}`)).toHaveAttribute(
        "data-token-type",
        type,
      );
    }
  });

  it("presents font-size dimensions as typography rather than spacing", () => {
    render(
      <TokenTable
        title="Type scale"
        tokens={[
          token({
            path: "font.size.body",
            type: "dimension",
            value: { value: 16, unit: "px" },
            resolvedValue: { value: 16, unit: "px" },
            cssVariable: "--font-size-body",
            cssValue: "16px",
            aliasOf: undefined,
          }),
        ]}
      />,
    );

    expect(screen.getByLabelText("Visual sample for font.size.body")).toHaveTextContent("Aa");
    expect(screen.getByText("Aa")).toHaveStyle({ fontSize: "16px" });
  });

  it("uses each duration value to drive its visible sample with a reduced-motion fallback", () => {
    render(
      <TokenTable
        title="Durations"
        tokens={[
          token({
            path: "duration.fast",
            type: "duration",
            value: { value: 120, unit: "ms" },
            resolvedValue: { value: 120, unit: "ms" },
            cssVariable: "--duration-fast",
            cssValue: "120ms",
            aliasOf: undefined,
          }),
          token({
            path: "duration.slow",
            type: "duration",
            value: { value: 900, unit: "ms" },
            resolvedValue: { value: 900, unit: "ms" },
            cssVariable: "--duration-slow",
            cssValue: "900ms",
            aliasOf: undefined,
          }),
        ]}
      />,
    );

    const fastSample = screen
      .getByLabelText("Visual sample for duration.fast")
      .querySelector("[data-duration-sample]");
    const slowSample = screen
      .getByLabelText("Visual sample for duration.slow")
      .querySelector("[data-duration-sample]");

    expect(fastSample).toHaveStyle({ animationDuration: "120ms" });
    expect(slowSample).toHaveStyle({ animationDuration: "900ms" });
    expect(fastSample).not.toHaveStyle({ animationDuration: "900ms" });
    expect(fastSample).toHaveClass("animate-pulse", "motion-reduce:animate-none");
  });
});
