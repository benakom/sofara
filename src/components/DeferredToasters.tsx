import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { onInteractionOrDelay } from "@/lib/defer";

const isAppRoute = (path: string) => /^\/(dashboard|admin|auth|reset-password)(\/|$)/.test(path);

/**
 * Toast viewports. Mounted at once on app routes; on public pages only at the first interaction or a few seconds
 * after load, because nothing there toasts on the first screen and Sonner injects a stylesheet on mount, which
 * re-styles the whole prerendered page during hydration.
 */
const DeferredToasters = () => {
  const [show, setShow] = useState(() => typeof window !== "undefined" && isAppRoute(window.location.pathname));
  useEffect(() => {
    if (show) return;
    return onInteractionOrDelay(() => setShow(true), 4000);
  }, [show]);
  if (!show) return null;
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
};

export default DeferredToasters;
