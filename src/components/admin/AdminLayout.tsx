import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  LayoutDashboard, Users, GitBranch, DollarSign,
  CreditCard, LogOut, Menu, Shield, Loader2, BarChart3, GraduationCap, BookOpen
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { path: "/admin", icon: BarChart3, label: "Vue d'ensemble", exact: true },
  { path: "/admin/ambassadors", icon: Users, label: "Ambassadeurs" },
  { path: "/admin/leads", icon: GitBranch, label: "Leads & Commissions" },
  { path: "/admin/payments", icon: CreditCard, label: "Paiements" },
  { path: "/admin/courses", icon: GraduationCap, label: "Academy" },
  { path: "/admin/library", icon: BookOpen, label: "Library" },
];

const AdminLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isSuperAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) navigate("/auth");
      else if (!isSuperAdmin) navigate("/dashboard");
    }
  }, [user, isSuperAdmin, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !isSuperAdmin) return null;

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface">
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-destructive" />
        <span className="text-[18px] font-semibold text-foreground tracking-[2px] uppercase">
          sofara <span className="text-destructive text-[10px] font-semibold tracking-normal normal-case ml-1">ADMIN</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <div className="section-label px-3 mb-1.5">Navigation</div>
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[12.5px] font-medium transition-colors ${
                active
                  ? "bg-accent-pale text-foreground border-l-2 border-accent -ml-[1px]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className={`w-[15px] h-[15px] shrink-0 ${active ? "text-accent" : ""}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto space-y-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors w-full px-1"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard ambassadeur
        </button>
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
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex flex-col w-[220px] fixed inset-y-0 left-0 z-40 border-r border-border bg-surface">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] p-0 border-border bg-surface lg:hidden"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 lg:ml-[220px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-11 border-b border-border bg-surface flex items-center px-4 sm:px-5">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground p-1">
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <span className="text-[10px] font-semibold text-destructive bg-status-red-bg px-2 py-1 rounded-pill border border-destructive/20">
            SUPER ADMIN
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
