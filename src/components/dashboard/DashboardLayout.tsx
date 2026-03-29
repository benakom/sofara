import { useState, useEffect } from "react";
import AvatarChat from "@/components/sofar-ai/AvatarChat";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUserTier } from "@/hooks/useUserTier";
import {
  LayoutDashboard, GraduationCap, GitBranch, DollarSign,
  Sparkles, BookOpen, Menu, Bell, Search, Settings,
  Loader2, Shield, User, LogOut, ArrowUpCircle, Trophy,
  BarChart3, X, Calculator, CalendarDays, Upload,
  CreditCard, ShieldCheck, Users, MessageCircle, Crown
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
  { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelAr: "العملاء", labelEn: "Leads" },
  { path: "/dashboard/ai-hub", icon: Sparkles, labelAr: "أدوات الذكاء", labelEn: "AI Tools", badge: "PRO", tier: "pro" },
  { path: "/dashboard/library", icon: BookOpen, labelAr: "المشاريع", labelEn: "Projects", badge: "NEW", tier: "pro" },
  { path: "/dashboard/commissions", icon: DollarSign, labelAr: "العمولات", labelEn: "Commissions" },
  { path: "/dashboard/academy", icon: GraduationCap, labelAr: "الأكاديمية", labelEn: "Academy" },
];

// Additional nav items accessible from mobile menu / settings
const moreNavItems: NavItem[] = [
  { path: "/dashboard/import-leads", icon: Upload, labelAr: "استيراد العملاء", labelEn: "Import Leads" },
  { path: "/dashboard/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
  { path: "/dashboard/kyc", icon: ShieldCheck, labelAr: "KYC & AML", labelEn: "KYC & AML", tier: "pro" },
  { path: "/dashboard/simulator", icon: Calculator, labelAr: "المحاكي", labelEn: "Simulators", tier: "pro" },
  { path: "/dashboard/calendar", icon: CalendarDays, labelAr: "التقويم", labelEn: "Calendar", tier: "pro" },
  { path: "/dashboard/referrals", icon: Users, labelAr: "إحالاتي", labelEn: "My Referrals" },
  { path: "/dashboard/bonus", icon: Trophy, labelAr: "المكافآت والجوائز", labelEn: "Bonus & Rewards" },
  { path: "/dashboard/community", icon: MessageCircle, labelAr: "المجتمع", labelEn: "Community" },
];

// Bottom tab bar items (mobile)
const mobileTabItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelAr: "الرئيسية", labelEn: "Home", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelAr: "العملاء", labelEn: "Leads" },
  { path: "/dashboard/ai-hub", icon: Sparkles, labelAr: "الذكاء", labelEn: "AI", tier: "pro" as const },
  { path: "/dashboard/commissions", icon: DollarSign, labelAr: "العمولات", labelEn: "Earnings" },
  { path: "/dashboard/profile-menu", icon: User, labelAr: "الملف", labelEn: "Profile" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const liteAllowedPaths = [
    "/dashboard",
    "/dashboard/pipeline",
    "/dashboard/import-leads",
    "/dashboard/commissions",
    "/dashboard/payments",
    "/dashboard/referrals",
    "/dashboard/bonus",
  ];

  const filterNav = (items: NavItem[]) =>
    items.filter((item) => {
      if (item.tier === "pro" && profileType !== "pro") return false;
      if (profileType !== "pro" && !liteAllowedPaths.includes(item.path)) return false;
      return true;
    });

  const navItems = filterNav(allNavItems);
  const extraNavItems = filterNav(moreNavItems);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  if (loading || profileLoading) {
    return (
      <div className="dash-theme min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" />
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

  const userInitials = user.email?.substring(0, 2).toUpperCase() || "AB";
  const isRtl = lang === "ar";

  return (
    <div className="dash-theme min-h-screen flex flex-col bg-[hsl(var(--dash-bg))] overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* ===== TOP HORIZONTAL NAV BAR ===== */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-[hsl(var(--dash-border))] flex items-center px-4 lg:px-6" style={{ boxShadow: "var(--dash-nav-shadow)" }}>
        {/* Left: Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <a href="/" className="text-xl font-bold tracking-tight text-[hsl(var(--dash-fg))] flex items-center gap-1.5">
            <span className="text-2xl">✦</span>
            <span>sofara</span>
          </a>
          {profileType === "pro" && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]">PRO</span>
          )}
          {ambassadorTier === "ambassador_plus" && (
            <Crown className="w-3.5 h-3.5 text-[hsl(var(--dash-accent-fg))]" />
          )}
        </div>

        {/* Center: Horizontal tab menu (desktop only) */}
        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={active ? "dash-nav-pill-active" : "dash-nav-pill-inactive"}
              >
                {lang === "ar" ? item.labelAr : item.labelEn}
                {item.badge && (
                  <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {/* More menu for extra items */}
          {extraNavItems.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="dash-nav-pill-inactive flex items-center gap-1"
              >
                {lang === "ar" ? "المزيد" : "More"}
                <Menu className="w-3.5 h-3.5" />
              </button>
              {mobileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)} />
                  <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-xl border border-[hsl(var(--dash-border))] shadow-lg min-w-[200px] py-2">
                    {extraNavItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive(item.path)
                            ? "text-[hsl(var(--dash-fg))] font-semibold bg-[hsl(var(--dash-muted))]"
                            : "text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))]"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {lang === "ar" ? item.labelAr : item.labelEn}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Mobile: Hamburger */}
        <div className="flex-1 lg:hidden" />

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors">
            <Search className="w-4 h-4" />
          </button>

          {/* Language toggle */}
          <div className="hidden sm:flex items-center gap-0.5 bg-[hsl(var(--dash-muted))] rounded-full p-0.5 mx-1">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded-full text-sm transition-all ${
                  lang === l.code ? "bg-white shadow-sm" : "opacity-40 hover:opacity-70"
                }`}
              >
                {l.flag}
              </button>
            ))}
          </div>

          <button className="p-2 rounded-full text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--dash-accent))] rounded-full" />
          </button>

          <button className="hidden sm:flex p-2 rounded-full text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors">
            <Settings className="w-4 h-4" />
          </button>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-9 h-9 rounded-full bg-[hsl(var(--dash-dark))] text-white flex items-center justify-center text-xs font-bold ml-1 hover:ring-2 hover:ring-[hsl(var(--dash-accent))] transition-all"
            >
              {userInitials}
            </button>
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                <div className={`absolute top-full mt-2 z-50 bg-white rounded-xl border border-[hsl(var(--dash-border))] shadow-lg min-w-[220px] py-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <div className="px-4 py-3 border-b border-[hsl(var(--dash-border))]">
                    <p className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{user.email?.split("@")[0]}</p>
                    <p className="text-xs text-[hsl(var(--dash-muted-fg))] truncate">{user.email}</p>
                  </div>

                  {/* Language toggle (mobile) */}
                  <div className="sm:hidden flex items-center gap-1 px-4 py-2 border-b border-[hsl(var(--dash-border))]">
                    {langs.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          lang === l.code ? "bg-[hsl(var(--dash-muted))] font-semibold" : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        {l.flag}
                      </button>
                    ))}
                  </div>

                  {profileType !== "pro" && (
                    <button
                      onClick={() => { setUpgradeOpen(true); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors"
                    >
                      <ArrowUpCircle className="w-4 h-4 text-[hsl(var(--dash-accent-fg))]" />
                      {lang === "ar" ? "الترقية إلى Pro" : "Upgrade to Pro"}
                    </button>
                  )}

                  {isSuperAdmin && (
                    <button
                      onClick={() => { navigate("/admin"); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Super Admin
                    </button>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted))] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden max-w-[1440px] mx-auto w-full">
        <Outlet />
      </main>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[hsl(var(--dash-border))] flex items-center justify-around px-2" dir={isRtl ? "rtl" : "ltr"}>
        {mobileTabItems.map((item) => {
          // Handle profile-menu specially
          if (item.path === "/dashboard/profile-menu") {
            return (
              <button
                key={item.path}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[56px]"
              >
                <item.icon className="w-5 h-5 text-[hsl(var(--dash-muted-fg))]" />
                <span className="text-[10px] font-medium text-[hsl(var(--dash-muted-fg))]">
                  {lang === "ar" ? item.labelAr : item.labelEn}
                </span>
              </button>
            );
          }
          // Skip pro items for non-pro
          if (item.tier === "pro" && profileType !== "pro") {
            return (
              <button
                key={item.path}
                onClick={() => setUpgradeOpen(true)}
                className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[56px] opacity-40"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{lang === "ar" ? item.labelAr : item.labelEn}</span>
              </button>
            );
          }
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[56px]"
            >
              <item.icon className={`w-5 h-5 ${active ? "text-[hsl(var(--dash-accent-fg))]" : "text-[hsl(var(--dash-muted-fg))]"}`} style={active ? { color: "#D2F34C", filter: "drop-shadow(0 0 4px rgba(210,243,76,0.4))" } : {}} />
              <span className={`text-[10px] font-medium ${active ? "text-[hsl(var(--dash-fg))]" : "text-[hsl(var(--dash-muted-fg))]"}`}>
                {lang === "ar" ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>

      {/* SofarAI Avatar Chat */}
      {isApproved && !mobileMenuOpen && !shouldHideFloatingChat && <AvatarChat />}

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
