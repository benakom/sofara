import { useEffect, useState } from "react";

/**
 * Enter/exit state for a CSS transition (what framer-motion's AnimatePresence did): `mounted` turns on with `open`
 * and off `exitMs` after it closes, so the exit transition can play; `shown` turns on one frame after mounting, so the
 * enter transition starts from the hidden styles.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, exitMs]);

  return { mounted, shown };
}
