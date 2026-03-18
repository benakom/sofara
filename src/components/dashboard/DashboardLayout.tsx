import { useState, useEffect } from "react";
import AvatarChat from "@/components/sofar-ai/AvatarChat";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useLanguage } from "@/i18n/LanguageContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard, GraduationCap, GitBranch, Upload, DollarSign,
  CreditCard, ShieldCheck, Trophy, MessageCircle, LogOut,
  Menu, Bell, HelpCircle, Loader2, Calculator, Shield, CalendarDays,
  Sparkles, BookOpen
} from "lucide-react";
import OnboardingGate from "./OnboardingGate";

const mainNav = [
  { path: "/dashboard", icon: LayoutDashboard, labelFr: "Tableau de bord", labelEn: "Dashboard", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelFr: "Pipeline", labelEn: "Pipeline" },
  { path: "/dashboard/import-leads", icon: Upload, labelFr: "Import Leads", labelEn: "Import Leads" },
  { path: "/dashboard/commissions", icon: DollarSign, labelFr: "Commissions", labelEn: "Commissions" },
  { path: "/dashboard/payments", icon: CreditCard, labelFr: "Paiements", labelEn: "Payments" },
  { path: "/dashboard/kyc", icon: ShieldCheck, labelFr: "KYC & AML", labelEn: "KYC & AML" },
];

const toolsNav = [
  { path: "/dashboard/ai-hub", icon: Sparkles, labelFr: "SofarAI", labelEn: "SofarAI", badge: "AI" },
  { path: "/dashboard/library", icon: BookOpen, labelFr: "Bibliothèque", labelEn: "Library", badge: "NEW" },
  { path: "/dashboard/academy", icon: GraduationCap, labelFr: "Academy", labelEn: "Academy" },
  { path: "/dashboard/simulator", icon: Calculator, labelFr: "Simulateurs", labelEn: "Simulators" },
];

const moreNav = [
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-accent" />
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

  const NavItem = ({ item }: { item: { path: string; icon: any; labelFr: string; labelEn: string; exact?: boolean; badge?: string } }) => {
    const active = isActive(item.path, item.exact);
    return (
      <button
        onClick={() => { navigate(item.path); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[12.5px] font-medium transition-colors ${
          active
            ? "bg-accent-pale text-foreground border-l-2 border-accent -ml-[1px]"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <item.icon className={`w-[15px] h-[15px] shrink-0 ${active ? "text-accent" : ""}`} />
        <span>{lang === "fr" ? item.labelFr : item.labelEn}</span>
        {item.badge && (
          <span className={`ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-pill ${
            item.badge === "AI"
              ? "bg-accent-pale text-accent border border-accent-border"
              : "bg-status-blue-bg text-status-blue border border-status-blue/20"
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <a href="/" className="text-[18px] font-semibold text-foreground tracking-[2px] uppercase">
          sofara
        </a>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-4">
        {/* Main */}
        <div>
          <div className="section-label px-3 mb-1.5">{lang === "fr" ? "Principal" : "Main"}</div>
          <div className="space-y-0.5">
            {mainNav.map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        {/* Tools */}
        <div>
          <div className="section-label px-3 mb-1.5">{lang === "fr" ? "Outils" : "Tools"}</div>
          <div className="space-y-0.5">
            {toolsNav.map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        {/* More */}
        <div>
          <div className="section-label px-3 mb-1.5">{lang === "fr" ? "Plus" : "More"}</div>
          <div className="space-y-0.5">
            {moreNav.map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent-pale flex items-center justify-center text-[10px] font-semibold text-accent border border-accent-border">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-foreground truncate">{user.email?.split("@")[0]}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-[12px] text-destructive hover:text-destructive/80 transition-colors w-full px-1 mb-2 font-semibold"
          >
            <Shield className="w-3.5 h-3.5" />
            Super Admin
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors w-full px-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          {lang === "fr" ? "Déconnexion" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-surface fixed inset-y-0 left-0 z-40 border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] p-0 border-border bg-surface lg:hidden [&>button]:text-muted-foreground [&>button]:hover:text-foreground"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 lg:ml-[220px] flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-11 border-b border-border bg-surface flex items-center justify-between px-4 sm:px-5">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden text-muted-foreground p-1"
            aria-label={lang === "fr" ? "Ouvrir ou fermer le menu" : "Toggle menu"}
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-1.5 py-1 rounded text-[12px] transition-all ${
                    lang === l.code ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted">
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted relative">
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-x-hidden">
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
    </div>
  );
};

export default DashboardLayout;
