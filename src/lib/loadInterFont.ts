// Inter is the dashboard/admin UI font. It is requested when those areas load, so the public pages (Poppins,
// self-hosted) never open a connection to Google Fonts.
const INTER_CSS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

export const loadInterFont = () => {
  if (typeof document === "undefined" || document.querySelector(`link[href="${INTER_CSS}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = INTER_CSS;
  document.head.appendChild(link);
};
