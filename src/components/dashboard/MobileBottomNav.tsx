import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, GitBranch, DollarSign, CreditCard, Plus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/lib/dashboard-data";

const leftItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelEn: "Home", labelFr: "Accueil", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelEn: "Leads", labelFr: "Leads" },
];
const rightItems = [
  { path: "/dashboard/commissions", icon: DollarSign, labelEn: "Earnings", labelFr: "Revenus" },
  { path: "/dashboard/payments", icon: CreditCard, labelEn: "Payments", labelFr: "Paiements" },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const isActive = (path: string, exact?: boolean) => (exact ? location.pathname === path : location.pathname.startsWith(path));

  const NavButton = ({ item }: { item: (typeof leftItems)[0] }) => {
    const active = isActive(item.path, item.exact);
    return (
      <button onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${active ? "text-[hsl(var(--dash-accent))]" : "text-white/40 active:text-white/70"}`}>
        <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
        <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>{fr(lang) ? item.labelFr : item.labelEn}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[hsl(var(--dash-sidebar-bg)/.92)] backdrop-blur-xl border-t border-white/[0.08]">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {leftItems.map((item) => <NavButton key={item.path} item={item} />)}
        <div className="flex-1 flex items-center justify-center -mt-6">
          <button onClick={() => navigate("/dashboard/import-leads")} aria-label={fr(lang) ? "Nouveau lead" : "New lead"} className="w-14 h-14 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center shadow-[var(--dash-accent-glow)] ring-4 ring-[hsl(var(--dash-bg))] active:scale-95 transition-transform">
            <Plus className="w-7 h-7 text-black" strokeWidth={3} />
          </button>
        </div>
        {rightItems.map((item) => <NavButton key={item.path} item={item} />)}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
