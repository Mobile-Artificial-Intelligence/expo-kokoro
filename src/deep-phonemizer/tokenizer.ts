import tokenizerJSON from "./tokenizer.json";

const text_map: Record<string, number> = {
    " ": 0
};
const phoneme_map: Record<string, number> = {
    " ": 0
};

for (const lang of tokenizerJSON.languages) {
    text_map[`<${lang}>`] = Object.keys(text_map).length;
    phoneme_map[`<${lang}>`] = Object.keys(phoneme_map).length;
}

text_map["<end>"] = Object.keys(text_map).length;
phoneme_map["<end>"] = Object.keys(phoneme_map).length;

for (const text of tokenizerJSON.text_symbols) {
  text_map[text] = Object.keys(text_map).length;
}

for (const phoneme of tokenizerJSON.phoneme_symbols) {
  phoneme_map[phoneme] = Object.keys(phoneme_map).length;
}

const token_map: Record<number, string> = {};
for (const [ch, id] of Object.entries(phoneme_map)) {
    if (!(id in token_map)) {
        token_map[id] = ch;
    }
}

export function encode(text: string, lang: string = "en_us"): Array<number> {
    text = text.toLowerCase();

    const result: Array<number> = [
        text_map[`<${lang}>`]
    ];

    for (const char of text) {
        const code = text_map[char];
        if (code !== undefined) {
            result.push(code);
        }
    }

    result.push(text_map["<end>"]);

    return result;
}

export function decode(ids: Array<number>): string {
    const result: Array<string> = [];
    console.log(ids);

    for (const id of ids) {
        const ch = token_map[id];
        if (ch === "<end>") break;
        if (ch.startsWith("<") && ch.endsWith(">") && tokenizerJSON.languages.includes(ch.slice(1, -1) as any)) continue;
        if (ch !== undefined) {
            result.push(ch);
        }
    }

    console.log(result);
    return result.join("");
}