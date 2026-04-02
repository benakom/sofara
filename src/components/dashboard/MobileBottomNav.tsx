import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, GitBranch, DollarSign, CreditCard, Plus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const leftItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelEn: "Home", labelAr: "الرئيسية", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelEn: "Pipeline", labelAr: "العملاء" },
];

const rightItems = [
  { path: "/dashboard/commissions", icon: DollarSign, labelEn: "Earnings", labelAr: "العمولات" },
  { path: "/dashboard/payments", icon: CreditCard, labelEn: "Payments", labelAr: "المدفوعات" },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const NavButton = ({ item }: { item: typeof leftItems[0] }) => {
    const active = isActive(item.path, item.exact);
    return (
      <button
        onClick={() => navigate(item.path)}
        className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 ${
          active ? "text-[#D3F34B]" : "text-white/40 active:text-white/60"
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all duration-200 ${active ? "bg-[#D3F34B]/15" : ""}`}>
          <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
          {lang === "ar" ? item.labelAr : item.labelEn}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#0d3a2b] border-t border-[#D3F34B]/15 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {leftItems.map((item) => <NavButton key={item.path} item={item} />)}

        <div className="flex-1 flex items-center justify-center -mt-5">
          <button
            onClick={() => navigate("/dashboard/import-leads")}
            className="w-14 h-14 rounded-full bg-[#D3F34B] flex items-center justify-center shadow-lg shadow-[#D3F34B]/40 active:scale-95 transition-transform"
          >
            <Plus className="w-7 h-7 text-[#0d3a2b]" strokeWidth={3} />
          </button>
        </div>

        {rightItems.map((item) => <NavButton key={item.path} item={item} />)}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
