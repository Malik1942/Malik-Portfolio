import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { tokenBundle } from "../generated/token-manifest.generated";
import type { DtcgValue, TokenRecord } from "../tokens/types";
import { TokenControl } from "./TokenControl";

const token = (path: string) => tokenBundle.tokens.find((item) => item.path === path)!;
const numberToken: TokenRecord = {
  path: "test.number",
  sourceFile: "test.tokens.json",
  type: "number",
  value: 1.5,
  resolvedValue: 1.5,
  description: "Test-only unitless value.",
  cssVariable: "--test-number",
  cssValue: "1.5",
  dependents: [],
};

function renderControl(record: TokenRecord, value: DtcgValue = record.resolvedValue) {
  const onChange = vi.fn();
  render(<TokenControl token={record} value={value} onChange={onChange} />);
  return onChange;
}

describe("TokenControl", () => {
  afterEach(cleanup);

  it("identifies the canonical path and labels production and draft values", () => {
    renderControl(token("duration.fast"), { value: 120, unit: "ms" });
    expect(screen.getByRole("group", { name: "duration.fast" })).toBeInTheDocument();
    expect(screen.getByText("Production: 200ms")).toBeInTheDocument();
    expect(screen.getByText("Draft: 120ms")).toBeInTheDocument();
  });

  it("emits bounded duration values but preserves invalid intermediate text", () => {
    const onChange = renderControl(token("duration.fast"));
    const input = screen.getByLabelText("duration.fast duration");
    fireEvent.change(input, { target: { value: "6000" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("between 0 and 5000");
    expect(input).toHaveValue(6000);
    fireEvent.change(input, { target: { value: "125" } });
    expect(onChange).toHaveBeenLastCalledWith({ value: 125, unit: "ms" });
  });

  it("edits HSL channels with intrinsic bounds", () => {
    const onChange = renderControl(token("color.red.danger"));
    fireEvent.change(screen.getByLabelText("color.red.danger hue"), { target: { value: "120" } });
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ components: [120, 82, 53] }));
    fireEvent.change(screen.getByLabelText("color.red.danger saturation"), { target: { value: "101" } });
    expect(screen.getByRole("status")).toHaveTextContent("between 0 and 100");
  });

  it("preserves a dimension's production unit and does not invent a slider", () => {
    const onChange = renderControl(token("space.1"));
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("space.1 value"), { target: { value: "6" } });
    expect(onChange).toHaveBeenLastCalledWith({ value: 6, unit: "px" });
  });

  it("uses finite number inputs without fabricated bounds", () => {
    const onChange = renderControl(numberToken);
    const input = screen.getByLabelText("test.number value");
    expect(input).not.toHaveAttribute("min");
    expect(input).not.toHaveAttribute("max");
    fireEvent.change(input, { target: { value: "NaN" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("finite number");
  });

  it("limits font families to production font-family tokens", () => {
    const onChange = renderControl(token("font.family.display"));
    const select = screen.getByLabelText("font.family.display family");
    expect(Array.from((select as HTMLSelectElement).options).map((option) => option.text)).toEqual([
      "General Sans, sans-serif",
      "JetBrains Mono, monospace",
    ]);
    fireEvent.change(select, { target: { value: "JetBrains Mono|monospace" } });
    expect(onChange).toHaveBeenLastCalledWith(["JetBrains Mono", "monospace"]);
  });

  it("normalizes named font weights to a bounded CSS numeric value", () => {
    const onChange = renderControl(token("font.weight.medium"));
    const input = screen.getByLabelText("font.weight.medium weight");
    expect(input).toHaveValue(500);
    fireEvent.change(input, { target: { value: "1001" } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "600" } });
    expect(onChange).toHaveBeenLastCalledWith(600);
  });

  it("renders four cubic-bezier controls and rejects invalid x coordinates", () => {
    const onChange = renderControl(token("ease.standard"));
    expect(screen.getAllByRole("spinbutton")).toHaveLength(4);
    expect(screen.getByTestId("curve-preview")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("ease.standard x1"), { target: { value: "1.2" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("between 0 and 1");
  });
});
