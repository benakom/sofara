import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUserTier } from "@/hooks/useUserTier";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard, GitBranch, Upload, DollarSign, CreditCard, ShieldCheck, LogOut, Menu, Bell,
  Loader2, Shield, Search, ChevronRight, Plus, Crown, Link2, HelpCircle, type LucideIcon,
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import { fr, initials } from "@/lib/dashboard-data";

type NavItem = { path: string; icon: LucideIcon; labelFr: string; labelEn: string; exact?: boolean };
type NavGroup = { labelFr: string; labelEn: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    labelFr: "Espace de travail", labelEn: "Workspace",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, labelFr: "Vue d'ensemble", labelEn: "Overview", exact: true },
      { path: "/dashboard/pipeline", icon: GitBranch, labelFr: "Suivi des leads", labelEn: "Lead tracking" },
      { path: "/dashboard/import-leads", icon: Upload, labelFr: "Soumettre un lead", labelEn: "Submit a lead" },
    ],
  },
  {
    labelFr: "Revenus", labelEn: "Earnings",
    items: [
      { path: "/dashboard/commissions", icon: DollarSign, labelFr: "Commissions", labelEn: "Commissions" },
      { path: "/dashboard/payments", icon: CreditCard, labelFr: "Paiements", labelEn: "Payments" },
    ],
  },
  {
    labelFr: "Compte", labelEn: "Account",
    items: [
      { path: "/dashboard/kyc", icon: ShieldCheck, labelFr: "Vérification KYC", labelEn: "KYC verification" },
      { path: "/dashboard/referrals", icon: Link2, labelFr: "Parrainage", labelEn: "Referrals" },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

const langs: { code: "en" | "ar"; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "FR" },
];

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isSuperAdmin } = useAdmin();
  const { loading: profileLoading, profile } = useProfileStatus();
  const { ambassadorTier } = useUserTier();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // ⌘K / Ctrl+K jumps to lead tracking (search lives there).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); navigate("/dashboard/pipeline?focus=search"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const isActive = (path: string, exact?: boolean) => (exact ? location.pathname === path : location.pathname.startsWith(path));
  const current = useMemo(() => ALL_ITEMS.find((i) => isActive(i.path, i.exact)) ?? ALL_ITEMS[0], [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || profileLoading) {
    return (
      <div className="dash-theme min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-accent))]" />
      </div>
    );
  }
  if (!user) return null;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName = (profile?.full_name as string | null) || (typeof meta.full_name === "string" ? meta.full_name : "") || user.email?.split("@")[0] || "";
  const [firstName, lastName] = fullName.split(" ");
  const avatar = initials(firstName, lastName);
  const isRtl = false;

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      {/* Workspace */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[hsl(var(--dash-accent))] text-black font-display font-black text-sm flex items-center justify-center">s</span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold text-white tracking-tight">sofara</span>
              <span className="block text-[10px] uppercase tracking-[0.14em] text-white/40">Ambassador</span>
            </span>
          </a>
          {ambassadorTier === "ambassador_plus" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[hsl(var(--dash-accent)/.15)] text-[hsl(var(--dash-accent))]">
              <Crown className="w-3 h-3" /> PLUS
            </span>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard/import-leads")}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-[13px] font-semibold py-2.5 hover:brightness-95 active:scale-[0.99] transition-all shadow-[var(--dash-accent-glow)]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> {fr(lang) ? "Nouveau lead" : "New lead"}
        </button>

        <button
          onClick={() => navigate("/dashboard/pipeline?focus=search")}
          className="mt-2 w-full flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-white/45 hover:border-white/20 hover:text-white/70 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">{fr(lang) ? "Rechercher un lead" : "Search leads"}</span>
          <kbd className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/40">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-3 overflow-hidden">
        {NAV.map((group) => (
          <div key={group.labelEn} className="mb-4">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">{fr(lang) ? group.labelFr : group.labelEn}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                      active
                        ? "bg-white/[0.07] text-white font-semibold"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04] font-medium"
                    }`}
                  >
                    {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[hsl(var(--dash-accent))]" />}
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--dash-accent))]" : ""}`} strokeWidth={active ? 2.25 : 2} />
                    <span className="truncate">{fr(lang) ? item.labelFr : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: user */}
      <div className="p-3 border-t border-white/[0.06]">
        {isSuperAdmin && (
          <button onClick={() => navigate("/admin")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[hsl(var(--dash-accent))] hover:bg-white/[0.04] transition-colors mb-1">
            <Shield className="w-4 h-4" /> Super Admin
          </button>
        )}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--dash-accent))] text-black text-[11px] font-bold flex items-center justify-center shrink-0">{avatar}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white truncate">{fullName}</p>
            <p className="text-[11px] text-white/40 truncate">{user.email}</p>
          </div>
          <button onClick={handleSignOut} title={fr(lang) ? "Se déconnecter" : "Sign out"} className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dash-theme min-h-screen flex bg-[hsl(var(--dash-bg))] overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
      <aside className="hidden lg:flex flex-col w-[248px] fixed inset-y-0 left-0 z-40 border-r border-[hsl(var(--dash-sidebar-border))]">
        <SidebarContent />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0 border-white/[0.08] bg-[hsl(var(--dash-sidebar-bg))] lg:hidden [&>button]:text-white/50">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 lg:ml-[248px] flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-[hsl(var(--dash-topbar-border))] bg-[hsl(var(--dash-topbar-bg)/.9)] backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setSidebarOpen((v) => !v)} className="lg:hidden text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-1.5 -ml-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))]" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
            <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
              <span className="text-[hsl(var(--dash-muted-fg))] hidden sm:inline">Sofara</span>
              <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--dash-border))] hidden sm:inline" />
              <span className="font-semibold text-[hsl(var(--dash-fg))] truncate">{fr(lang) ? current.labelFr : current.labelEn}</span>
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={() => navigate("/dashboard/import-leads")} className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--dash-card))] hover:bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] px-3 py-1.5 text-[12px] font-semibold text-[hsl(var(--dash-fg))] transition-colors">
              <Plus className="w-3.5 h-3.5" /> {fr(lang) ? "Lead" : "Lead"}
            </button>
            <div className="flex items-center rounded-lg bg-[hsl(var(--dash-muted))] p-0.5 ml-1">
              {langs.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${lang === l.code ? "bg-[hsl(var(--dash-card))] shadow-sm text-[hsl(var(--dash-fg))]" : "text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"}`}>
                  {l.label}
                </button>
              ))}
            </div>
            <button className="text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors" aria-label="Help">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="relative text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex w-8 h-8 ml-1 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-fg))] text-[11px] font-bold items-center justify-center">{avatar}</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">
          <div className="max-w-[1240px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
