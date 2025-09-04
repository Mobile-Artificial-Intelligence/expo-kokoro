import { encode, decode } from "./tokenizer";

describe("tokenizer encode/decode", () => {
  it("encodes and decodes simple ASCII correctly", () => {
    const text = "abc";
    const ids = encode(text);
    const decoded = decode(ids);
    expect(ids.length).toBe(3);
    expect(decoded).toBe(text);
  });

  it("encodes and decodes punctuation correctly", () => {
    const text = "!$?";
    const ids = encode(text);
    const decoded = decode(ids);
    expect(decoded).toBe(text);
  });

  it("returns 0 for unknown characters", () => {
    const text = "a🙂b";
    const ids = encode(text);
    // '🙂' should map to 0
    expect(ids).toContain(0);
  });

  it("decodes unknown ids to underscore", () => {
    const decoded = decode([999, 14]); // 999 not in map, 14 is 'a'
    expect(decoded).toBe("_a");
  });

  it("round trips IPA symbols", () => {
    const text = "ɐʃʔ"; // all present in the map
    const ids = encode(text);
    const decoded = decode(ids);
    expect(decoded).toBe(text);
  });

  it("is stable across round trip (encode -> decode -> encode)", () => {
    const text = "hello world!";
    const ids1 = encode(text);
    const text2 = decode(ids1);
    const ids2 = encode(text2);
    expect(ids1).toEqual(ids2);
  });

  it("handles empty string", () => {
    expect(encode("")).toEqual([]);
    expect(decode([])).toBe("");
  });

  it("maps numbers consistently", () => {
    const text = "0123456789";
    const ids = encode(text);
    const decoded = decode(ids);
    expect(decoded).toBe(text);
    expect(new Set(ids).size).toBe(10); // all unique IDs
  });
});
