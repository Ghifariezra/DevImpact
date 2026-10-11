import { describe, expect, test } from "vitest";
import { detectCountry } from "@/lib/geo/location-detector";

describe("detectCountry", () => {
  describe("empty and invalid input", () => {
    test("returns null for null", () => {
      expect(detectCountry(null)).toBeNull();
    });

    test.each(["", " ", "   ", "\t\n"])("returns null for blank input %j", (input) => {
      expect(detectCountry(input)).toBeNull();
    });

    test.each(["!!!", "###", "@#$%^&*()", "🌍", "(.*)", "[", "\\"])(
      "returns null for special characters only: %s",
      (input) => {
        expect(detectCountry(input)).toBeNull();
      },
    );

    test.each(["Mars", "Earth", "Remote"])(
      "returns null when no country is present: %s",
      (input) => {
        expect(detectCountry(input)).toBeNull();
      },
    );
  });

  describe("exact match", () => {
    test.each([
      ["Egypt", "egypt"],
      ["Germany", "germany"],
      ["Tokyo, Japan", "japan"],
      ["Jakarta, Indonesia", "indonesia"],
      ["Cairo", "egypt"],
      ["New Zealand", "new_zealand"],
      ["South Korea", "south_korea"],
      ["Hong Kong", "hong_kong"],
    ])("detects %s as %s", (input, expected) => {
      expect(detectCountry(input)).toBe(expected);
    });

    test("is case-insensitive", () => {
      expect(detectCountry("EGYPT")).toBe("egypt");
    });

    test("ignores surrounding whitespace", () => {
      expect(detectCountry("  Egypt  ")).toBe("egypt");
    });

    test("matches next to punctuation", () => {
      expect(detectCountry("Cairo, Egypt!")).toBe("egypt");
    });
  });

  describe("word boundaries", () => {
    test.each([
      ["Romania", "romania"],
      ["Somalia", "somalia"],
      ["Nigeria", "nigeria"],
      ["Tirana", "albania"],
      ["Indiana", "united_states"],
    ])("%s is not matched by the country hidden inside it", (input, expected) => {
      expect(detectCountry(input)).toBe(expected);
    });

    test.each([
      ["Oman", "oman"],
      ["Mali", "mali"],
      ["Niger", "niger"],
      ["Iran", "iran"],
    ])("still matches the standalone word %s", (input, expected) => {
      expect(detectCountry(input)).toBe(expected);
    });
  });
});
