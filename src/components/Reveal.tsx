import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

type Ease = [number, number, number, number];

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Start offset in px (slides to 0). */
  x?: number;
  y?: number;
  /** Start scale (grows to 1). */
  scale?: number;
  /** Seconds. */
  delay?: number;
  /** Seconds. Without it: opacity 0.3 s and a spring for the movement (the former framer-motion defaults). */
  duration?: number;
  /** cubic-bezier control points, used with `duration` (default: ease-in-out). */
  ease?: Ease;
  /** Reveals its `item` children together when the group scrolls into view (stagger them with `delay`). */
  group?: boolean;
  /** Child of a `group`: animated with the group instead of on its own. */
  item?: boolean;
  children?: ReactNode;
}

/**
 * Fades/slides its content in the first time it scrolls into view. Pure markup: the server renders the final, visible
 * state; the hidden state and the reveal are CSS driven by the inline script in index.html (see "Scroll reveal" in
 * src/index.css). So the content is readable without JavaScript, nothing changes at hydration, and reduced-motion
 * users get no animation.
 */
const Reveal = ({ as: Tag = "div", x, y, scale, delay, duration, ease, group, item, style, children, ...rest }: RevealProps) => {
  if (group) {
    return (
      <Tag data-reveal="group" style={style} {...rest}>
        {children}
      </Tag>
    );
  }
  const vars: Record<string, string> = {};
  if (x) vars["--rv-x"] = `${x}px`;
  if (y) vars["--rv-y"] = `${y}px`;
  if (scale !== undefined && scale !== 1) vars["--rv-s"] = String(scale);
  if (delay) vars["--rv-delay"] = `${+delay.toFixed(3)}s`;
  if (duration) {
    vars["--rv-dur"] = `${duration}s`;
    vars["--rv-ease"] = `cubic-bezier(${(ease ?? [0.42, 0, 0.58, 1]).join(",")})`;
  } else if (scale !== undefined && !x && !y) {
    // framer-motion animates scale with a critically damped spring: no overshoot.
    vars["--rv-ease"] = "cubic-bezier(0.25,0.1,0.35,1)";
  }
  return (
    <Tag {...(item ? { "data-reveal-item": "" } : { "data-reveal": "" })} style={{ ...(vars as CSSProperties), ...style }} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
