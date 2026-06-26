import { describe, it, expect } from "vitest";
import {
  reviewItem,
  isDue,
  masteryPct,
  masteryTier,
  isMastered,
  NEW_SRS_STATE,
  SRS_INTERVALS_DAYS,
} from "./srs";

const NOW = new Date("2026-06-26T12:00:00Z");
const daysFrom = (d: Date, n: number) =>
  new Date(d.getTime() + n * 24 * 3600 * 1000);

describe("reviewItem — correct answers", () => {
  it("promotes a new item to box 1 (1 day)", () => {
    const next = reviewItem(NEW_SRS_STATE, true, NOW);
    expect(next.srsLevel).toBe(1);
    expect(next.intervalDays).toBe(1);
    expect(next.reps).toBe(1);
    expect(next.dueAt.getTime()).toBe(daysFrom(NOW, 1).getTime());
  });

  it("lengthens the interval as the box rises", () => {
    let state = NEW_SRS_STATE;
    const seen: number[] = [];
    for (let i = 0; i < 6; i++) {
      const u = reviewItem(state, true, NOW);
      seen.push(u.intervalDays);
      state = u;
    }
    expect(seen).toEqual([1, 3, 7, 14, 30, 60]);
  });

  it("uses ease-based intervals beyond the last fixed box", () => {
    let state = NEW_SRS_STATE;
    for (let i = 0; i < SRS_INTERVALS_DAYS.length - 1; i++) {
      state = reviewItem(state, true, NOW);
    }
    const beyond = reviewItem(state, true, NOW);
    expect(beyond.srsLevel).toBe(SRS_INTERVALS_DAYS.length);
    expect(beyond.intervalDays).toBeGreaterThan(60); // 60 * ease
  });
});

describe("reviewItem — misses", () => {
  it("sends a strong item back to relearning, soon and with a lapse", () => {
    const strong = { srsLevel: 5, ease: 2.5, intervalDays: 30, reps: 5, lapses: 0 };
    const next = reviewItem(strong, false, NOW);
    expect(next.srsLevel).toBe(1);
    expect(next.lapses).toBe(1);
    expect(next.intervalDays).toBe(0);
    expect(next.ease).toBeCloseTo(2.3);
    expect(next.dueAt.getTime()).toBeGreaterThan(NOW.getTime());
    expect(next.dueAt.getTime()).toBeLessThan(daysFrom(NOW, 1).getTime());
  });

  it("never drops ease below the floor", () => {
    let state = { srsLevel: 3, ease: 1.4, intervalDays: 7, reps: 3, lapses: 0 };
    state = reviewItem(state, false, NOW);
    expect(state.ease).toBeGreaterThanOrEqual(1.3);
  });
});

describe("due + mastery helpers", () => {
  it("isDue compares against now", () => {
    expect(isDue(daysFrom(NOW, -1), NOW)).toBe(true);
    expect(isDue(daysFrom(NOW, 1), NOW)).toBe(false);
    expect(isDue(NOW.toISOString(), NOW)).toBe(true);
  });

  it("masteryPct scales from 0 to 100", () => {
    expect(masteryPct(0)).toBe(0);
    expect(masteryPct(3)).toBe(50);
    expect(masteryPct(6)).toBe(100);
    expect(masteryPct(99)).toBe(100); // clamped
  });

  it("masteryTier and isMastered classify boxes", () => {
    expect(masteryTier(0)).toBe("new");
    expect(masteryTier(1)).toBe("learning");
    expect(masteryTier(4)).toBe("familiar");
    expect(masteryTier(5)).toBe("strong");
    expect(masteryTier(6)).toBe("mastered");
    expect(isMastered(5)).toBe(false);
    expect(isMastered(6)).toBe(true);
  });
});
