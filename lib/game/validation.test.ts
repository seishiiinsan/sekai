import { describe, it, expect } from "vitest";
import { validateChoice, validateFreeInput, typoBudget } from "./validation";

describe("validateChoice", () => {
  it("matches only the correct country id", () => {
    expect(validateChoice(42, 42)).toBe(true);
    expect(validateChoice(7, 42)).toBe(false);
  });
});

// Aliases as stored by the seed (already normalised, lowercased, accent-free).
const croatia = ["croatia", "republic of croatia", "croatie", "hrvatska"];
const ivoryCoast = ["cote divoire", "ivory coast", "republique de cote divoire"];

describe("validateFreeInput", () => {
  it("accepts an exact match ignoring accents and case", () => {
    expect(validateFreeInput("Croatie", croatia)).toBe(true);
    expect(validateFreeInput("CROATIA", croatia)).toBe(true);
  });

  it("accepts accented / punctuated input against normalised aliases", () => {
    expect(validateFreeInput("Côte d'Ivoire", ivoryCoast)).toBe(true);
  });

  it("tolerates a small typo on longer names", () => {
    expect(validateFreeInput("Croati", croatia)).toBe(true); // one missing letter
    expect(validateFreeInput("Croacia", croatia)).toBe(true); // one substitution
    expect(validateFreeInput("Hrvatskaa", croatia)).toBe(true); // one extra letter
  });

  it("rejects an unrelated answer", () => {
    expect(validateFreeInput("Serbie", croatia)).toBe(false);
    expect(validateFreeInput("", croatia)).toBe(false);
  });

  it("requires exact spelling for short names (no false positives)", () => {
    // "Iran" vs "Irak" are 1 edit apart but must stay distinct.
    expect(validateFreeInput("Iran", ["irak"])).toBe(false);
    expect(validateFreeInput("Irak", ["irak"])).toBe(true);
  });
});

describe("typoBudget", () => {
  it("scales with length", () => {
    expect(typoBudget(4)).toBe(0);
    expect(typoBudget(6)).toBe(1);
    expect(typoBudget(12)).toBe(2);
  });
});
