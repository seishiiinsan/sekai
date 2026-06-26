import { describe, it, expect } from "vitest";
import {
  xpForAnswer,
  speedBonus,
  comboMultiplier,
  levelForXp,
  xpForLevel,
  levelProgress,
} from "./xp";

describe("speedBonus", () => {
  it("is full for fast answers, zero for slow, monotonic between", () => {
    expect(speedBonus(1000)).toBe(0.5);
    expect(speedBonus(2000)).toBe(0.5);
    expect(speedBonus(10000)).toBe(0);
    expect(speedBonus(undefined)).toBe(0);
    expect(speedBonus(6000)).toBeGreaterThan(0);
    expect(speedBonus(6000)).toBeLessThan(0.5);
  });
});

describe("comboMultiplier", () => {
  it("grows with combo and caps", () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(3)).toBeCloseTo(1.3);
    expect(comboMultiplier(5)).toBeCloseTo(1.5);
    expect(comboMultiplier(50)).toBeCloseTo(1.5); // capped
  });
});

describe("xpForAnswer", () => {
  it("awards nothing for a wrong answer", () => {
    expect(xpForAnswer({ correct: false, difficulty: 1, combo: 0 })).toBe(0);
  });

  it("awards base XP for a plain correct answer", () => {
    expect(xpForAnswer({ correct: true, difficulty: 1, combo: 0 })).toBe(10);
  });

  it("rewards difficulty, speed and combo together", () => {
    // 10 * 1.5 (micro) * 1.5 (fast) * 1.5 (combo 5) = 33.75 -> 34
    const xp = xpForAnswer({
      correct: true,
      difficulty: 2,
      responseMs: 1000,
      combo: 5,
    });
    expect(xp).toBe(34);
  });

  it("is greater for micro-states than core, all else equal", () => {
    const core = xpForAnswer({ correct: true, difficulty: 1, combo: 0 });
    const micro = xpForAnswer({ correct: true, difficulty: 2, combo: 0 });
    expect(micro).toBeGreaterThan(core);
  });
});

describe("level curve", () => {
  it("xpForLevel is the documented progressive curve", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(300);
    expect(xpForLevel(4)).toBe(600);
  });

  it("levelForXp inverts xpForLevel at boundaries", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(299)).toBe(2);
    expect(levelForXp(300)).toBe(3);
    expect(levelForXp(600)).toBe(4);
  });

  it("levelForXp is consistent with xpForLevel across a range", () => {
    for (let lvl = 1; lvl <= 40; lvl++) {
      const floorXp = xpForLevel(lvl);
      const nextXp = xpForLevel(lvl + 1);
      expect(levelForXp(floorXp)).toBe(lvl);
      expect(levelForXp(nextXp - 1)).toBe(lvl);
    }
  });

  it("levelProgress splits total XP correctly", () => {
    const p = levelProgress(150); // level 2 (100..300), 50 into a 200 span
    expect(p.level).toBe(2);
    expect(p.intoLevel).toBe(50);
    expect(p.levelSpan).toBe(200);
    expect(p.nextLevelXp).toBe(300);
    expect(p.fraction).toBeCloseTo(0.25);
  });
});
