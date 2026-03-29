import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";

// Lazy load all non-landing pages
const Legal = lazy(() => import("./pages/Legal"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
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
const AdminLibrary = lazy(() => import("./pages/admin/AdminLibrary"));
const Pipeline = lazy(() => import("./pages/dashboard/Pipeline"));
const ImportLeads = lazy(() => import("./pages/dashboard/ImportLeads"));
const Commissions = lazy(() => import("./pages/dashboard/Commissions"));
const Payments = lazy(() => import("./pages/dashboard/Payments"));
const KycAml = lazy(() => import("./pages/dashboard/KycAml"));
const AIHub = lazy(() => import("./pages/dashboard/AIHub"));

const Community = lazy(() => import("./pages/dashboard/Community"));
const Simulator = lazy(() => import("./pages/dashboard/Simulator"));
const CalendarPage = lazy(() => import("./pages/dashboard/Calendar"));
const LegalAI = lazy(() => import("./pages/dashboard/LegalAI"));
const Library = lazy(() => import("./pages/dashboard/Library"));
const Referrals = lazy(() => import("./pages/dashboard/Referrals"));

const queryClient = new QueryClient();

const RouteLoading = () => {
  const { pathname } = useLocation();
  const isBackendRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isBackendRoute ? "dash-theme bg-[hsl(var(--dash-bg))]" : "bg-background"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full animate-spin border-2 border-t-transparent ${
          isBackendRoute ? "border-[hsl(var(--dash-accent))]" : "border-primary"
        }`}
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
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
                  <Route path="legal-ai" element={<LegalAI />} />
                  
                  <Route path="community" element={<Community />} />
                  <Route path="library" element={<Library />} />
                  <Route path="referrals" element={<Referrals />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="ambassadors" element={<AdminAmbassadors />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="library" element={<AdminLibrary />} />
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
