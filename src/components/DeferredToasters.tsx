import { lazy, Suspense, useEffect, useState } from "react";

const Toasters = lazy(() => import("./Toasters"));

/**
 * Toast viewports (Radix toast + Sonner) mount once the browser is idle after hydration instead of shipping in the
 * entry bundle.
 * They render nothing on the server and on the first client render, so prerendered pages hydrate unchanged;
 * a Radix toast raised before that is kept by its store and shown on mount; Sonner is only used by dashboard/admin
 * screens, in response to user actions.
 */
const DeferredToasters = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const start = () => setReady(true);
    if (!w.requestIdleCallback) {
      const t = window.setTimeout(start, 1500);
      return () => window.clearTimeout(t);
    }
    const id = w.requestIdleCallback(start, { timeout: 3000 });
    return () => w.cancelIdleCallback?.(id);
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <Toasters />
    </Suspense>
  );
};

export default DeferredToasters;
