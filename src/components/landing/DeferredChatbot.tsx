import { lazy, Suspense, useEffect, useState } from "react";

const LandingChatbot = lazy(() => import("./LandingChatbot"));

/** Mounts the landing chatbot once the page is idle, so its code (markdown, Supabase, zod) never delays first paint. */
const DeferredChatbot = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const timer = window.setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 4000 }) : start()), 2500);
    return () => window.clearTimeout(timer);
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <LandingChatbot />
    </Suspense>
  );
};

export default DeferredChatbot;
