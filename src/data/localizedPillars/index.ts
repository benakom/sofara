import type { Locale, PageKey } from "@/i18n/locales";
import type { PillarContent } from "./types";
import { EN_PILLARS } from "./en";
import { FR_PILLARS } from "./fr";
import { ES_PILLARS } from "./es";
import { RU_PILLARS } from "./ru";

/** Content of the localized landing pages, by locale then page. */
export const LOCALIZED_PILLARS: Record<Locale, Partial<Record<PageKey, PillarContent>>> = {
  en: EN_PILLARS,
  fr: FR_PILLARS,
  es: ES_PILLARS,
  ru: RU_PILLARS,
};
