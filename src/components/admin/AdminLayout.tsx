import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Users, GitBranch, DollarSign,
  CreditCard, LogOut, Menu, Crown, Loader2,
  ChevronRight, X, Settings, Bell
} from "lucide-react";

const navSections = [
  {
    title: "BUSINESS",
    items: [
      { path: "/admin", icon: BarChart3, label: "Dashboard", exact: true },
      { path: "/admin/ambassadors", icon: Users, label: "Ambassadeurs" },
      { path: "/admin/pipeline", icon: GitBranch, label: "Pipeline" },
    ],
  },
  {
    title: "FINANCIER",
    items: [
      { path: "/admin/commissions", icon: DollarSign, label: "Commissions" },
      { path: "/admin/payments", icon: CreditCard, label: "Paiements" },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      { path: "/admin/settings", icon: Settings, label: "Paramètres" },
    ],
  },
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
      <div className="min-h-screen bg-[hsl(228,20%,8%)] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
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
    <div className="flex flex-col h-full bg-[hsl(228,22%,10%)] border-r border-[hsl(228,18%,16%)]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(80,80%,40%)] flex items-center justify-center">
          <Crown className="w-4.5 h-4.5 text-[hsl(0,0%,5%)]" />
        </div>
        <div>
          <span className="font-display text-base font-bold text-white tracking-tight block leading-tight">
            Sofara
          </span>
          <span className="text-[10px] font-semibold text-[hsl(var(--primary))] uppercase tracking-widest">
            Business Owner
          </span>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto pt-2">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-[hsl(228,10%,45%)] uppercase tracking-[0.15em]">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                      active
                        ? "bg-[hsl(var(--primary)/.1)] text-white"
                        : "text-[hsl(228,10%,55%)] hover:text-white hover:bg-[hsl(228,18%,14%)]"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--primary))]" : "group-hover:text-[hsl(228,10%,70%)]"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--primary)/.5)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[hsl(228,18%,14%)] mt-auto space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(80,80%,40%)] flex items-center justify-center text-[11px] font-bold text-[hsl(0,0%,5%)]">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Sofara Admin</p>
            <p className="text-[10px] text-[hsl(228,10%,45%)] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-[hsl(228,10%,45%)] hover:text-white transition-colors w-full px-2 py-1.5 rounded-md hover:bg-[hsl(228,18%,14%)]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[hsl(228,18%,7%)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[260px] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 border-b border-[hsl(228,18%,12%)] bg-[hsl(228,18%,7%/.9)] backdrop-blur-xl flex items-center px-4 sm:px-6 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[hsl(228,10%,50%)] p-1.5 rounded-lg hover:bg-[hsl(228,18%,12%)] transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1" />
          
          <button className="relative text-[hsl(228,10%,50%)] p-2 rounded-lg hover:bg-[hsl(228,18%,12%)] transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--primary))] rounded-full" />
          </button>
          
          <span className="text-[10px] font-bold text-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] border border-[hsl(var(--primary)/.2)] px-2.5 py-1 rounded-md uppercase tracking-wider">
            Owner
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
