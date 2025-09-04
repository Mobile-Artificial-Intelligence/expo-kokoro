import { encode, decode } from "./tokenizer";

describe("Tokenizer", () => {
  test("encodes a simple word with default lang", () => {
    const ids = encode("abc");
    expect(Array.isArray(ids)).toBe(true);
    expect(ids.length).toBeGreaterThan(2); // should have lang + chars + <end>
    // First token should be language tag
    expect(typeof ids[0]).toBe("number");
    // Last token should be <end>
    expect(ids[ids.length - 1]).toBeGreaterThan(0);
  });

  test("encodes with a different lang", () => {
    const ids = encode("abc", "de");
    expect(ids[0]).not.toBe(encode("abc")[0]); // lang token should differ
  });

  test("ignores unknown characters", () => {
    const ids = encode("abc💡");
    const idsNoEmoji = encode("abc");
    expect(ids).toEqual(idsNoEmoji); // emoji should be dropped
  });

  test("decode returns original text", () => {
    const text = "hello";
    const ids = encode(text);
    const decoded = decode(ids);
    expect(decoded).toBe(text);
  });

  test("decode strips language and <end>", () => {
    const text = "test";
    const ids = encode(text, "fr");
    const decoded = decode(ids);
    expect(decoded).toBe(text); // no lang markers or <end>
  });

  test("decode stops at <end>", () => {
    const text = "abc";
    const ids = encode(text);
    const withGarbage = [...ids, 9999, 9998]; // append fake tokens
    const decoded = decode(withGarbage);
    expect(decoded).toBe(text);
  });
});
