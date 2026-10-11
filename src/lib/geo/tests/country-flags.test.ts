import { describe, expect, test } from "vitest";
import { getCountryCode } from "@/lib/geo/country-flags";

describe("getCountryCode", () => {
  test.each([
    ["egypt", "eg"],
    ["germany", "de"],
    ["united_states", "us"],
    ["uk", "gb"],
  ])("returns the ISO code for %s", (slug, expected) => {
    expect(getCountryCode(slug)).toBe(expected);
  });

  test.each(["atlantis", "", "EGYPT", "worldwide"])("returns null for %j", (slug) => {
    expect(getCountryCode(slug)).toBeNull();
  });
});
