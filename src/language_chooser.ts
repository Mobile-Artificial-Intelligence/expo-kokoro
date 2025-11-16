import { KokoroVoice } from "./voices";

export type Language = "en_us" | "en_gb" ;

const LANGUAGE_MAP: Record<string, Language> = {
    "American": "en_us",
    "British": "en_gb",
};
export function chooseLanguage(voice: KokoroVoice): Language {
    return LANGUAGE_MAP[voice.nationality] ?? "en_us";
}