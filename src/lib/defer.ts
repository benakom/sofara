/**
 * Runs `cb` at the visitor's first interaction, or `delayMs` after the page has loaded, whichever comes first.
 * Used on public pages for work that is not needed for the first screen (Supabase auth client, landing chatbot):
 * it keeps the main thread free while the prerendered page is read, without making the visitor wait when they act.
 */
export const onInteractionOrDelay = (cb: () => void, delayMs: number): (() => void) => {
  const events = ["pointerdown", "keydown", "touchstart", "scroll", "mousemove"] as const;
  let timer = 0;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cleanup();
    cb();
  };
  const cleanup = () => {
    window.clearTimeout(timer);
    window.removeEventListener("load", arm);
    events.forEach((e) => window.removeEventListener(e, run));
  };
  const arm = () => {
    timer = window.setTimeout(run, delayMs);
  };
  events.forEach((e) => window.addEventListener(e, run, { passive: true, once: true }));
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });
  return () => {
    done = true;
    cleanup();
  };
};
