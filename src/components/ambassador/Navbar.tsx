import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-display text-xl font-bold text-foreground tracking-tight">
          <span className="text-gradient-gold">Ambass</span>ador
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#avantages" className="hover:text-foreground transition-colors">Avantages</a>
          <a href="#comment" className="hover:text-foreground transition-colors">Comment ça marche</a>
          <a href="#postuler" className="hover:text-foreground transition-colors">Postuler</a>
        </div>
        <Button variant="hero" size="sm" className="rounded-lg">
          Postuler
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
