import { startTransition, Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { Fold, Loader } from "@/lib/fold";

/**
 * A group of below-the-fold sections of a prerendered page.
 *
 * - Server render and client-side navigation: the sections are `React.lazy` components inside a Suspense boundary,
 *   exactly like a plain lazy import.
 * - Hydration of a prerendered page: the server HTML is kept as is (an element rendered with
 *   `dangerouslySetInnerHTML: { __html: "" }` is hydrated without touching or re-rendering its children), and the fold's
 *   code is fetched when the fold comes within a viewport of the screen, at the latest a few seconds after load. The
 *   sections are then rendered from the loaded modules, synchronously, so no fallback ever replaces visible content.
 *   Only the first screen is hydrated on load; the rest of the page costs nothing until it is about to be seen.
 */
// Folds whose prerendered HTML has been adopted once; a later mount at the same id is a client render.
const adopted = new Set<string>();
let backstops = 0;

const hasServerHtml = (id: string) => {
  if (typeof document === "undefined" || adopted.has(id)) return false;
  const root = document.getElementById("root");
  return !!root?.getAttribute("data-ssr") && !!document.getElementById(id)?.firstElementChild;
};

interface Props {
  id: string;
  fold: Fold<readonly Loader[]>;
  /** Changing it (language switch on the same route) renders the fold from its modules right away. */
  scope?: string;
  fallback?: ReactNode;
  children: (components: ComponentType[]) => ReactNode;
}

const LazyFold = ({ id, fold, scope, fallback = null, children }: Props) => {
  const [mods, setMods] = useState<ComponentType[] | null>(null);
  const [keepServerHtml] = useState(() => {
    if (!hasServerHtml(id)) return false;
    adopted.add(id);
    return true;
  });
  const [initialScope] = useState(scope);

  useEffect(() => {
    if (!keepServerHtml || mods) return;
    const el = document.getElementById(id);
    let done = false;
    let timer = 0;
    const observer =
      el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && release(), { rootMargin: "100% 0px" })
        : null;
    const cleanup = () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", arm);
    };
    const release = () => {
      if (done) return;
      done = true;
      cleanup();
      fold.load().then((components) => startTransition(() => setMods(components)));
    };
    // Backstop: the whole page is hydrated shortly after load anyway, one fold at a time.
    const arm = () => {
      timer = window.setTimeout(release, 5000 + 400 * backstops++);
    };
    if (observer && el) observer.observe(el);
    else release();
    if (scope !== initialScope) release();
    else if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      done = true;
      cleanup();
    };
  }, [id, fold, keepServerHtml, mods, scope, initialScope]);

  if (mods) return <div id={id}>{children(mods)}</div>;
  if (keepServerHtml) return <div id={id} dangerouslySetInnerHTML={{ __html: "" }} suppressHydrationWarning />;
  return (
    <div id={id}>
      <Suspense fallback={fallback}>{children(fold.lazy)}</Suspense>
    </div>
  );
};

export default LazyFold;
