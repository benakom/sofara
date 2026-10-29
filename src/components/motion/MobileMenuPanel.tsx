import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Animated mobile menu panel. Loaded on demand by the Navbar so framer-motion stays out of the entry bundle. */
const MobileMenuPanel = ({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className={className}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default MobileMenuPanel;
