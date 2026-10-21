import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
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
      const timer = setTimeout(() => setVisible(true), 1500);
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
    en: { title: "We use cookies 🍪", body: "We use cookies to enhance your experience and analyze site traffic. You can accept or decline non-essential cookies.", accept: "Accept all", decline: "Decline", link: "Cookie policy", close: "Close" },
    fr: { title: "Nous utilisons des cookies 🍪", body: "Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience du site. Vous pouvez accepter ou refuser les cookies non essentiels.", accept: "Tout accepter", decline: "Refuser", link: "Politique cookies", close: "Fermer" },
    es: { title: "Usamos cookies 🍪", body: "Usamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. Puedes aceptar o rechazar las cookies no esenciales.", accept: "Aceptar todo", decline: "Rechazar", link: "Política de cookies", close: "Cerrar" },
    arb: { title: "نستخدم ملفات تعريف الارتباط 🍪", body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وقياس زيارات الموقع. يمكنك قبول ملفات تعريف الارتباط غير الضرورية أو رفضها.", accept: "قبول الكل", decline: "رفض", link: "سياسة ملفات تعريف الارتباط", close: "إغلاق" },
    ru: { title: "Мы используем cookie 🍪", body: "Мы используем файлы cookie, чтобы улучшить работу сайта и анализировать трафик. Вы можете принять или отклонить необязательные cookie.", accept: "Принять все", decline: "Отклонить", link: "Политика cookie", close: "Закрыть" },
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
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[9999]"
        >
          <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-2xl">
            <button
              onClick={decline}
              className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={text.close}
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Cookie size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{text.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {text.body}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={accept}
                className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 px-4 rounded-xl hover:brightness-110 transition-all"
              >
                {text.accept}
              </button>
              <button
                onClick={decline}
                className="flex-1 bg-secondary text-secondary-foreground text-sm font-medium py-2.5 px-4 rounded-xl hover:bg-secondary/80 transition-all"
              >
                {text.decline}
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link
                to="/legal/cookies"
                className="text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
              >
                {text.link}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
