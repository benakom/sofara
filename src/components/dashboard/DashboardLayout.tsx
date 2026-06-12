import { useState, useEffect } from "react";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUserTier } from "@/hooks/useUserTier";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard, GraduationCap, GitBranch, Upload, DollarSign,
  CreditCard, ShieldCheck, MessageCircle, LogOut,
  Menu, Bell, HelpCircle, Loader2, Calculator, Shield, CalendarDays,
  Sparkles, BookOpen, Users, Crown, ArrowUpCircle, Search, ChevronDown
} from "lucide-react";

import UpgradeToProDialog from "./UpgradeToProDialog";
import MobileBottomNav from "./MobileBottomNav";

type NavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  labelAr: string;
  labelEn: string;
  exact?: boolean;
  badge?: string;
  tier?: "pro";
};

type NavGroup = {
  labelEn: string;
  labelAr: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    labelEn: "Leads",
    labelAr: "العملاء",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard", exact: true },
      { path: "/dashboard/import-leads", icon: Upload, labelAr: "استيراد العملاء", labelEn: "Submit Lead" },
      { path: "/dashboard/pipeline", icon: GitBranch, labelAr: "العملاء", labelEn: "My Leads" },
    ],
  },
  {
    labelEn: "Earnings",
    labelAr: "الأرباح",
    items: [
      { path: "/dashboard/commissions", icon: DollarSign, labelAr: "العمولات", labelEn: "Commissions" },
      { path: "/dashboard/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
    ],
  },
];

  const filteredGroups = navGroups;

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
      {/* Logo — dark block */}
      <div className="px-5 pt-5 pb-4 bg-[hsl(0,0%,7%)] rounded-b-2xl mx-2 mt-2">
        <div className="flex items-center gap-2">
          <a href="/" className="font-display text-3xl font-bold text-[#D2F34C] tracking-tight">
            sofara
          </a>
          {profileType === "pro" && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D2F34C]/20 text-[#D2F34C] border border-[#D2F34C]/30">PRO</span>
          )}
          {ambassadorTier === "ambassador_plus" && (
            <Crown className="w-3.5 h-3.5 text-[#D2F34C]" />
          )}
        </div>
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mt-0.5 font-medium">Ambassador Platform</p>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 pt-4 pb-2 flex flex-col overflow-y-auto gap-0.5">
        {filteredGroups.flatMap((group) => group.items).map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-[hsl(var(--dash-accent)/.1)] text-[hsl(var(--dash-fg))] shadow-sm"
                  : "text-[hsl(var(--dash-sidebar-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-sidebar-hover))]"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--dash-accent))]" : ""}`} />
              <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
              {item.badge && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[hsl(var(--dash-accent)/.12)] text-[hsl(var(--dash-accent))]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade CTA for non-pro users */}
      {profileType !== "pro" && (
        <div className="px-3 pb-2">
          <button
            onClick={() => setUpgradeOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[hsl(var(--dash-accent)/.08)] border border-[hsl(var(--dash-accent)/.2)] hover:bg-[hsl(var(--dash-accent)/.15)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D2F34C] flex items-center justify-center shrink-0 text-black">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[11px] font-semibold text-[hsl(var(--dash-fg))]">{lang === "ar" ? "الترقية إلى Pro" : "Upgrade to Pro"}</p>
              <p className="text-[9px] text-[hsl(var(--dash-muted-fg))]">{lang === "ar" ? "مجاني • أدوات متقدمة" : "Free • Advanced tools"}</p>
            </div>
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))] mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-sm bg-[#D2F34C]">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{user.email?.split("@")[0]}</p>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{user.email}</p>
          </div>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-sm text-[hsl(var(--dash-accent))] hover:text-[hsl(var(--dash-accent))] transition-colors w-full px-1 mb-2 font-semibold"
          >
            <Shield className="w-4 h-4" />
            Super Admin
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[13px] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
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
      } border-[hsl(var(--dash-sidebar-border))] shadow-[2px_0_12px_rgba(0,0,0,0.04)]`}>
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
        {/* Top bar — dark */}
        <header className="sticky top-0 z-30 h-14 border-b border-[hsl(var(--dash-topbar-border))] bg-[hsl(var(--dash-topbar-bg))] flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={lang === "ar" ? "فتح أو إغلاق القائمة" : "Toggle menu"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar in topbar */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg bg-white/8 border border-white/10">
              <Search className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[12px] text-white/30">{lang === "ar" ? "بحث..." : "Search..."}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-white/8 rounded-lg p-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1 rounded-md text-sm transition-all ${
                    lang === l.code ? "bg-white/15 shadow-sm opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button className="text-white/50 hover:text-white/80 transition-colors p-2 rounded-lg hover:bg-white/8">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="text-white/50 hover:text-white/80 transition-colors p-2 rounded-lg hover:bg-white/8 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D2F34C] rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

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
