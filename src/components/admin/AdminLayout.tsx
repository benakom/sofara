import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GitBranch, DollarSign,
  CreditCard, LogOut, Menu, Shield, Loader2, BarChart3, GraduationCap, BookOpen
} from "lucide-react";

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
      <div className="dash-theme min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-accent))]" />
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
    <div className="flex flex-col h-full bg-[hsl(var(--dash-sidebar-bg))]">
      <div className="px-5 pt-6 pb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-[hsl(var(--dash-accent))]" />
        <span className="font-display text-xl font-bold text-[hsl(var(--dash-fg))] tracking-tight">
          sofara <span className="text-[hsl(var(--dash-accent))] text-sm font-semibold">ADMIN</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-[hsl(var(--dash-sidebar-active)/.12)] text-[hsl(var(--dash-fg))] border border-[hsl(var(--dash-sidebar-active)/.24)]"
                  : "text-[hsl(var(--dash-sidebar-fg))] hover:text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-sidebar-hover))]"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--dash-accent))]" : ""}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[hsl(var(--dash-sidebar-border))] mt-auto space-y-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors w-full px-1"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard ambassadeur
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          {lang === "fr" ? "Déconnexion" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-theme min-h-screen flex bg-[hsl(var(--dash-bg))]">
      <aside className="hidden lg:flex flex-col w-[240px] fixed inset-y-0 left-0 z-40 border-r border-[hsl(var(--dash-sidebar-border))]">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/15 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[240px] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-12 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.85)] backdrop-blur-xl flex items-center px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[hsl(var(--dash-muted-fg))] p-1 rounded-md hover:bg-[hsl(var(--dash-muted))] transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-xs font-semibold text-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.12)] border border-[hsl(var(--dash-accent)/.24)] px-2 py-1 rounded-md">
            SUPER ADMIN
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
