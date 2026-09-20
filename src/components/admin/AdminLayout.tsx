import { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard, Users, Target, DollarSign, Building2, Bot, BarChart3, Settings, LogOut, Menu, Bell, Loader2,
  MessageCircle, TrendingUp, Mail, GitBranch, CreditCard, ChevronRight, ExternalLink, Shield, type LucideIcon,
} from "lucide-react";
import { initials } from "@/lib/dashboard-data";
import NotificationsBell from "@/components/dashboard/NotificationsBell";

type NavItem = { path: string; icon: LucideIcon; label: string; exact?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { label: "Overview", items: [{ path: "/admin", icon: LayoutDashboard, label: "Command center", exact: true }] },
  { label: "Growth", items: [
    { path: "/admin/ambassadors", icon: Users, label: "Ambassadors" },
    { path: "/admin/chatbot-leads", icon: MessageCircle, label: "Chatbot leads" },
    { path: "/admin/newsletters", icon: Mail, label: "Newsletters" },
  ] },
  { label: "Sales", items: [
    { path: "/admin/leads", icon: Target, label: "Leads" },
    { path: "/admin/pipeline", icon: GitBranch, label: "Pipeline" },
    { path: "/admin/commissions", icon: DollarSign, label: "Commissions" },
    { path: "/admin/payments", icon: CreditCard, label: "Payments" },
  ] },
  { label: "Product", items: [
    { path: "/admin/projects", icon: Building2, label: "Projects" },
    { path: "/admin/ai-config", icon: Bot, label: "AI tools" },
  ] },
  { label: "Insights", items: [
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/admin/seo", icon: TrendingUp, label: "SEO" },
  ] },
  { label: "System", items: [{ path: "/admin/settings", icon: Settings, label: "Settings" }] },
];
const ALL = NAV.flatMap((g) => g.items);

const AdminLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isSuperAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) navigate("/auth");
      else if (!isSuperAdmin) navigate("/dashboard");
    }
  }, [user, isSuperAdmin, authLoading, adminLoading, navigate]);
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const isActive = (path: string, exact?: boolean) => (exact ? location.pathname === path : location.pathname.startsWith(path));
  const current = useMemo(() => ALL.find((i) => isActive(i.path, i.exact)) ?? ALL[0], [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading || adminLoading) {
    return (
      <div className="dash-theme min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-accent-ink))]" />
      </div>
    );
  }
  if (!user || !isSuperAdmin) return null;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName = (typeof meta.full_name === "string" && meta.full_name) || user.email?.split("@")[0] || "Admin";
  const [fn, ln] = fullName.split(" ");
  const avatar = initials(fn, ln);
  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      {/* Workspace */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.08]">
        <a href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[hsl(var(--dash-accent))] text-black font-display font-black text-sm flex items-center justify-center">s</span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold text-white tracking-tight">sofara</span>
            <span className="block text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--dash-accent))] font-semibold">Super Admin</span>
          </span>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-hidden">
        {NAV.map((group) => (
          <div key={group.label} className="mb-2 [@media(max-height:820px)]:mb-1">
            <p className="px-3 mb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 [@media(max-height:820px)]:hidden">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`relative w-full flex items-center gap-2.5 px-3 py-[5px] rounded-lg text-[13px] transition-colors ${
                      active ? "bg-white/[0.08] text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/[0.05] font-medium"
                    }`}
                  >
                    {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[hsl(var(--dash-accent))]" />}
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--dash-accent))]" : ""}`} strokeWidth={active ? 2.25 : 2} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--dash-accent))] text-black text-[11px] font-bold flex items-center justify-center shrink-0">{avatar}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white truncate">{fullName}</p>
            <p className="text-[11px] text-[hsl(var(--dash-accent))] truncate inline-flex items-center gap-1"><Shield className="w-3 h-3" /> Super admin</p>
          </div>
          <button onClick={() => navigate("/dashboard")} title="Ambassador space" className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={handleSignOut} title="Sign out" className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dash-theme min-h-screen flex bg-[hsl(var(--dash-bg))] text-[hsl(var(--dash-fg))] overflow-x-hidden">
      <aside className="hidden lg:flex flex-col w-[248px] fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0 border-white/[0.08] bg-[hsl(var(--dash-sidebar-bg))] lg:hidden [&>button]:text-white/60">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 lg:ml-[248px] flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-30 h-14 border-b border-[hsl(var(--dash-topbar-border))] bg-[hsl(var(--dash-topbar-bg)/.9)] backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-1.5 -ml-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))]" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
            <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
              <span className="text-[hsl(var(--dash-muted-fg))] hidden sm:inline">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--dash-border))] hidden sm:inline" />
              <span className="font-semibold text-[hsl(var(--dash-fg))] truncate">{current.label}</span>
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <a href="https://www.sofara.io" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--dash-card))] hover:bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] px-3 py-1.5 text-[12px] font-semibold text-[hsl(var(--dash-fg))] transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> sofara.io
            </a>
            <NotificationsBell lang="en" variant="admin" />
            <div className="hidden sm:flex w-8 h-8 ml-1 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-fg))] text-[11px] font-bold items-center justify-center">{avatar}</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1320px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
