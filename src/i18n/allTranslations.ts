// Build-time prerender only (src/entry-server.tsx): every language is available synchronously, so each page renders in
// its own language in one pass. The browser loads one language chunk at a time instead (./translations.ts).
import { registerDictionary } from "./translations";
import { FR_TRANSLATIONS } from "./translations-fr";
import { ES_TRANSLATIONS } from "./translations-es";
import { RU_TRANSLATIONS } from "./translations-ru";
import { AR_TRANSLATIONS } from "./translations-ar";

registerDictionary("fr", FR_TRANSLATIONS);
registerDictionary("es", ES_TRANSLATIONS);
registerDictionary("ru", RU_TRANSLATIONS);
registerDictionary("arb", AR_TRANSLATIONS);
