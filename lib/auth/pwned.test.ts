import { describe, it, expect, vi, afterEach } from "vitest";
import { createHash } from "crypto";

// pwned.ts is marked "server-only"; stub it so the module can load under vitest.
vi.mock("server-only", () => ({}));

import { isPasswordPwned } from "./pwned";

/** SHA-1 suffix (chars 6..40, uppercase) HIBP would return for a password. */
function suffixOf(password: string): string {
  return createHash("sha1").update(password).digest("hex").toUpperCase().slice(5);
}

function mockRange(body: string, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok,
    text: () => Promise.resolve(body),
  }));
}

afterEach(() => vi.unstubAllGlobals());

describe("isPasswordPwned", () => {
  it("flags a password whose suffix appears with a non-zero count", async () => {
    const pwd = "password123";
    mockRange(`${suffixOf(pwd)}:42\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:1`);
    expect(await isPasswordPwned(pwd)).toBe(true);
  });

  it("clears a password whose suffix is absent", async () => {
    mockRange("0000000000000000000000000000000000A:5\nBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB:9");
    expect(await isPasswordPwned("a-very-unique-passphrase")).toBe(false);
  });

  it("treats a padding hit (count 0) as not breached", async () => {
    const pwd = "padded-entry";
    mockRange(`${suffixOf(pwd)}:0`);
    expect(await isPasswordPwned(pwd)).toBe(false);
  });

  it("fails open when the API returns a non-ok status", async () => {
    mockRange("", false);
    expect(await isPasswordPwned("whatever")).toBe(false);
  });

  it("fails open when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect(await isPasswordPwned("whatever")).toBe(false);
  });
});
