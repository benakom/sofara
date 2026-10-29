/**
 * Inter is the dashboard/admin typeface (see `.dash-theme` in src/index.css). Public pages use self-hosted Poppins
 * only, so the Google Fonts request is made here, on demand, instead of from index.html where it cost every visitor a
 * third-party connection and a late font swap.
 */
const HREF = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

export const loadInterFont = () => {
  if (typeof document === "undefined" || document.querySelector(`link[href="${HREF}"]`)) return;
  for (const [href, crossOrigin] of [
    ["https://fonts.googleapis.com", undefined],
    ["https://fonts.gstatic.com", "anonymous"],
  ] as const) {
    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = href;
    if (crossOrigin) pre.crossOrigin = crossOrigin;
    document.head.appendChild(pre);
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = HREF;
  document.head.appendChild(link);
};
