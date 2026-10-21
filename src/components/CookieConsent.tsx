import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "@/i18n/LanguageContext";

const COOKIE_KEY = "sofara-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const ctx = useContext(LanguageContext);
  const lang = ctx?.lang ?? "en";

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
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
    en: { short: "We use cookies to measure audience and improve the site.", title: "We use cookies 🍪", body: "We use cookies to enhance your experience and analyze site traffic. You can accept or decline non-essential cookies.", accept: "Accept all", decline: "Decline", link: "Cookie policy", close: "Close" },
    fr: { short: "Nous utilisons des cookies pour mesurer l'audience et améliorer le site.", title: "Nous utilisons des cookies 🍪", body: "Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience du site. Vous pouvez accepter ou refuser les cookies non essentiels.", accept: "Tout accepter", decline: "Refuser", link: "Politique cookies", close: "Fermer" },
    es: { short: "Usamos cookies para medir la audiencia y mejorar el sitio.", title: "Usamos cookies 🍪", body: "Usamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. Puedes aceptar o rechazar las cookies no esenciales.", accept: "Aceptar todo", decline: "Rechazar", link: "Política de cookies", close: "Cerrar" },
    ru: { short: "Мы используем cookie для аналитики и улучшения сайта.", title: "Мы используем cookie 🍪", body: "Мы используем файлы cookie, чтобы улучшить работу сайта и анализировать трафик. Вы можете принять или отклонить необязательные cookie.", accept: "Принять все", decline: "Отклонить", link: "Политика cookie", close: "Закрыть" },
  };
  const text = COPY[lang === "ar" ? "fr" : lang] ?? COPY.en;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[9999] pb-[env(safe-area-inset-bottom)]"
          role="dialog"
          aria-label={text.title}
        >
          {/* Compact bar: one short line + two buttons, so it never hides the page's main button on phones. */}
          <div className="bg-card/95 backdrop-blur-xl border-t sm:border border-border/60 sm:rounded-2xl px-4 py-3 sm:p-4 shadow-2xl flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="flex-1 min-w-[180px] text-xs text-muted-foreground leading-snug">
              {text.short}{" "}
              <Link to="/legal/cookies" className="underline underline-offset-2 hover:text-primary">{text.link}</Link>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={decline} className="text-xs font-medium py-2 px-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {text.decline}
              </button>
              <button onClick={accept} className="text-xs font-semibold py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:brightness-110">
                {text.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
