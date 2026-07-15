import { describe, expect, it } from "vitest";
import { compileTokenSources, formatTokenCss, TokenCompilationError } from "./compiler";

describe("compileTokenSources", () => {
  it("inherits group types and resolves cross-group aliases", () => {
    const result = compileTokenSources([{ filename: "tokens.json", document: {
      color: {
        $type: "color",
        raw: { $value: { colorSpace: "hsl", components: [0, 0, 4], hex: "#0a0a0a" } },
        canvas: { $value: "{color.raw}" },
      },
    } }]);
    expect(result.tokens.find((token) => token.path === "color.canvas")).toMatchObject({
      type: "color",
      aliasOf: "color.raw",
      cssValue: "0 0% 4%",
    });
  });

  it("reports circular aliases", () => {
    expect(() => compileTokenSources([{ filename: "tokens.json", document: {
      duration: {
        $type: "duration",
        a: { $value: "{duration.b}" },
        b: { $value: "{duration.a}" },
      },
    } }])).toThrow(TokenCompilationError);
  });

  it("formats supported DTCG values", () => {
    expect(formatTokenCss("dimension", { value: 1.5, unit: "rem" })).toBe("1.5rem");
    expect(formatTokenCss("duration", { value: 250, unit: "ms" })).toBe("250ms");
    expect(formatTokenCss("cubicBezier", [0.22, 1, 0.36, 1])).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
  });
});
