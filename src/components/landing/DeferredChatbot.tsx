import { lazy, Suspense, useEffect, useState } from "react";

const LandingChatbot = lazy(() => import("./LandingChatbot"));

/** Mounts the landing chatbot after the first screen has been read, so its code and bubble never get in the way of the hero. */
const DeferredChatbot = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // The chat bubble appears once the visitor has read a bit (scrolled past the first screen) or after 20 s,
    // so it never covers the hero and its button on phones.
    const start = () => setReady(true);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) start();
    };
    const timer = window.setTimeout(start, 20000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <LandingChatbot />
    </Suspense>
  );
};

export default DeferredChatbot;
