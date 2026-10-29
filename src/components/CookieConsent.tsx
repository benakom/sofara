import { useState, useEffect, useContext, lazy, Suspense } from "react";
import { LanguageContext } from "@/i18n/LanguageContext";

const CookieBanner = lazy(() => import("./CookieBanner"));

const COOKIE_KEY = "sofara-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  // The banner module is fetched the first time it has to be shown, then kept mounted so its exit animation plays.
  const [mounted, setMounted] = useState(false);
  const ctx = useContext(LanguageContext);
  const lang = ctx?.lang ?? "en";

  useEffect(() => {
    let consent: string | null = null;
    try { consent = localStorage.getItem(COOKIE_KEY); } catch { /* storage blocked */ }
    if (consent) return;
    // Shown at the visitor's first interaction (or after 12 s), never on top of the first screen while it loads.
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const show = () => { setMounted(true); setVisible(true); cleanup(); };
    const timer = window.setTimeout(show, 12000);
    const cleanup = () => { window.clearTimeout(timer); events.forEach((e) => window.removeEventListener(e, show)); };
    events.forEach((e) => window.addEventListener(e, show, { passive: true, once: true }));
    return cleanup;
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  // "ar" is the dashboard's legacy code for French.
  const COPY = {
    en: { title: "We use cookies 🍪", body: "We use cookies to enhance your experience and analyze site traffic. You can accept or decline non-essential cookies.", accept: "Accept all", decline: "Decline", link: "Cookie policy", close: "Close" },
    fr: { title: "Nous utilisons des cookies 🍪", body: "Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience du site. Vous pouvez accepter ou refuser les cookies non essentiels.", accept: "Tout accepter", decline: "Refuser", link: "Politique cookies", close: "Fermer" },
    es: { title: "Usamos cookies 🍪", body: "Usamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. Puedes aceptar o rechazar las cookies no esenciales.", accept: "Aceptar todo", decline: "Rechazar", link: "Política de cookies", close: "Cerrar" },
    arb: { title: "نستخدم ملفات تعريف الارتباط 🍪", body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وقياس زيارات الموقع. يمكنك قبول ملفات تعريف الارتباط غير الضرورية أو رفضها.", accept: "قبول الكل", decline: "رفض", link: "سياسة ملفات تعريف الارتباط", close: "إغلاق" },
    ru: { title: "Мы используем cookie 🍪", body: "Мы используем файлы cookie, чтобы улучшить работу сайта и анализировать трафик. Вы можете принять или отклонить необязательные cookie.", accept: "Принять все", decline: "Отклонить", link: "Политика cookie", close: "Закрыть" },
  };
  const text = COPY[lang === "ar" ? "fr" : lang] ?? COPY.en;

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <CookieBanner visible={visible} text={text} accept={accept} decline={decline} />
    </Suspense>
  );
};

export default CookieConsent;
