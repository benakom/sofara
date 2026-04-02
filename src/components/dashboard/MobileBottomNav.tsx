import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, GitBranch, DollarSign, CreditCard, Plus, Upload, Users, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";

const leftItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelEn: "Home", labelAr: "الرئيسية", exact: true },
  { path: "/dashboard/pipeline", icon: GitBranch, labelEn: "Pipeline", labelAr: "العملاء" },
];

const rightItems = [
  { path: "/dashboard/commissions", icon: DollarSign, labelEn: "Earnings", labelAr: "العمولات" },
  { path: "/dashboard/payments", icon: CreditCard, labelEn: "Payments", labelAr: "المدفوعات" },
];

const quickActions = [
  { path: "/dashboard/import-leads", icon: Upload, labelEn: "Import Leads", labelAr: "استيراد العملاء" },
  { path: "/dashboard/referrals", icon: Users, labelEn: "Add Referral", labelAr: "إضافة إحالة" },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const NavButton = ({ item }: { item: typeof leftItems[0] }) => {
    const active = isActive(item.path, item.exact);
    return (
      <button
        onClick={() => { setOpen(false); navigate(item.path); }}
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
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick action buttons */}
      <AnimatePresence>
        {open && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-3 lg:hidden">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: i * 0.06, duration: 0.25, type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => { setOpen(false); navigate(action.path); }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D3F34B] flex items-center justify-center shadow-lg shadow-[#D3F34B]/30">
                  <action.icon className="w-6 h-6 text-[#0d3a2b]" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                  {lang === "ar" ? action.labelAr : action.labelEn}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#0d3a2b] border-t border-[#D3F34B]/15 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
          {leftItems.map((item) => <NavButton key={item.path} item={item} />)}

          {/* Center FAB */}
          <div className="flex-1 flex items-center justify-center -mt-5">
            <motion.button
              onClick={() => setOpen((v) => !v)}
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-14 h-14 rounded-full bg-[#D3F34B] flex items-center justify-center shadow-lg shadow-[#D3F34B]/40 active:scale-95 transition-transform"
            >
              <Plus className="w-7 h-7 text-[#0d3a2b]" strokeWidth={3} />
            </motion.button>
          </div>

          {rightItems.map((item) => <NavButton key={item.path} item={item} />)}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
