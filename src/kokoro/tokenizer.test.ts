import { Tokenizer } from "./tokenizer";

describe("Tokenizer", () => {
  it("encodes then decodes back to the same normalized text", () => {
    const t = new Tokenizer();
    const text = "ab";
    const ids = t.encode(text);
    const decoded = t.decode(ids);
    expect(decoded).toBe("ab");
  });

  it("strips disallowed characters during normalization (e.g., emoji)", () => {
    const t = new Tokenizer();
    const text = "a🙂b";
    const ids = t.encode(text);
    const decoded = t.decode(ids);
    expect(decoded).toBe("ab");
  });

  it("wraps with special tokens by default and omits them when disabled", () => {
    const t = new Tokenizer();
    const withSpecial = t.encode("ab");
    const withoutSpecial = t.encode("ab", { addSpecialTokens: false });

    // Default adds exactly two special tokens
    expect(withSpecial.length).toBe(withoutSpecial.length + 2);
    // The special token id is 0 according to tokenizer.json
    expect(withSpecial[0]).toBe(0);
    expect(withSpecial[withSpecial.length - 1]).toBe(0);
  });

  it("respects maxLength truncation", () => {
    const t = new Tokenizer();
    const ids = t.encode("abcdef", { maxLength: 4 });
    expect(ids.length).toBe(4);
    // After truncation, decode still yields a sensible prefix
    const decoded = t.decode(ids);
    expect(decoded).toBe("abc");
  });

  it("pads to maxLength when requested for single encode", () => {
    const t = new Tokenizer();
    const ids = t.encode("ab", { padToMaxLength: true, maxLength: 6 });
    expect(ids.length).toBe(6);
    // Expect trailing pads to be special token id 0
    expect(ids.slice(-2)).toEqual([0, 0]);
  });

  it("batchEncode pads sequences and returns attention masks", () => {
    const t = new Tokenizer();
    const { inputIds, attentionMask } = t.batchEncode(["a", "abc"], {
      maxLength: 6,
      padToMaxLength: true,
      returnAttentionMask: true,
    });

    expect(inputIds).toHaveLength(2);
    expect(inputIds[0].length).toBe(6);
    expect(inputIds[1].length).toBe(6);

    expect(attentionMask).toBeDefined();
    expect(attentionMask![0].length).toBe(6);
    expect(attentionMask![1].length).toBe(6);

    // Ensure there is some padding reflected in masks (0s at the end)
    expect(attentionMask![0].slice(-1)[0]).toBe(0);
    expect(attentionMask![1].slice(-1)[0]).toBe(0);
  });

  it("pad() pads a batch to uniform length", () => {
    const t = new Tokenizer();
    const seqs = [t.encode("a"), t.encode("abc")];
    const padded = t.pad(seqs);
    expect(padded[0].length).toBe(padded[1].length);
    // Padding uses special token id 0
    expect(padded[0][padded[0].length - 1]).toBe(0);
  });
});

