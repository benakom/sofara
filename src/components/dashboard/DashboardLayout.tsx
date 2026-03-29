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
  Menu, Bell, Loader2, Calculator, Shield, CalendarDays,
  Sparkles, BookOpen, Users, ArrowUpCircle, Search, Phone
} from "lucide-react";

import UpgradeToProDialog from "./UpgradeToProDialog";

type NavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  labelAr: string;
  labelEn: string;
  exact?: boolean;
  badge?: number;
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
  { path: "/dashboard/ai-hub", icon: Sparkles, labelAr: "SofarAI", labelEn: "SofarAI", tier: "pro" },
  { path: "/dashboard/library", icon: BookOpen, labelAr: "المكتبة", labelEn: "Library", tier: "pro" },
  { path: "/dashboard/simulator", icon: Calculator, labelAr: "المحاكي", labelEn: "Simulators", tier: "pro" },
  { path: "/dashboard/calendar", icon: CalendarDays, labelAr: "التقويم", labelEn: "Calendar", tier: "pro" },
  { path: "/dashboard/referrals", icon: Users, labelAr: "إحالاتي", labelEn: "My Referrals" },
  { path: "/dashboard/bonus", icon: Trophy, labelAr: "المكافآت والجوائز", labelEn: "Bonus & Rewards" },
  { path: "/dashboard/community", icon: MessageCircle, labelAr: "المجتمع", labelEn: "Community", badge: 6 },
];

const langs: { code: "en" | "ar"; flag: string }[] = [
  { code: "en", flag: "🇬🇧" },
  { code: "ar", flag: "🇦🇪" },
];

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isSuperAdmin } = useAdmin();
  const { isApproved, loading: profileLoading } = useProfileStatus();
  const { profileType } = useUserTier();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const liteAllowedPaths = [
    "/dashboard", "/dashboard/pipeline", "/dashboard/import-leads",
    "/dashboard/commissions", "/dashboard/payments", "/dashboard/referrals", "/dashboard/bonus",
  ];

  const navItems = allNavItems.filter((item) => {
    if (item.tier === "pro" && profileType !== "pro") return false;
    if (profileType !== "pro" && !liteAllowedPaths.includes(item.path)) return false;
    return true;
  });

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

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

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const userName = user.email?.split("@")[0] || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const isRtl = lang === "ar";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--dash-fg))] flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-tight">S</span>
          </div>
          <a href="/" className="font-display text-[17px] font-extrabold text-[hsl(var(--dash-fg))] tracking-tight uppercase">
            sofara
          </a>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-fg))] font-semibold"
                    : "text-[hsl(var(--dash-sidebar-fg))] hover:bg-[hsl(var(--dash-sidebar-hover))] hover:text-[hsl(var(--dash-fg))] font-medium"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[hsl(var(--dash-fg))]" : ""}`} />
                <span className="flex-1 text-start">{lang === "ar" ? item.labelAr : item.labelEn}</span>
                {item.badge && (
                  <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Upgrade CTA — Influency style */}
      {profileType !== "pro" && (
        <div className="px-4 pb-3">
          <div className="rounded-2xl bg-[hsl(var(--dash-muted))] p-4">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center mb-3">
              <ArrowUpCircle className="w-5 h-5 text-[hsl(var(--dash-accent-fg))]" />
            </div>
            <h4 className="text-sm font-bold text-[hsl(var(--dash-fg))]">Upgrade to Pro</h4>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-1 leading-relaxed">
              {lang === "ar" ? "اكتشف مزايا الحساب المتقدم" : "Discover the benefits of an upgraded account"}
            </p>
            <button
              onClick={() => setUpgradeOpen(true)}
              className="mt-3 w-full py-2 rounded-xl bg-[hsl(var(--dash-fg))] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {lang === "ar" ? "الترقية" : "Upgrade"}
            </button>
          </div>
        </div>
      )}

      {/* User footer */}
      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))] mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[hsl(var(--dash-fg))]">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{userName}</p>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{user.email}</p>
          </div>
        </div>
        {isSuperAdmin && (
          <button onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-xs text-[hsl(var(--dash-accent))] hover:underline w-full px-1 mt-3 font-semibold">
            <Shield className="w-3.5 h-3.5" /> Super Admin
          </button>
        )}
        <button onClick={handleSignOut}
          className="flex items-center gap-2 text-[13px] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors w-full px-1 mt-2 rounded-lg py-1.5 hover:bg-[hsl(var(--dash-muted))]">
          <LogOut className="w-4 h-4" /> {lang === "ar" ? "تسجيل الخروج" : "Log out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-theme min-h-screen flex bg-[hsl(var(--dash-bg))] overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-[250px] bg-[hsl(var(--dash-sidebar-bg))] fixed inset-y-0 z-40 ${
        isRtl ? "right-0 border-l" : "left-0 border-r"
      } border-[hsl(var(--dash-sidebar-border))]`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side={isRtl ? "right" : "left"}
          className="w-[280px] max-w-[85vw] p-0 border-[hsl(var(--dash-sidebar-border))] bg-[hsl(var(--dash-sidebar-bg))] lg:hidden [&>button]:text-[hsl(var(--dash-muted-fg))]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={`flex-1 ${isRtl ? "lg:mr-[250px]" : "lg:ml-[250px]"} flex flex-col min-h-screen min-w-0 overflow-x-hidden`}>
        {/* Top bar — Influency style */}
        <header className="sticky top-0 z-30 h-16 bg-[hsl(var(--dash-card))] border-b border-[hsl(var(--dash-border))] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-2 rounded-xl hover:bg-[hsl(var(--dash-muted))] transition-colors"
            aria-label="Toggle menu">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Search icon */}
            <button className="w-10 h-10 rounded-full border border-[hsl(var(--dash-border))] flex items-center justify-center text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            {/* Phone icon */}
            <button className="w-10 h-10 rounded-full border border-[hsl(var(--dash-border))] flex items-center justify-center text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            {/* Bell */}
            <button className="w-10 h-10 rounded-full border border-[hsl(var(--dash-border))] flex items-center justify-center text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>

            {/* Lang toggle */}
            <div className="flex items-center gap-0.5 bg-[hsl(var(--dash-muted))] rounded-full p-0.5 ms-1">
              {langs.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1.5 rounded-full text-xs transition-all ${
                    lang === l.code ? "bg-white shadow-sm" : "opacity-50 hover:opacity-80"
                  }`}>
                  {l.flag}
                </button>
              ))}
            </div>

            {/* User avatar + name */}
            <div className="hidden sm:flex items-center gap-2.5 ms-2 ps-3 border-s border-[hsl(var(--dash-border))]">
              <div className="w-9 h-9 rounded-full bg-[hsl(var(--dash-fg))] flex items-center justify-center text-xs font-bold text-white">
                {userInitials}
              </div>
              <div className="text-end">
                <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] leading-tight">
                  {lang === "ar" ? "مرحباً" : "Welcome back"}
                </p>
                <p className="text-sm font-semibold text-[hsl(var(--dash-fg))] leading-tight">{userName}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {isApproved && !sidebarOpen && !shouldHideFloatingChat && <AvatarChat />}
      <UpgradeToProDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} onUpgradeRequested={() => window.location.reload()} />
    </div>
  );
};

export default DashboardLayout;
