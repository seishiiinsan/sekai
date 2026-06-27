import { describe, it, expect } from "vitest";
import { evaluateBadges, type BadgeContext } from "./badges";

const base: BadgeContext = {
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  flagsMastered: 0,
  capitalsMastered: 0,
  coreFlags: 195,
  coreCapitals: 193,
  perfectThisSeries: false,
  seriesCount: 1,
};

describe("evaluateBadges", () => {
  it("awards first_series once a series is finished", () => {
    expect(evaluateBadges(base)).toContain("first_series");
    expect(evaluateBadges({ ...base, seriesCount: 0 })).not.toContain("first_series");
  });

  it("awards streak badges from current OR longest streak", () => {
    expect(evaluateBadges({ ...base, currentStreak: 7 })).toContain("streak_7");
    expect(evaluateBadges({ ...base, longestStreak: 30 })).toContain("streak_30");
    expect(evaluateBadges({ ...base, currentStreak: 6 })).not.toContain("streak_7");
  });

  it("awards level badges at thresholds", () => {
    expect(evaluateBadges({ ...base, level: 5 })).toContain("level_5");
    expect(evaluateBadges({ ...base, level: 10 })).toEqual(
      expect.arrayContaining(["level_5", "level_10"]),
    );
    expect(evaluateBadges({ ...base, level: 4 })).not.toContain("level_5");
  });

  it("awards perfect_series only when flagged", () => {
    expect(evaluateBadges({ ...base, perfectThisSeries: true })).toContain("perfect_series");
    expect(evaluateBadges(base)).not.toContain("perfect_series");
  });

  it("awards mastery badges only when the whole core catalogue is mastered", () => {
    expect(evaluateBadges({ ...base, flagsMastered: 195 })).toContain("flags_master");
    expect(evaluateBadges({ ...base, flagsMastered: 194 })).not.toContain("flags_master");
    expect(evaluateBadges({ ...base, capitalsMastered: 193 })).toContain("capitals_master");
  });

  it("never awards a mastery badge when the core size is unknown (0)", () => {
    const r = evaluateBadges({ ...base, coreFlags: 0, flagsMastered: 5 });
    expect(r).not.toContain("flags_master");
  });
});
