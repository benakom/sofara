import { lazy, Suspense, useEffect, useState } from "react";
import { onInteractionOrDelay } from "@/lib/defer";

const LandingChatbot = lazy(() => import("./LandingChatbot"));

/**
 * Mounts the landing chatbot at the visitor's first interaction, or a few seconds after the page has loaded, so its
 * code (markdown, zod, chat UI) never competes with the prerendered page's first screen and hydration.
 */
const DeferredChatbot = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => onInteractionOrDelay(() => setReady(true), 5000), []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <LandingChatbot />
    </Suspense>
  );
};

export default DeferredChatbot;
