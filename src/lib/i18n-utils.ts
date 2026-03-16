/**
 * Tries to parse a JSON string with language keys and returns the value for the given lang.
 * Falls back to English, then returns the raw string if not JSON.
 */
export function getLocalizedText(text: string, lang: string): string {
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed[lang] || parsed["en"] || text;
    }
    return text;
  } catch {
    return text;
  }
}
