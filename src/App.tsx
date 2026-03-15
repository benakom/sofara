import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";

// Lazy load all non-landing pages
const Legal = lazy(() => import("./pages/Legal"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const Academy = lazy(() => import("./pages/dashboard/Academy"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAmbassadors = lazy(() => import("./pages/admin/AdminAmbassadors"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const Pipeline = lazy(() => import("./pages/dashboard/Pipeline"));
const ImportLeads = lazy(() => import("./pages/dashboard/ImportLeads"));
const Commissions = lazy(() => import("./pages/dashboard/Commissions"));
const Payments = lazy(() => import("./pages/dashboard/Payments"));
const KycAml = lazy(() => import("./pages/dashboard/KycAml"));
const AIHub = lazy(() => import("./pages/dashboard/AIHub"));
const BonusRewards = lazy(() => import("./pages/dashboard/BonusRewards"));
const Community = lazy(() => import("./pages/dashboard/Community"));
const Simulator = lazy(() => import("./pages/dashboard/Simulator"));
const CalendarPage = lazy(() => import("./pages/dashboard/Calendar"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
