import { describe, it, expect } from "vitest";
import { leagueForWeeklyXp, nextLeague } from "./leagues";

describe("leagueForWeeklyXp", () => {
  it("maps XP to the right league", () => {
    expect(leagueForWeeklyXp(0).key).toBe("bronze");
    expect(leagueForWeeklyXp(499).key).toBe("bronze");
    expect(leagueForWeeklyXp(500).key).toBe("silver");
    expect(leagueForWeeklyXp(1499).key).toBe("silver");
    expect(leagueForWeeklyXp(1500).key).toBe("gold");
    expect(leagueForWeeklyXp(5000).key).toBe("diamond");
  });
});

describe("nextLeague", () => {
  it("returns the next tier and remaining XP", () => {
    expect(nextLeague(0)).toEqual({ league: expect.objectContaining({ key: "silver" }), remaining: 500 });
    expect(nextLeague(800)).toEqual({ league: expect.objectContaining({ key: "gold" }), remaining: 700 });
  });

  it("returns null at the top league", () => {
    expect(nextLeague(3000)).toBeNull();
  });
});
