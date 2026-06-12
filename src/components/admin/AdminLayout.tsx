import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Target, DollarSign,
  Building2, Bot, BarChart3, GraduationCap,
  Settings, LogOut, Menu, X, Bell, Search, Loader2,
  UserCheck, MessageCircle, TrendingUp
} from "lucide-react";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { path: "/admin/applications", icon: UserCheck, label: "Applications" },
  { path: "/admin/ambassadors", icon: Users, label: "Ambassadors" },
  { path: "/admin/chatbot-leads", icon: MessageCircle, label: "Chatbot Leads" },
  { path: "/admin/leads", icon: Target, label: "Leads" },
  { path: "/admin/commissions", icon: DollarSign, label: "Commissions" },
  { path: "/admin/projects", icon: Building2, label: "Projects" },
  { path: "/admin/ai-config", icon: Bot, label: "AI Tools Config" },
  { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/admin/seo", icon: TrendingUp, label: "SEO" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isSuperAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) navigate("/auth");
      else if (!isSuperAdmin) navigate("/dashboard");
    }
  }, [user, isSuperAdmin, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#154B3B]" />
      </div>
    );
  }

  if (!user || !isSuperAdmin) return null;

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const pageTitle = navItems.find(item =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  )?.label || "Admin";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#154B3B]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#D2F34C] flex items-center justify-center font-bold text-[#154B3B] text-sm">
          S
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight block leading-tight font-['Poppins']">
            Sofara
          </span>
          <span className="text-[10px] font-bold text-[#D2F34C] uppercase tracking-[0.2em]">
            ADMIN
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative ${
                active
                  ? "bg-[#1B5E4A] text-[#D2F34C]"
                  : "text-[#9CC5B5] hover:bg-[#1B5E4A] hover:text-white"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#D2F34C] rounded-r-full" />
              )}
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1B5E4A] mt-auto">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D2F34C] to-[#BDE040] flex items-center justify-center text-xs font-bold text-[#154B3B]">
            AB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Ahmed Benjas</p>
            <p className="text-[11px] text-[#D2F34C] font-medium">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-[#9CC5B5] hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-[#1B5E4A]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F5F5F7]">
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[260px] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-4 text-[#9CC5B5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-[#E5E7EB] bg-white flex items-center px-4 sm:px-6 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#6B7280] p-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-bold text-[#154B3B] font-['Poppins'] hidden sm:block">{pageTitle}</h1>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 h-9 pl-9 pr-3 rounded-lg bg-[#F5F5F7] border-none text-sm text-[#154B3B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50 font-['Poppins']"
            />
          </div>

          {/* Notification */}
          <button className="relative text-[#6B7280] p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D2F34C] rounded-full border-2 border-white" />
          </button>

          {/* Admin avatar */}
          <div className="w-8 h-8 rounded-full bg-[#154B3B] flex items-center justify-center text-[10px] font-bold text-[#D2F34C]">
            AB
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
