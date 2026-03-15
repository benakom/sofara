import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Legal from "./pages/Legal";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Academy from "./pages/dashboard/Academy";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAmbassadors from "./pages/admin/AdminAmbassadors";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCourses from "./pages/admin/AdminCourses";
import Pipeline from "./pages/dashboard/Pipeline";
import ImportLeads from "./pages/dashboard/ImportLeads";
import Commissions from "./pages/dashboard/Commissions";
import Payments from "./pages/dashboard/Payments";
import KycAml from "./pages/dashboard/KycAml";
import SofarAI from "./pages/dashboard/SofarAI";
import AIHub from "./pages/dashboard/AIHub";
import BonusRewards from "./pages/dashboard/BonusRewards";
import Community from "./pages/dashboard/Community";
import Simulator from "./pages/dashboard/Simulator";
import CalendarPage from "./pages/dashboard/Calendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/legal/:section" element={<Legal />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="academy" element={<Academy />} />
                <Route path="pipeline" element={<Pipeline />} />
                <Route path="import-leads" element={<ImportLeads />} />
                <Route path="commissions" element={<Commissions />} />
                <Route path="payments" element={<Payments />} />
                <Route path="kyc" element={<KycAml />} />
                <Route path="sofar-ai" element={<SofarAI />} />
                <Route path="ai-hub" element={<AIHub />} />
                <Route path="simulator" element={<Simulator />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="bonus" element={<BonusRewards />} />
                <Route path="community" element={<Community />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="ambassadors" element={<AdminAmbassadors />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="courses" element={<AdminCourses />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
