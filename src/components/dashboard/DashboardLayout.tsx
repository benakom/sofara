import { useState, useEffect } from "react";
import AvatarChat from "@/components/sofar-ai/AvatarChat";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUserTier } from "@/hooks/useUserTier";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard, GraduationCap, GitBranch, Upload, DollarSign,
  CreditCard, ShieldCheck, Trophy, MessageCircle, LogOut,
  Menu, Bell, HelpCircle, Loader2, Calculator, Shield, CalendarDays,
  Sparkles, BookOpen, Users, Crown, ArrowUpCircle
} from "lucide-react";
import OnboardingGate from "./OnboardingGate";
import UpgradeToProDialog from "./UpgradeToProDialog";

type NavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  labelFr: string;
  labelEn: string;
  exact?: boolean;
  badge?: string;
  tier?: "pro"; // only visible to pro users
};

const allNavItems: NavItem[] = [
  { path: "/dashboard", icon: LayoutDashboard, labelFr: "Tableau de bord", labelEn: "Dashboard", exact: true },
  { path: "/dashboard/academy", icon: GraduationCap, labelFr: "Academy", labelEn: "Academy" },
  { path: "/dashboard/pipeline", icon: GitBranch, labelFr: "Pipeline", labelEn: "Pipeline" },
  { path: "/dashboard/import-leads", icon: Upload, labelFr: "Import Leads", labelEn: "Import Leads" },
  { path: "/dashboard/commissions", icon: DollarSign, labelFr: "Commissions", labelEn: "Commissions" },
  { path: "/dashboard/payments", icon: CreditCard, labelFr: "Paiements", labelEn: "Payments" },
  { path: "/dashboard/kyc", icon: ShieldCheck, labelFr: "KYC & AML", labelEn: "KYC & AML", tier: "pro" },
  { path: "/dashboard/ai-hub", icon: Sparkles, labelFr: "SofarAI", labelEn: "SofarAI", badge: "AI", tier: "pro" },
  { path: "/dashboard/library", icon: BookOpen, labelFr: "Bibliothèque", labelEn: "Library", badge: "NEW", tier: "pro" },
  { path: "/dashboard/simulator", icon: Calculator, labelFr: "Simulateurs", labelEn: "Simulators", tier: "pro" },
  { path: "/dashboard/calendar", icon: CalendarDays, labelFr: "Calendrier", labelEn: "Calendar", tier: "pro" },
  { path: "/dashboard/referrals", icon: Users, labelFr: "Mes Filleuls", labelEn: "My Referrals" },
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
  const { profileType, ambassadorTier } = useUserTier();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Sofara Lite: only show specific menus
  const liteAllowedPaths = [
    "/dashboard",
    "/dashboard/pipeline",
    "/dashboard/import-leads",
    "/dashboard/commissions",
    "/dashboard/payments",
    "/dashboard/referrals",
    "/dashboard/bonus",
  ];

  const navItems = allNavItems.filter((item) => {
    if (item.tier === "pro" && profileType !== "pro") return false;
    if (profileType !== "pro" && !liteAllowedPaths.includes(item.path)) return false;
    return true;
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading || profileLoading) {
    return (
      <div className="dash-theme min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-accent))]" />
      </div>
    );
  }

  if (!user) return null;

  const showOnboarding = !isApproved && (needsOnboarding || isPending || isRejected);
  const shouldHideFloatingChat = location.pathname.startsWith("/dashboard/ai-hub");

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
      <div className="px-5 pt-6 pb-5 border-b border-[hsl(var(--dash-sidebar-border))]">
        <div className="flex items-center gap-2">
          <a href="/" className="font-display text-4xl font-bold text-white tracking-tight">
            sofara
          </a>
          {profileType === "pro" && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[hsl(var(--dash-sidebar-active)/.15)] text-[hsl(var(--dash-sidebar-active))]">PRO</span>
          )}
          {ambassadorTier === "ambassador_plus" && (
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          )}
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-[hsl(var(--dash-sidebar-fg)/.4)] mt-0.5 font-medium">Ambassador Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-3 pb-2 flex flex-col">
        <div className="flex flex-col flex-1 justify-evenly">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-[hsl(var(--dash-sidebar-active)/.12)] text-white border border-[hsl(var(--dash-sidebar-active)/.2)]"
                    : "text-[hsl(var(--dash-sidebar-fg)/.65)] hover:text-white hover:bg-[hsl(var(--dash-sidebar-hover))] border border-transparent"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--dash-sidebar-active))]" : ""}`} />
                <span>{lang === "fr" ? item.labelFr : item.labelEn}</span>
                {item.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === "AI" 
                      ? "bg-[hsl(var(--dash-sidebar-active)/.15)] text-[hsl(var(--dash-sidebar-active))]" 
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Upgrade CTA for non-pro users */}
      {profileType !== "pro" && (
        <div className="px-3 pb-2">
          <button
            onClick={() => setUpgradeOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(217,91%,60%,.12)] to-[hsl(263,70%,58%,.08)] border border-[hsl(217,91%,60%,.2)] text-[hsl(var(--dash-sidebar-active))] hover:from-[hsl(217,91%,60%,.18)] hover:to-[hsl(263,70%,58%,.12)] transition-all duration-200 group"
          >
            <ArrowUpCircle className="w-4 h-4 shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-[11px] font-semibold">{lang === "fr" ? "Passer à Pro" : "Upgrade to Pro"}</p>
              <p className="text-[9px] opacity-60">{lang === "fr" ? "Gratuit • Outils avancés" : "Free • Advanced tools"}</p>
            </div>
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))] mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(246,80%,60%)] to-[hsl(280,75%,55%)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user.email?.split("@")[0]}</p>
            <p className="text-[11px] text-[hsl(var(--dash-sidebar-fg)/.4)] truncate">{user.email}</p>
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
          className="flex items-center gap-2 text-[13px] text-[hsl(var(--dash-sidebar-fg)/.45)] hover:text-white transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          {lang === "fr" ? "Déconnexion" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-theme min-h-screen flex bg-[hsl(var(--dash-bg))] overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-[hsl(var(--dash-sidebar-bg))] fixed inset-y-0 left-0 z-40 border-r border-[hsl(var(--dash-sidebar-border))]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] p-0 border-[hsl(var(--dash-sidebar-border))] bg-[hsl(var(--dash-sidebar-bg))] lg:hidden [&>button]:text-[hsl(var(--dash-sidebar-fg))] [&>button]:hover:text-white [&>button]:hover:bg-[hsl(var(--dash-sidebar-hover))]"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card)/.92)] backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors"
            aria-label={lang === "fr" ? "Ouvrir ou fermer le menu" : "Toggle menu"}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-[hsl(var(--dash-muted))] rounded-lg p-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1 rounded-md text-sm transition-all ${
                    lang === l.code ? "bg-[hsl(var(--dash-card))] shadow-sm opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-[hsl(var(--dash-border))] mx-1" />

            <button className="text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))]">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--dash-accent))] rounded-full" />
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
      {isApproved && !sidebarOpen && !shouldHideFloatingChat && <AvatarChat />}

      {/* Upgrade dialog */}
      <UpgradeToProDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        onUpgradeRequested={() => window.location.reload()}
      />
    </div>
  );
};

export default DashboardLayout;
