import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, GitBranch, DollarSign, CreditCard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const items = [
  { path: "/dashboard", icon: LayoutDashboard, labelEn: "Dashboard", labelAr: "لوحة التحكم", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelEn: "Pipeline", labelAr: "العملاء" },
  { path: "/dashboard/commissions", icon: DollarSign, labelEn: "Commissions", labelAr: "العمولات" },
  { path: "/dashboard/payments", icon: CreditCard, labelEn: "Payments", labelAr: "المدفوعات" },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#0d3a2b] border-t border-[#D3F34B]/15 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200 ${
                active
                  ? "text-[#D3F34B]"
                  : "text-white/40 active:text-white/60"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                active ? "bg-[#D3F34B]/15" : ""
              }`}>
                <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium leading-none ${
                active ? "font-semibold" : ""
              }`}>
                {lang === "ar" ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
