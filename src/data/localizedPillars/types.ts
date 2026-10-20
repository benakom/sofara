import type { PageKey } from "@/i18n/locales";

/** Text supports **bold** and [label](/path) links. */
export type Block =
  | { p: string }
  | { h3: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: { head: string[]; rows: string[][] } };

export interface PillarContent {
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  sections: { h2: string; blocks: Block[] }[];
  faqs: { q: string; a: string }[];
  cta: { title: string; text: string };
  related: PageKey[];
}
