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
  Sparkles, BookOpen, Users, Crown, ArrowUpCircle, MoreHorizontal, Search
} from "lucide-react";

import UpgradeToProDialog from "./UpgradeToProDialog";

type NavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  labelAr: string;
  labelEn: string;
  exact?: boolean;
  badge?: string;
  tier?: "pro";
};

const allNavItems: NavItem[] = [
  { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Home", exact: true },
  { path: "/dashboard/academy", icon: GraduationCap, labelAr: "الأكاديمية", labelEn: "Academy" },
  { path: "/dashboard/pipeline", icon: GitBranch, labelAr: "العملاء", labelEn: "Pipeline" },
  { path: "/dashboard/import-leads", icon: Upload, labelAr: "استيراد العملاء", labelEn: "Import Leads" },
  { path: "/dashboard/commissions", icon: DollarSign, labelAr: "العمولات", labelEn: "Commissions" },
  { path: "/dashboard/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
  { path: "/dashboard/kyc", icon: ShieldCheck, labelAr: "KYC & AML", labelEn: "KYC & AML", tier: "pro" },
  { path: "/dashboard/ai-hub", icon: Sparkles, labelAr: "SofarAI", labelEn: "SofarAI", badge: "AI", tier: "pro" },
  { path: "/dashboard/library", icon: BookOpen, labelAr: "المكتبة", labelEn: "Library", badge: "NEW", tier: "pro" },
  { path: "/dashboard/simulator", icon: Calculator, labelAr: "المحاكي", labelEn: "Simulators", tier: "pro" },
  { path: "/dashboard/calendar", icon: CalendarDays, labelAr: "التقويم", labelEn: "Calendar", tier: "pro" },
  { path: "/dashboard/referrals", icon: Users, labelAr: "إحالاتي", labelEn: "My Referrals" },
  { path: "/dashboard/bonus", icon: Trophy, labelAr: "المكافآت والجوائز", labelEn: "Bonus & Rewards" },
  { path: "/dashboard/community", icon: MessageCircle, labelAr: "المجتمع", labelEn: "Community" },
];

const langs: { code: "en" | "ar"; flag: string }[] = [
  { code: "en", flag: "🇬🇧" },
  { code: "ar", flag: "🇦🇪" },
];

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isSuperAdmin } = useAdmin();
  const { isApproved, loading: profileLoading } = useProfileStatus();
  const { profileType, ambassadorTier } = useUserTier();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

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

  const shouldHideFloatingChat = location.pathname.startsWith("/dashboard/ai-hub");

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName = user.email?.split("@")[0] || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          {/* Orange logo mark */}
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--dash-accent))] flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <a href="/" className="font-display text-xl font-bold text-[hsl(var(--dash-fg))] tracking-tight">
            sofara
          </a>
          {profileType === "pro" && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[hsl(var(--dash-accent)/.1)] text-[hsl(var(--dash-accent))]">PRO</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 pb-2 overflow-y-auto">
        <div className="space-y-0.5">
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
                    ? "bg-[hsl(var(--dash-accent)/.08)] text-[hsl(var(--dash-fg))] font-semibold"
                    : "text-[hsl(var(--dash-sidebar-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-sidebar-hover))]"
                }`}
                style={active ? { borderInlineStart: "3px solid hsl(var(--dash-accent))" } : { borderInlineStart: "3px solid transparent" }}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[hsl(var(--dash-accent))]" : ""}`} />
                <span className="flex-1 text-start">{lang === "ar" ? item.labelAr : item.labelEn}</span>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === "AI"
                      ? "bg-[hsl(var(--dash-accent)/.1)] text-[hsl(var(--dash-accent))]"
                      : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"
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
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--dash-accent)/.3)] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--dash-accent))] flex items-center justify-center shrink-0">
              <ArrowUpCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 text-start">
              <p className="text-[11px] font-semibold text-[hsl(var(--dash-fg))]">{lang === "ar" ? "الترقية إلى Pro" : "Upgrade to Pro"}</p>
              <p className="text-[9px] text-[hsl(var(--dash-muted-fg))]">{lang === "ar" ? "أدوات متقدمة" : "Advanced tools"}</p>
            </div>
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))] mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[hsl(var(--dash-fg))]"
          >
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{userName}</p>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{user.email}</p>
          </div>
          <button className="p-1 rounded hover:bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-xs text-[hsl(var(--dash-accent))] hover:text-[hsl(var(--dash-accent))] transition-colors w-full px-1 mb-2 font-semibold"
          >
            <Shield className="w-3.5 h-3.5" />
            Super Admin
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[13px] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors w-full px-1 rounded-lg py-1.5 hover:bg-[hsl(var(--dash-muted))]"
        >
          <LogOut className="w-4 h-4" />
          {lang === "ar" ? "تسجيل الخروج" : "Log out"}
        </button>
      </div>
    </div>
  );

  const isRtl = lang === "ar";

  return (
    <div className="dash-theme min-h-screen flex bg-[hsl(var(--dash-bg))] overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-[240px] bg-[hsl(var(--dash-sidebar-bg))] fixed inset-y-0 z-40 ${
        isRtl ? "right-0 border-l" : "left-0 border-r"
      } border-[hsl(var(--dash-sidebar-border))]`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side={isRtl ? "right" : "left"}
          className="w-[280px] max-w-[85vw] p-0 border-[hsl(var(--dash-sidebar-border))] bg-[hsl(var(--dash-sidebar-bg))] lg:hidden [&>button]:text-[hsl(var(--dash-muted-fg))] [&>button]:hover:text-[hsl(var(--dash-fg))] [&>button]:hover:bg-[hsl(var(--dash-sidebar-hover))]"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={`flex-1 ${isRtl ? "lg:mr-[240px]" : "lg:ml-[240px]"} flex flex-col min-h-screen min-w-0 overflow-x-hidden`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card)/.97)] backdrop-blur-sm flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors"
            aria-label={lang === "ar" ? "فتح أو إغلاق القائمة" : "Toggle menu"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar — Vestox style */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs ms-4">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
              <input
                type="text"
                placeholder={lang === "ar" ? "بحث..." : "Search something"}
                className="w-full h-9 ps-9 pe-3 rounded-lg border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--dash-accent)/.3)]"
              />
            </div>
          </div>

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
          <Outlet />
        </main>
      </div>

      {/* SofarAI Avatar Chat */}
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
