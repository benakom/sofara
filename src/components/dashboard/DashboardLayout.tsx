import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, GitBranch, Upload, DollarSign,
  CreditCard, ShieldCheck, Bot, Trophy, MessageCircle, LogOut,
  Menu, X, Bell, HelpCircle, Loader2
} from "lucide-react";
import { useEffect } from "react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelFr: "Tableau de bord", labelEn: "Dashboard", exact: true },
  { path: "/dashboard/academy", icon: GraduationCap, labelFr: "Academy", labelEn: "Academy" },
  { path: "/dashboard/pipeline", icon: GitBranch, labelFr: "Pipeline", labelEn: "Pipeline" },
  { path: "/dashboard/import-leads", icon: Upload, labelFr: "Import Leads", labelEn: "Import Leads" },
  { path: "/dashboard/commissions", icon: DollarSign, labelFr: "Commissions", labelEn: "Commissions" },
  { path: "/dashboard/payments", icon: CreditCard, labelFr: "Paiements", labelEn: "Payments" },
  { path: "/dashboard/kyc", icon: ShieldCheck, labelFr: "KYC & AML", labelEn: "KYC & AML" },
  { path: "/dashboard/sofar-ai", icon: Bot, labelFr: "SofarAI", labelEn: "SofarAI", badge: "AI" },
  { path: "/dashboard/bonus", icon: Trophy, labelFr: "Bonus & Rewards", labelEn: "Bonus & Rewards" },
  { path: "/dashboard/community", icon: MessageCircle, labelFr: "Community", labelEn: "Community" },
];

const langs: { code: "fr" | "en"; flag: string }[] = [
  { code: "fr", flag: "🇫🇷" },
  { code: "en", flag: "🇬🇧" },
];

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userInitials = user.email?.substring(0, 2).toUpperCase() || "AB";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 pb-2">
        <a href="/" className="font-display text-3xl font-bold text-foreground tracking-tight">
          sofara
        </a>
        <p className="text-xs text-muted-foreground mt-0.5">Plateforme Ambassadeurs</p>
      </div>

      {/* Role label */}
      <div className="px-6 py-3">
        <span className="text-xs text-muted-foreground">Ambassadeur</span>
      </div>

      {/* Nav section */}
      <div className="px-3 pb-2">
        <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          AMBASSADEUR
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span>{lang === "fr" ? item.labelFr : item.labelEn}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border/30 mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{user.email?.split("@")[0]}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          {lang === "fr" ? "Déconnexion" : "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar - stays dark */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-card border-r border-border/40 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border/40 z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content - light theme */}
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen dash-content">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b dash-border-color bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden dash-text p-1"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Bonus badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white border dash-border-color rounded-full px-3 py-1.5 text-sm">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-semibold dash-text">AED 0</span>
            </div>

            {/* Language */}
            <div className="flex items-center gap-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-1.5 py-1 rounded-md text-sm transition-all ${
                    lang === l.code ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            <button className="dash-muted-text hover:dash-text transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="dash-muted-text hover:dash-text transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
