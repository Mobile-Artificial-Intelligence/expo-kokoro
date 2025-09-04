import tokenizerJSON from "./tokenizer.json";

type Vocab = Record<string, number>;

type EncodeOptions = {
  addSpecialTokens?: boolean;       // default true — wraps with $ ... $
  maxLength?: number;               // default from config
  padToMaxLength?: boolean;         // default false (for single encode)
  returnAttentionMask?: boolean;    // default true in batch helpers
};

type BatchEncodeReturn = {
  inputIds: number[][];
  attentionMask?: number[][];
};

export class Tokenizer {
  private vocab: Vocab;
  private invVocab: Record<number, string>;
  private modelMaxLength: number;
  private padToken: string;
  private unkToken: string;
  private specialTokenId: number;         // "$"
  private normalizerRegex: RegExp;

  constructor() {
    // === static config from JSONs ===
    this.vocab = tokenizerJSON.model.vocab as Vocab;
    this.invVocab = Object.fromEntries(
      Object.entries(this.vocab).map(([tok, id]) => [id, tok])
    );

    this.modelMaxLength = tokenizerJSON.config.model_max_length;
    this.padToken = tokenizerJSON.config.pad_token; // "$"
    this.unkToken = tokenizerJSON.config.unk_token; // "$"

    // "$" exists and is special in post-processor
    this.specialTokenId = this.vocab[this.padToken];

    // Build the normalizer from JSON (strip anything NOT in the whitelist)
    const regex = tokenizerJSON.normalizer.pattern.Regex;
    this.normalizerRegex = new RegExp(regex, "g");
  }

  /** Normalize input using the JSON "Replace" normalizer (remove disallowed chars). */
  private normalize(text: string): string {
    return text.replace(this.normalizerRegex, "");
  }

  /** Pre-tokenizer: split to individual Unicode characters. */
  private preTokenize(text: string): string[] {
    return [...text];
  }

  /** Apply post-processor template: single sequence -> $ <seq> $ (as per JSON). */
  private applyPostProcessor(ids: number[]): number[] {
    return [this.specialTokenId, ...ids, this.specialTokenId];
  }

  /** Remove a *single* leading & trailing special token ($) if present. */
  private stripPostProcessor(ids: number[]): number[] {
    let start = 0;
    let end = ids.length;
    if (ids[start] === this.specialTokenId) start++;
    if (end > start && ids[end - 1] === this.specialTokenId) end--;
    return ids.slice(start, end);
  }

  /** Map chars -> ids (unknown map to "$" id). */
  private toIds(tokens: string[]): number[] {
    const unkId = this.vocab[this.unkToken];
    return tokens.map((t) => (t in this.vocab ? this.vocab[t] : unkId));
  }

  /** Map ids -> tokens (unknown id -> "$"). */
  private toTokens(ids: number[]): string[] {
    return ids.map((id) => (id in this.invVocab ? this.invVocab[id] : this.unkToken));
  }

  /** Truncate to maxLength (if provided), otherwise config length. */
  private truncate(ids: number[], maxLength?: number): number[] {
    const cap = maxLength ?? this.modelMaxLength;
    return ids.length > cap ? ids.slice(0, cap) : ids;
  }

  /** Pad sequence with "$" to maxLen. */
  private padTo(ids: number[], maxLen: number): number[] {
    const padId = this.specialTokenId;
    if (ids.length >= maxLen) return ids;
    const padCount = maxLen - ids.length;
    return [...ids, ...Array(padCount).fill(padId)];
  }

  /** Build attention mask: 1 for real tokens, 0 for pad. */
  private attentionMask(ids: number[], padId = this.specialTokenId): number[] {
    return ids.map((id) => (id === padId ? 0 : 1));
  }

  /** Encode a single string -> token IDs. */
  encode(text: string, opts: EncodeOptions = {}): number[] {
    const {
      addSpecialTokens = true,
      maxLength,
      padToMaxLength = false,
    } = opts;

    const normalized = this.normalize(text);
    const chars = this.preTokenize(normalized);
    let ids = this.toIds(chars);

    if (addSpecialTokens) {
      ids = this.applyPostProcessor(ids);
    }

    ids = this.truncate(ids, maxLength);

    if (padToMaxLength) {
      const cap = maxLength ?? this.modelMaxLength;
      ids = this.padTo(ids, cap);
    }

    return ids;
  }

  /** Decode token IDs -> string (drops a single leading/trailing $ added by post-processor). */
  decode(ids: number[], stripSpecial = true): string {
    const cleaned = stripSpecial ? this.stripPostProcessor(ids) : ids.slice();
    const tokens = this.toTokens(cleaned);

    // By default this returns the raw concatenation, which matches the char-level model.
    return tokens.join("");
  }

  /** Pad a batch to the same length; returns padded ids (no masks). */
  pad(batch: number[][], toLength?: number): number[][] {
    const maxLen = toLength ?? Math.max(...batch.map((s) => s.length));
    return batch.map((seq) => this.padTo(seq, maxLen));
  }

  /** Batch encode with optional padding & attention masks (HuggingFace-like). */
  batchEncode(
    texts: string[],
    {
      addSpecialTokens = true,
      maxLength,
      padToMaxLength = true,
      returnAttentionMask = true,
    }: EncodeOptions = {}
  ): BatchEncodeReturn {
    const encoded = texts.map((t) =>
      this.encode(t, { addSpecialTokens, maxLength, padToMaxLength: false })
    );

    const cap =
      maxLength ??
      (padToMaxLength ? Math.max(...encoded.map((s) => s.length), this.modelMaxLength) : undefined);

    let inputIds = encoded;
    if (padToMaxLength && cap) {
      inputIds = encoded.map((seq) => this.padTo(seq, cap));
    }

    const result: BatchEncodeReturn = { inputIds };
    if (returnAttentionMask) {
      result.attentionMask = inputIds.map((seq) => this.attentionMask(seq));
    }
    return result;
  }
}

// --- Singleton, ready to use without passing JSONs ---
export const tokenizer = new Tokenizer();