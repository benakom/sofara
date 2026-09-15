import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import CookieConsent from "./components/CookieConsent";

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
const SofaraPro = lazy(() => import("./pages/dashboard/SofaraPro"));
const RequirePro = lazy(() => import("./components/dashboard/RequirePro"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAmbassadors = lazy(() => import("./pages/admin/AdminAmbassadors"));
const AdminAmbassadorDetail = lazy(() => import("./pages/admin/AdminAmbassadorDetail"));
const AdminPipeline = lazy(() => import("./pages/admin/AdminPipeline"));
const AdminCommissions = lazy(() => import("./pages/admin/AdminCommissions"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminAIConfig = lazy(() => import("./pages/admin/AdminAIConfig"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminChatbotLeads = lazy(() => import("./pages/admin/AdminChatbotLeads"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
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
const InvestDubaiRealEstate = lazy(() => import("./pages/InvestDubaiRealEstate"));
const BuyPropertyDubai = lazy(() => import("./pages/BuyPropertyDubai"));
const DubaiOffPlanProperties = lazy(() => import("./pages/DubaiOffPlanProperties"));
const AmbassadorProgram = lazy(() => import("./pages/AmbassadorProgram"));
const About = lazy(() => import("./pages/About"));

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
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CookieConsent />
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/legal/:section" element={<Legal />} />
                <Route path="/invest-dubai-real-estate" element={<InvestDubaiRealEstate />} />
                <Route path="/buy-property-dubai" element={<BuyPropertyDubai />} />
                <Route path="/dubai-off-plan-properties" element={<DubaiOffPlanProperties />} />
                <Route path="/ambassador-program" element={<AmbassadorProgram />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  
                  <Route path="pipeline" element={<Pipeline />} />
                  <Route path="import-leads" element={<ImportLeads />} />
                  <Route path="commissions" element={<Commissions />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="kyc" element={<KycAml />} />
                  <Route path="ai-hub" element={<RequirePro><AIHub /></RequirePro>} />
                  <Route path="simulator" element={<RequirePro><Simulator /></RequirePro>} />
                  <Route path="calendar" element={<RequirePro><CalendarPage /></RequirePro>} />
                  <Route path="legal-ai" element={<RequirePro><LegalAI /></RequirePro>} />
                  
                  <Route path="community" element={<RequirePro><Community /></RequirePro>} />
                  <Route path="library" element={<RequirePro><Library /></RequirePro>} />
                  <Route path="referrals" element={<Referrals />} />
                  <Route path="pro" element={<SofaraPro />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="ambassadors" element={<AdminAmbassadors />} />
                  <Route path="ambassadors/:id" element={<AdminAmbassadorDetail />} />
                  <Route path="applications" element={<AdminApplications />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="chatbot-leads" element={<AdminChatbotLeads />} />
                  <Route path="pipeline" element={<AdminPipeline />} />
                  <Route path="commissions" element={<AdminCommissions />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="ai-config" element={<AdminAIConfig />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="seo" element={<AdminSEO />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
