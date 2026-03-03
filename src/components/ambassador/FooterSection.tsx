const FooterSection = () => {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-lg font-bold text-foreground tracking-tight">
          <span className="text-gradient-gold">Ambass</span>ador
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 Tous droits réservés. Programme Ambassadeur.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
