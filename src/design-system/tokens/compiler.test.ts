import { describe, expect, it } from "vitest";
import { compileTokenSources, formatTokenCss, TokenCompilationError } from "./compiler";
import type { DtcgColor, DtcgType, TokenSource } from "./types";

function captureCompilationError(sources: TokenSource[]): TokenCompilationError {
  try {
    compileTokenSources(sources);
  } catch (error) {
    expect(error).toBeInstanceOf(TokenCompilationError);
    return error as TokenCompilationError;
  }

  throw new Error("Expected token compilation to fail.");
}

function compileSingleValue(type: DtcgType, value: unknown) {
  return compileTokenSources([{ filename: "tokens.json", document: {
    token: { $type: type, $value: value },
  } }]);
}

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

  it("reports missing aliases", () => {
    const error = captureCompilationError([{ filename: "tokens.json", document: {
      size: { $type: "dimension", alias: { $value: "{size.missing}" } },
    } }]);

    expect(error.issues).toEqual([{
      path: "size.alias",
      code: "missing-alias",
      message: 'Alias target "size.missing" does not exist.',
    }]);
  });

  it("reports type-incompatible aliases", () => {
    const error = captureCompilationError([{ filename: "tokens.json", document: {
      number: { $type: "number", raw: { $value: 1 } },
      size: { $type: "dimension", alias: { $value: "{number.raw}" } },
    } }]);

    expect(error.issues).toEqual([{
      path: "size.alias",
      code: "incompatible-alias",
      message: 'Alias target "number.raw" has type "number", not "dimension".',
    }]);
  });

  it('stores a "__proto__" source as an own enumerable document key', () => {
    const result = compileTokenSources([{ filename: "__proto__", document: {
      token: { $type: "number", $value: 1 },
    } }]);

    expect(Object.prototype.hasOwnProperty.call(result.documents, "__proto__")).toBe(true);
    expect(Object.keys(result.documents)).toContain("__proto__");
  });

  it('includes a "__proto__" source in the token hash', () => {
    const empty = compileTokenSources([]);
    const result = compileTokenSources([{ filename: "__proto__", document: {
      token: { $type: "number", $value: 1 },
    } }]);

    expect(result.tokenHash).not.toBe(empty.tokenHash);
  });

  it('reports duplicate "__proto__" source filenames', () => {
    const error = captureCompilationError([
      { filename: "__proto__", document: {
        first: { $type: "number", $value: 1 },
      } },
      { filename: "__proto__", document: {
        second: { $type: "number", $value: 2 },
      } },
    ]);

    expect(error.issues).toEqual([{
      path: "__proto__",
      code: "duplicate-source",
      message: "Source filename is duplicated.",
    }]);
  });

  it("collects sorted transitive reverse-alias dependents", () => {
    const result = compileTokenSources([{ filename: "tokens.json", document: {
      size: {
        $type: "dimension",
        a: { $value: { value: 4, unit: "px" } },
        d: { $value: "{size.a}" },
        b: { $value: "{size.a}" },
        c: { $value: "{size.b}" },
      },
    } }]);
    const dependentsByPath = Object.fromEntries(
      result.tokens.map((token) => [token.path, token.dependents]),
    );

    expect(dependentsByPath).toEqual({
      "size.a": ["size.b", "size.c", "size.d"],
      "size.b": ["size.c"],
      "size.c": [],
      "size.d": [],
    });
  });

  it("rejects normalized CSS-variable collisions deterministically", () => {
    const error = captureCompilationError([{ filename: "tokens.json", document: {
      brand: {
        $type: "number",
        accentColor: { $value: 1 },
        "accent-color": { $value: 2 },
      },
    } }]);

    expect(error.issues).toEqual([
      {
        path: "brand.accent-color",
        code: "css-variable-collision",
        message: 'CSS variable "--brand-accent-color" also represents token path "brand.accentColor".',
      },
      {
        path: "brand.accentColor",
        code: "css-variable-collision",
        message: 'CSS variable "--brand-accent-color" also represents token path "brand.accent-color".',
      },
    ]);
  });

  describe("stable hashing", () => {
    it.each([
      ["ASCII", "tokens.json", "token", "db298c23"],
      ["Unicode", "tøken.json", "café", "f4ae2ab5"],
    ])("matches the %s UTF-8 FNV-1a vector", (_label, filename, tokenName, hash) => {
      const result = compileTokenSources([{ filename, document: {
        [tokenName]: { $type: "number", $value: 1 },
      } }]);

      expect(result.tokenHash).toBe(hash);
    });

    it("sorts tokens and hashes equivalent source ordering identically", () => {
      const first = compileTokenSources([
        { filename: "z.json", document: {
          zed: { $type: "number", $value: 3 },
          alpha: { $type: "number", $value: 1 },
        } },
        { filename: "a.json", document: {
          middle: { $type: "number", $value: 2 },
        } },
      ]);
      const second = compileTokenSources([
        { filename: "a.json", document: {
          middle: { $value: 2, $type: "number" },
        } },
        { filename: "z.json", document: {
          alpha: { $value: 1, $type: "number" },
          zed: { $value: 3, $type: "number" },
        } },
      ]);

      expect(first.tokens.map((token) => token.path)).toEqual([
        "alpha",
        "middle",
        "zed",
      ]);
      expect(second.tokens.map((token) => token.path)).toEqual([
        "alpha",
        "middle",
        "zed",
      ]);
      expect(second.tokenHash).toBe(first.tokenHash);
    });
  });

  describe("path syntax", () => {
    it.each([
      ["period", "bad.name"],
      ["opening brace", "bad{name"],
      ["closing brace", "bad}name"],
    ])("rejects a token or group name containing a %s", (_label, name) => {
      const error = captureCompilationError([{ filename: "tokens.json", document: {
        [name]: { $type: "number", child: { $value: 1 } },
      } }]);

      expect(error.issues).toContainEqual({
        path: name,
        code: "ambiguous-name",
        message: `Token and group name "${name}" cannot contain ".", "{", or "}".`,
      });
    });

    it("continues to reject unknown dollar-prefixed properties", () => {
      const error = captureCompilationError([{ filename: "tokens.json", document: {
        group: { $type: "number", $unknown: true, token: { $value: 1 } },
      } }]);

      expect(error.issues).toContainEqual({
        path: "group.$unknown",
        code: "unknown-property",
        message: 'Property "$unknown" is not recognized.',
      });
    });
  });

  it("rejects child tokens nested inside a token object", () => {
    const error = captureCompilationError([{ filename: "tokens.json", document: {
      spacing: {
        $type: "dimension",
        compact: {
          $value: { value: 4, unit: "px" },
          nested: { $value: { value: 8, unit: "px" } },
        },
      },
    } }]);

    expect(error.issues).toContainEqual({
      path: "spacing.compact.nested",
      code: "token-child",
      message: 'Token "spacing.compact" cannot contain child token or group "nested".',
    });
  });

  it("deep-clones input documents and token record values", () => {
    const rawColor: DtcgColor = {
      colorSpace: "hsl",
      components: [0, 50, 50],
      hex: "#bf4040",
    };
    const source: TokenSource = { filename: "tokens.json", document: {
      color: {
        $type: "color",
        raw: { $value: rawColor },
        alias: { $value: "{color.raw}" },
      },
    } };
    const inputSnapshot = structuredClone(source);
    const result = compileTokenSources([source]);
    const raw = result.tokens.find((token) => token.path === "color.raw");
    const alias = result.tokens.find((token) => token.path === "color.alias");

    expect(source).toEqual(inputSnapshot);
    expect(result.documents["tokens.json"]).not.toBe(source.document);
    expect(raw?.value).not.toBe(rawColor);
    expect(raw?.resolvedValue).not.toBe(raw?.value);
    expect(alias?.resolvedValue).not.toBe(raw?.resolvedValue);

    rawColor.components[0] = 120;
    (raw?.value as DtcgColor).components[0] = 240;
    expect((raw?.resolvedValue as DtcgColor).components[0]).toBe(0);
    expect((alias?.resolvedValue as DtcgColor).components[0]).toBe(0);
    expect(
      ((result.documents["tokens.json"].color as Record<string, unknown>)
        .raw as Record<string, DtcgColor>).$value.components[0],
    ).toBe(0);
  });

  it("sorts compilation issues by path and code", () => {
    const compileInvalid = (document: Record<string, unknown>) =>
      captureCompilationError([{ filename: "tokens.json", document }]).issues
        .map(({ path, code }) => ({ path, code }));
    const expected = [
      { path: "a", code: "invalid-node" },
      { path: "m", code: "invalid-deprecated" },
      { path: "m", code: "invalid-description" },
      { path: "z", code: "missing-type" },
      { path: "z", code: "unsupported-type" },
    ];

    expect(compileInvalid({
      z: { $type: "unsupported", $value: 1 },
      m: { $type: "number", $description: 123, $deprecated: 123, token: { $value: 1 } },
      a: 1,
    })).toEqual(expected);
    expect(compileInvalid({
      a: 1,
      m: { token: { $value: 1 }, $deprecated: 123, $description: 123, $type: "number" },
      z: { $value: 1, $type: "unsupported" },
    })).toEqual(expected);
  });

  describe("approved DTCG value validation", () => {
    it.each([
      ["negative HSL hue", "color", { colorSpace: "hsl", components: [-1, 50, 50] }],
      ["HSL hue at 360", "color", { colorSpace: "hsl", components: [360, 50, 50] }],
      ["negative HSL saturation", "color", { colorSpace: "hsl", components: [0, -1, 50] }],
      ["HSL saturation above 100", "color", { colorSpace: "hsl", components: [0, 101, 50] }],
      ["negative HSL lightness", "color", { colorSpace: "hsl", components: [0, 50, -1] }],
      ["HSL lightness above 100", "color", { colorSpace: "hsl", components: [0, 50, 101] }],
      ["negative alpha", "color", { colorSpace: "hsl", components: [0, 50, 50], alpha: -0.01 }],
      ["alpha above one", "color", { colorSpace: "hsl", components: [0, 50, 50], alpha: 1.01 }],
      ["short hex fallback", "color", { colorSpace: "hsl", components: [0, 50, 50], hex: "#abc" }],
      ["non-hex fallback", "color", { colorSpace: "hsl", components: [0, 50, 50], hex: "#gggggg" }],
      ["first Bézier x below zero", "cubicBezier", [-0.01, 0, 0.5, 1]],
      ["first Bézier x above one", "cubicBezier", [1.01, 0, 0.5, 1]],
      ["second Bézier x below zero", "cubicBezier", [0.5, 0, -0.01, 1]],
      ["second Bézier x above one", "cubicBezier", [0.5, 0, 1.01, 1]],
      ["empty font family", "fontFamily", ""],
      ["empty font family array", "fontFamily", []],
      ["empty font family array entry", "fontFamily", ["Inter", ""]],
      ["font weight below one", "fontWeight", 0],
      ["font weight above 1000", "fontWeight", 1001],
      ["unsupported font weight name", "fontWeight", "semibold"],
    ] satisfies [string, DtcgType, unknown][]) (
      "rejects %s",
      (_label, type, value) => {
        expect(captureCompilationError([{ filename: "tokens.json", document: {
          token: { $type: type, $value: value },
        } }]).issues).toEqual([
          expect.objectContaining({ path: "token", code: "invalid-value" }),
        ]);
      },
    );

    it("accepts the documented boundary values", () => {
      const fontWeightNames = [
        "thin", "hairline", "extra-light", "ultra-light", "light", "normal",
        "regular", "book", "medium", "semi-bold", "demi-bold", "bold",
        "extra-bold", "ultra-bold", "black", "heavy", "extra-black",
        "ultra-black",
      ];
      const result = compileTokenSources([{ filename: "tokens.json", document: {
        color: {
          $type: "color",
          lower: { $value: { colorSpace: "hsl", components: [0, "none", 0], alpha: 0 } },
          upper: { $value: { colorSpace: "hsl", components: [359.99, 100, "none"], alpha: 1, hex: "#aBc123" } },
        },
        easing: { $type: "cubicBezier", $value: [0, -100, 1, 100] },
        family: { $type: "fontFamily", $value: ["Inter"] },
        weights: {
          $type: "fontWeight",
          lower: { $value: 1 },
          upper: { $value: 1000 },
          ...Object.fromEntries(fontWeightNames.map((name) => [name, { $value: name }])),
        },
      } }]);

      expect(result.tokens).toHaveLength(2 + 1 + 1 + 2 + fontWeightNames.length);
    });

    it("validates reserved metadata on groups and tokens", () => {
      const error = captureCompilationError([{ filename: "tokens.json", document: {
        group: {
          $type: "number",
          $extensions: [],
          token: { $value: 1, $deprecated: 123 },
        },
      } }]);

      expect(error.issues).toEqual([
        {
          path: "group",
          code: "invalid-extensions",
          message: "$extensions must be a non-array object.",
        },
        {
          path: "group.token",
          code: "invalid-deprecated",
          message: "$deprecated must be a boolean or string.",
        },
      ]);
    });

    it("accepts documented reserved metadata", () => {
      expect(() => compileTokenSources([{ filename: "tokens.json", document: {
        group: {
          $type: "number",
          $extensions: { "com.example": { mode: "compact" } },
          active: { $value: 1, $deprecated: false },
          legacy: { $value: 2, $deprecated: "Use group.active." },
        },
      } }])).not.toThrow();
    });
  });

  describe("CSS formatting", () => {
    it("formats supported DTCG values", () => {
      expect(formatTokenCss("dimension", { value: 1.5, unit: "rem" })).toBe("1.5rem");
      expect(formatTokenCss("duration", { value: 250, unit: "ms" })).toBe("250ms");
      expect(formatTokenCss("cubicBezier", [0.22, 1, 0.36, 1])).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
    });

    it("formats none HSL components without percentages", () => {
      expect(formatTokenCss("color", {
        colorSpace: "hsl",
        components: ["none", 50, "none"],
        alpha: 0.5,
      })).toBe("none 50% none / 0.5");
    });

    it("quotes and escapes non-generic font family names", () => {
      expect(formatTokenCss("fontFamily", [
        "Inter",
        "O'Brien",
        "C:\\Fonts\\ACME",
        "ACME, Inc.",
        "Line\nBreak",
        "serif",
        "ui-rounded",
      ])).toBe(
        "'Inter', 'O\\'Brien', 'C:\\\\Fonts\\\\ACME', 'ACME, Inc.', 'Line\\a Break', serif, ui-rounded",
      );
    });
  });
});
