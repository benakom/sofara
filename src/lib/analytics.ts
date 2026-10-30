// GA4 events. No-op when gtag is not loaded on the page (sofara.io does not load it today).
type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

export const track = (name: string, params?: Record<string, unknown>) => {
  try {
    const g = (typeof window !== "undefined" ? (window as unknown as { gtag?: Gtag }).gtag : undefined);
    if (typeof g === "function") g("event", name, params);
  } catch {
    /* analytics must never break the funnel */
  }
};
