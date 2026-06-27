import { describe, it, expect } from "vitest";
import { leagueForWeeklyXp, nextLeague } from "./leagues";

describe("leagueForWeeklyXp", () => {
  it("maps XP to the right league", () => {
    expect(leagueForWeeklyXp(0).key).toBe("bronze");
    expect(leagueForWeeklyXp(149).key).toBe("bronze");
    expect(leagueForWeeklyXp(150).key).toBe("silver");
    expect(leagueForWeeklyXp(399).key).toBe("silver");
    expect(leagueForWeeklyXp(400).key).toBe("gold");
    expect(leagueForWeeklyXp(5000).key).toBe("diamond");
  });
});

describe("nextLeague", () => {
  it("returns the next tier and remaining XP", () => {
    expect(nextLeague(0)).toEqual({ league: expect.objectContaining({ key: "silver" }), remaining: 150 });
    expect(nextLeague(300)).toEqual({ league: expect.objectContaining({ key: "gold" }), remaining: 100 });
  });

  it("returns null at the top league", () => {
    expect(nextLeague(1200)).toBeNull();
  });
});
