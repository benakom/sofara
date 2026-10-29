import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

export interface CookieBannerText {
  title: string;
  body: string;
  accept: string;
  decline: string;
  link: string;
  close: string;
}

/** The animated consent banner. Loaded only when it is about to be shown, so framer-motion stays out of the entry bundle. */
const CookieBanner = ({ visible, text, accept, decline }: { visible: boolean; text: CookieBannerText; accept: () => void; decline: () => void }) => (
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

export default CookieBanner;
