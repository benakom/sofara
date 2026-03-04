import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const stats = [
    {
      label: lang === "fr" ? "Leads envoyés" : "Leads sent",
      value: "0",
      icon: Users,
    },
    {
      label: lang === "fr" ? "Conversions" : "Conversions",
      value: "0",
      icon: TrendingUp,
    },
    {
      label: lang === "fr" ? "Commissions" : "Commissions",
      value: "0 €",
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display text-2xl font-bold text-foreground tracking-tight">
            sofara
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              {lang === "fr" ? "Déconnexion" : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {lang === "fr" ? "Tableau de bord" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {lang === "fr"
              ? "Bienvenue dans votre espace ambassadeur."
              : "Welcome to your ambassador space."}
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Placeholder content */}
          <div className="bg-card/30 backdrop-blur border border-border/30 rounded-2xl p-10 text-center">
            <LayoutDashboard className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {lang === "fr"
                ? "Votre dashboard sera enrichi prochainement avec le suivi de vos leads, conversions et commissions."
                : "Your dashboard will soon be enriched with lead tracking, conversions and commissions."}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
