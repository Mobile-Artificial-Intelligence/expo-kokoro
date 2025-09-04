const languages = [
    "en_uk",
    "en_us",
    "de",
    "fr",
    "es"
] as const;

const text_symbols = [
    "'",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "º",
    "à",
    "á",
    "â",
    "ã",
    "ä",
    "å",
    "æ",
    "ç",
    "è",
    "é",
    "ê",
    "ë",
    "í",
    "î",
    "ï",
    "ð",
    "ñ",
    "ó",
    "ô",
    "õ",
    "ö",
    "ø",
    "ù",
    "ú",
    "û",
    "ü",
    "ÿ",
    "ā",
    "ą",
    "č",
    "ē",
    "ę",
    "ğ",
    "ī",
    "ı",
    "ł",
    "ń",
    "ō",
    "ő",
    "œ",
    "ř",
    "ū",
    "ž",
    "ǃ",
    "ș",
    "ț",
    "ʼ",
    "ṭ",
    "ꝇ"
] as const;

const phoneme_symbols = [
    "a",
    "b",
    "d",
    "e",
    "f",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "æ",
    "ç",
    "ð",
    "õ",
    "ø",
    "ŋ",
    "œ",
    "ɐ",
    "ɑ",
    "ɒ",
    "ɔ",
    "ɘ",
    "ə",
    "ɚ",
    "ɛ",
    "ɜ",
    "ɝ",
    "ɟ",
    "ɡ",
    "ɥ",
    "ɪ",
    "ɫ",
    "ɱ",
    "ɲ",
    "ɹ",
    "ɾ",
    "ʀ",
    "ʁ",
    "ʃ",
    "ʊ",
    "ʋ",
    "ʌ",
    "ʍ",
    "ʎ",
    "ʏ",
    "ʒ",
    "ʔ",
    "ʝ",
    "ʰ",
    "ː",
    "̃",
    "̊",
    "̍",
    "̥",
    "̩",
    "̯",
    "͜",
    "͡",
    "β",
    "θ",
    "χ",
    "‿",
    ".",
    ",",
    ":",
    ";",
    "?",
    "!",
    "\"",
    "(",
    ")",
    "-"
] as const;

const text_map: Record<string, number> = {};
const phoneme_map: Record<string, number> = {};

text_map[" "] = 0;
phoneme_map[" "] = 0;

for (const lang of languages) {
    text_map[`<${lang}>`] = text_map.length;
    phoneme_map[`<${lang}>`] = phoneme_map.length;
}

text_map["<end>"] = text_map.length;
phoneme_map["<end>"] = phoneme_map.length;

for (const text of text_symbols) {
  text_map[text] = text_map.length;
}

for (const phoneme of phoneme_symbols) {
  phoneme_map[phoneme] = phoneme_map.length;
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

    for (const id of ids) {
        const ch = token_map[id];
        if (ch === "<end>") break;
        if (ch !== undefined) {
            result.push(ch);
        }
    }

    return result.join("");
}