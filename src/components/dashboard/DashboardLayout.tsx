import { useState } from "react";
import AvatarChat from "@/components/sofar-ai/AvatarChat";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, GitBranch, Upload, DollarSign,
  CreditCard, ShieldCheck, Bot, Trophy, MessageCircle, LogOut,
  Menu, Bell, HelpCircle, Loader2, Calculator, Shield, CalendarDays,
  Sparkles
} from "lucide-react";
import { useEffect } from "react";
import OnboardingGate from "./OnboardingGate";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelFr: "Tableau de bord", labelEn: "Dashboard", exact: true },
  { path: "/dashboard/academy", icon: GraduationCap, labelFr: "Academy", labelEn: "Academy" },
  { path: "/dashboard/pipeline", icon: GitBranch, labelFr: "Pipeline", labelEn: "Pipeline" },
  { path: "/dashboard/import-leads", icon: Upload, labelFr: "Import Leads", labelEn: "Import Leads" },
  { path: "/dashboard/commissions", icon: DollarSign, labelFr: "Commissions", labelEn: "Commissions" },
  { path: "/dashboard/payments", icon: CreditCard, labelFr: "Paiements", labelEn: "Payments" },
  { path: "/dashboard/kyc", icon: ShieldCheck, labelFr: "KYC & AML", labelEn: "KYC & AML" },
  { path: "/dashboard/ai-hub", icon: Sparkles, labelFr: "SofarAI", labelEn: "SofarAI", badge: "AI" },
  
  { path: "/dashboard/simulator", icon: Calculator, labelFr: "Simulateurs", labelEn: "Simulators" },
  { path: "/dashboard/calendar", icon: CalendarDays, labelFr: "Calendrier", labelEn: "Calendar" },
  { path: "/dashboard/bonus", icon: Trophy, labelFr: "Bonus & Rewards", labelEn: "Bonus & Rewards" },
  { path: "/dashboard/community", icon: MessageCircle, labelFr: "Community", labelEn: "Community" },
];

const langs: { code: "fr" | "en"; flag: string }[] = [
  { code: "fr", flag: "🇫🇷" },
  { code: "en", flag: "🇬🇧" },
];

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isSuperAdmin } = useAdmin();
  const { isApproved, isPending, isRejected, needsOnboarding, loading: profileLoading, refetch } = useProfileStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  if (!user) return null;

  const showOnboarding = !isApproved && (needsOnboarding || isPending || isRejected);

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
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <a href="/" className="font-display text-2xl font-bold text-white tracking-tight">
          sofara
        </a>
      </div>

      {/* Nav */}
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-[hsl(var(--dash-sidebar-active)/.15)] text-white"
                  : "text-[hsl(var(--dash-sidebar-fg)/.7)] hover:text-white hover:bg-[hsl(var(--dash-sidebar-hover))]"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--dash-sidebar-active))]" : ""}`} />
              <span>{lang === "fr" ? item.labelFr : item.labelEn}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold bg-[hsl(var(--primary)/.2)] text-[hsl(var(--primary))] px-1.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))] mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/.2)] flex items-center justify-center text-xs font-semibold text-[hsl(var(--primary))]">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user.email?.split("@")[0]}</p>
            <p className="text-xs text-[hsl(var(--dash-sidebar-fg)/.5)] truncate">{user.email}</p>
          </div>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-sm text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))] transition-colors w-full px-1 mb-2 font-semibold"
          >
            <Shield className="w-4 h-4" />
            Super Admin
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-[hsl(var(--dash-sidebar-fg)/.5)] hover:text-white transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          {lang === "fr" ? "Déconnexion" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[hsl(var(--dash-bg))] overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-[hsl(var(--dash-sidebar-bg))] fixed inset-y-0 left-0 z-40">
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[240px] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-12 border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card)/.85)] backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[hsl(var(--dash-muted-fg))] p-1"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-1.5 py-1 rounded text-sm transition-all ${
                    lang === l.code ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            <button className="text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))]">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))] relative">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {showOnboarding ? (
            <OnboardingGate
              needsOnboarding={needsOnboarding}
              isPendingReview={isPending}
              isRejected={isRejected}
              onComplete={refetch}
            />
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* SofarAI Avatar Chat — only for approved users */}
      {isApproved && <AvatarChat />}
    </div>
  );
};

export default DashboardLayout;
