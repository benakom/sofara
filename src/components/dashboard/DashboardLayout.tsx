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
  Menu, Loader2, Calculator, Shield, CalendarDays,
  Sparkles, BookOpen, Users, Mail, Phone
} from "lucide-react";
import UpgradeToProDialog from "./UpgradeToProDialog";

type NavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  labelAr: string;
  labelEn: string;
  exact?: boolean;
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
  { path: "/dashboard/referrals", icon: Users, labelAr: "إحالاتي", labelEn: "Referrals" },
  { path: "/dashboard/bonus", icon: Trophy, labelAr: "المكافآت", labelEn: "Bonus" },
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
        <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-accent))]" />
      </div>
    );
  }
  if (!user) return null;

  const shouldHideFloatingChat = location.pathname.startsWith("/dashboard/ai-hub");
  const isActive = (path: string, exact?: boolean) => exact ? location.pathname === path : location.pathname.startsWith(path);
  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const userName = user.email?.split("@")[0] || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const isRtl = lang === "ar";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      {/* Logo */}
      <div className="px-5 pt-7 pb-5">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[hsl(var(--dash-dark))] flex items-center justify-center">
            <span className="text-[hsl(var(--dash-lime))] font-black text-base">S</span>
          </div>
          <span className="font-display text-lg font-extrabold text-[hsl(var(--dash-fg))] tracking-tight">sofara</span>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <button key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-[hsl(var(--dash-lime))] text-[hsl(var(--dash-lime-fg))] font-bold"
                    : "text-[hsl(var(--dash-sidebar-fg))] hover:bg-[hsl(var(--dash-sidebar-hover))] font-medium"
                }`}>
                <item.icon className={`w-[18px] h-[18px] shrink-0`} />
                <span className="flex-1 text-start">{lang === "ar" ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Upgrade */}
      {profileType !== "pro" && (
        <div className="px-3 pb-3">
          <button onClick={() => setUpgradeOpen(true)}
            className="w-full rounded-2xl bg-[hsl(var(--dash-lime))] p-4 text-start transition-all hover:shadow-lg">
            <p className="text-sm font-bold text-[hsl(var(--dash-lime-fg))]">Upgrade to Pro</p>
            <p className="text-[11px] text-[hsl(var(--dash-lime-fg)/.6)] mt-0.5">
              {lang === "ar" ? "أدوات متقدمة" : "Unlock advanced tools"}
            </p>
          </button>
        </div>
      )}

      {/* User + logout */}
      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--dash-dark))] flex items-center justify-center text-xs font-bold text-[hsl(var(--dash-lime))]">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{userName}</p>
            <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] truncate">{user.email}</p>
          </div>
        </div>
        {isSuperAdmin && (
          <button onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-xs text-[hsl(var(--dash-lime))] font-bold w-full px-1 mb-1">
            <Shield className="w-3.5 h-3.5" /> Admin
          </button>
        )}
        <button onClick={handleSignOut}
          className="flex items-center gap-2 text-[12px] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] w-full px-1 py-1 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors">
          <LogOut className="w-3.5 h-3.5" /> {lang === "ar" ? "خروج" : "Log out"}
        </button>
      </div>
    </div>
  );

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
        <SheetContent side={isRtl ? "right" : "left"}
          className="w-[280px] max-w-[85vw] p-0 border-[hsl(var(--dash-sidebar-border))] bg-[hsl(var(--dash-sidebar-bg))] lg:hidden [&>button]:text-[hsl(var(--dash-muted-fg))]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className={`flex-1 ${isRtl ? "lg:mr-[240px]" : "lg:ml-[240px]"} flex flex-col min-h-screen min-w-0 overflow-x-hidden`}>
        {/* Top bar — mobile only: hamburger + lang + icons */}
        <header className="sticky top-0 z-30 h-14 lg:h-0 lg:overflow-hidden bg-[hsl(var(--dash-card))] border-b border-[hsl(var(--dash-border))] lg:border-0 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[hsl(var(--dash-fg))] p-2 rounded-xl hover:bg-[hsl(var(--dash-muted))]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 lg:hidden">
            {langs.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded-lg text-xs transition-all ${
                  lang === l.code ? "bg-[hsl(var(--dash-dark))] text-white" : "text-[hsl(var(--dash-muted-fg))]"
                }`}>
                {l.flag}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-5 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {isApproved && !sidebarOpen && !shouldHideFloatingChat && <AvatarChat />}
      <UpgradeToProDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} onUpgradeRequested={() => window.location.reload()} />
    </div>
  );
};

export default DashboardLayout;
