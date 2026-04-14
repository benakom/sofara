import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Loader2, CheckCircle2, Sparkles, TrendingUp, Users, Globe, ShieldCheck, Mail, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authHero from "@/assets/auth-hero.jpg";

const PHONE_CODES = [
  { code: "+971", flag: "🇦🇪", name: "UAE", digits: 9 },
  { code: "+33", flag: "🇫🇷", name: "France", digits: 9 },
  { code: "+44", flag: "🇬🇧", name: "UK", digits: 10 },
  { code: "+1", flag: "🇺🇸", name: "USA", digits: 10 },
  { code: "+212", flag: "🇲🇦", name: "Maroc", digits: 9 },
  { code: "+216", flag: "🇹🇳", name: "Tunisie", digits: 8 },
  { code: "+213", flag: "🇩🇿", name: "Algérie", digits: 9 },
  { code: "+966", flag: "🇸🇦", name: "Arabie S.", digits: 9 },
  { code: "+961", flag: "🇱🇧", name: "Liban", digits: 8 },
  { code: "+41", flag: "🇨🇭", name: "Suisse", digits: 9 },
  { code: "+32", flag: "🇧🇪", name: "Belgique", digits: 9 },
  { code: "+49", flag: "🇩🇪", name: "Allemagne", digits: 11 },
  { code: "+39", flag: "🇮🇹", name: "Italie", digits: 10 },
  { code: "+34", flag: "🇪🇸", name: "Espagne", digits: 9 },
  { code: "+351", flag: "🇵🇹", name: "Portugal", digits: 9 },
  { code: "+31", flag: "🇳🇱", name: "Pays-Bas", digits: 9 },
  { code: "+91", flag: "🇮🇳", name: "Inde", digits: 10 },
  { code: "+86", flag: "🇨🇳", name: "Chine", digits: 11 },
  { code: "+7", flag: "🇷🇺", name: "Russie", digits: 10 },
  { code: "+55", flag: "🇧🇷", name: "Brésil", digits: 11 },
  { code: "+234", flag: "🇳🇬", name: "Nigeria", digits: 10 },
  { code: "+27", flag: "🇿🇦", name: "Afr. du Sud", digits: 9 },
  { code: "+254", flag: "🇰🇪", name: "Kenya", digits: 9 },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Iv.", digits: 10 },
  { code: "+221", flag: "🇸🇳", name: "Sénégal", digits: 9 },
  { code: "+237", flag: "🇨🇲", name: "Cameroun", digits: 9 },
  { code: "+974", flag: "🇶🇦", name: "Qatar", digits: 8 },
  { code: "+965", flag: "🇰🇼", name: "Koweït", digits: 8 },
  { code: "+973", flag: "🇧🇭", name: "Bahreïn", digits: 8 },
  { code: "+968", flag: "🇴🇲", name: "Oman", digits: 8 },
  { code: "+20", flag: "🇪🇬", name: "Égypte", digits: 10 },
  { code: "+962", flag: "🇯🇴", name: "Jordanie", digits: 9 },
  { code: "+90", flag: "🇹🇷", name: "Turquie", digits: 10 },
  { code: "+1", flag: "🇨🇦", name: "Canada", digits: 10 },
];

const OCCUPATIONS = [
  { value: "real_estate_agent", labelAr: "Agent immobilier", labelEn: "Real Estate Agent" },
  { value: "influencer", labelAr: "Influenceur / Créateur de contenu", labelEn: "Influencer / Content Creator" },
  { value: "entrepreneur", labelAr: "Entrepreneur", labelEn: "Entrepreneur" },
  { value: "investor", labelAr: "Investisseur", labelEn: "Investor" },
  { value: "networker", labelAr: "Networker / Communauté", labelEn: "Networker / Community" },
  { value: "finance", labelAr: "Finance / Banque", labelEn: "Finance / Banking" },
  { value: "consultant", labelAr: "Consultant", labelEn: "Consultant" },
  { value: "other", labelAr: "Autre", labelEn: "Other" },
];

const Auth = () => {
  const { lang } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [signupComplete, setSignupComplete] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpValue, setOtpValue] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Signup-specific fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const selectedPhoneEntry = PHONE_CODES.find(c => c.code === phoneCode);

  const validatePhone = (value: string, code: string) => {
    const digits = value.replace(/\D/g, "");
    const entry = PHONE_CODES.find(c => c.code === code);
    if (!entry) return "";
    if (digits.length > 0 && digits.length !== entry.digits) {
      return lang === "ar"
        ? `${entry.digits} chiffres requis pour ${entry.name}`
        : `${entry.digits} digits required for ${entry.name}`;
    }
    return "";
  };

  useEffect(() => {
    if (!authLoading && user) {
      // Check if superadmin → redirect to admin panel
      const checkAdmin = async () => {
        const { data } = await supabase.rpc("is_superadmin");
        navigate(data ? "/admin" : "/dashboard");
      };
      checkAdmin();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) localStorage.setItem("sofara_ref", ref);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      const isEmailNotConfirmed = /email not confirmed|email.*confirm/i.test(error.message);
      toast({
        variant: "destructive",
        title: isEmailNotConfirmed
          ? (lang === "ar" ? "Email non vérifié" : "Email not verified")
          : (lang === "ar" ? "خطأ في تسجيل الدخول" : "Login error"),
        description: isEmailNotConfirmed
          ? (lang === "ar"
              ? "Vérifiez votre email puis reconnectez-vous."
              : "Please verify your email and try again.")
          : error.message,
      });
    } else {
      // Check if superadmin → redirect to admin panel
      const { data } = await supabase.rpc("is_superadmin");
      navigate(data ? "/admin" : "/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const pErr = validatePhone(digits, phoneCode);
    if (pErr) {
      setPhoneError(pErr);
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !occupation) {
      toast({ variant: "destructive", title: lang === "ar" ? "Champs requis" : "Required fields", description: lang === "ar" ? "Veuillez remplir tous les champs." : "Please fill all fields." });
      return;
    }
    setLoading(true);
    const refCode = localStorage.getItem("sofara_ref");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          phone: `${phoneCode}${digits}`,
          occupation,
          ...(refCode ? { ref_code: refCode } : {}),
        },
      },
    });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: lang === "ar" ? "خطأ في التسجيل" : "Signup error", description: error.message });
    } else {
      localStorage.removeItem("sofara_ref");
      setSignupEmail(email);
      setSignupComplete(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setOtpVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email: signupEmail,
      token: otpValue,
      type: "signup",
    });
    setOtpVerifying(false);
    if (error) {
      toast({
        variant: "destructive",
        title: lang === "ar" ? "Code invalide" : "Invalid code",
        description: lang === "ar" ? "Vérifiez le code et réessayez." : "Check the code and try again.",
      });
      setOtpValue("");
    } else {
      toast({
        title: lang === "ar" ? "Compte vérifié !" : "Account verified!",
        description: lang === "ar" ? "Bienvenue chez Sofara." : "Welcome to Sofara.",
      });
      const { data: isAdmin } = await supabase.rpc("is_superadmin");
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: lang === "ar" ? "Email envoyé" : "Email sent", description: lang === "ar" ? "Vérifiez votre boîte mail pour réinitialiser votre mot de passe." : "Check your inbox to reset your password." });
    }
  };

  const labels = {
    login: {
      title: lang === "ar" ? "تسجيل الدخول" : "Sign In",
      subtitle: lang === "ar" ? "Accédez à votre espace ambassadeur" : "Access your ambassador dashboard",
      button: lang === "ar" ? "تسجيل الدخول" : "Sign In",
      switch: lang === "ar" ? "ليس لديك حساب؟" : "No account yet?",
      switchAction: lang === "ar" ? "إنشاء حساب" : "Create account",
    },
    signup: {
      title: lang === "ar" ? "إنشاء حساب" : "Create Account",
      subtitle: lang === "ar" ? "Rejoignez le réseau ambassadeur #1" : "Join the #1 ambassador network",
      button: lang === "ar" ? "S'inscrire" : "Sign Up",
      switch: lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?",
      switchAction: lang === "ar" ? "تسجيل الدخول" : "Sign In",
    },
    forgot: {
      title: lang === "ar" ? "Mot de passe oublié" : "Forgot Password",
      subtitle: lang === "ar" ? "Entrez votre email pour réinitialiser" : "Enter your email to reset",
      button: lang === "ar" ? "Envoyer le lien" : "Send reset link",
      switch: lang === "ar" ? "Retour à la" : "Back to",
      switchAction: lang === "ar" ? "connexion" : "sign in",
    },
  };

  const l = labels[mode];
  const onSubmit = mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot;

  const metrics = [
    { icon: TrendingUp, value: "3%", label: lang === "ar" ? "Commission par vente" : "Commission per sale" },
    { icon: Users, value: "60+", label: lang === "ar" ? "Ambassadeurs actifs" : "Active ambassadors" },
    { icon: Globe, value: "12", label: lang === "ar" ? "Pays représentés" : "Countries represented" },
  ];

  const trustPoints = lang === "ar"
    ? [
        "Processus 100% propulsé par l'IA",
        "Commission moyenne : AED 37 000+ par deal",
        "Transparence totale — suivi en temps réel",
        "Formation & accompagnement premium",
        "Aucune licence immobilière requise",
      ]
    : [
        "Full AI powered process",
        "Average commission: AED 37,000+ per deal",
        "Full transparency — real-time tracking",
        "Premium training & dedicated support",
        "No real estate license required",
      ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // ─── OTP Verification Screen ───
  if (signupComplete) {
    const handleResend = async () => {
      setLoading(true);
      const { error } = await supabase.auth.resend({ type: "signup", email: signupEmail });
      setLoading(false);
      if (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } else {
        toast({ title: lang === "ar" ? "Code renvoyé !" : "Code resent!", description: lang === "ar" ? "Vérifiez votre boîte mail." : "Check your inbox." });
      }
    };

    return (
      <div className="min-h-[100svh] bg-background flex flex-col lg:flex-row overflow-hidden">
        {/* Left panel */}
        <div className="relative lg:w-[55%] h-52 sm:h-64 lg:h-auto lg:min-h-[100svh] flex-shrink-0 overflow-hidden">
          <img src={authHero} alt="Dubai business networking" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/50 to-transparent lg:bg-gradient-to-r lg:from-[#0a0f0a]/80 lg:via-[#0a0f0a]/40 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a]/60 via-transparent to-[#0a0f0a]/90 lg:bg-gradient-to-t lg:from-[#0a0f0a]/70 lg:via-transparent lg:to-[#0a0f0a]/50" />
          <div className="absolute inset-0 flex items-end p-5 sm:p-8 lg:p-14">
            <a href="/" className="inline-block">
              <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight">sofara</span>
            </a>
          </div>
        </div>

        {/* Right panel — OTP */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 lg:px-12 py-10 lg:py-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm mx-auto text-center"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 sm:p-10 shadow-2xl">
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <Mail className="w-9 h-9 text-primary" />
              </motion.div>

              <h2 className="text-xl font-bold text-foreground mb-2">
                {lang === "ar" ? "Vérifiez votre email" : "Verify your email"}
              </h2>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                {lang === "ar"
                  ? "Un code de vérification a été envoyé à :"
                  : "A verification code has been sent to:"}
              </p>
              <p className="text-sm font-semibold text-primary mb-6 break-all">{signupEmail}</p>

              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                variant="hero"
                className="w-full rounded-xl py-5 text-sm font-semibold mb-4"
                onClick={handleVerifyOtp}
                disabled={otpVerifying || otpValue.length !== 6}
              >
                {otpVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === "ar" ? "Vérifier mon compte" : "Verify my account")}
              </Button>

              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "ar"
                    ? "Entrez le code à 6 chiffres reçu par email pour activer votre compte ambassadeur Sofara."
                    : "Enter the 6-digit code received by email to activate your Sofara ambassador account."}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-xl py-5 text-sm gap-2"
                  onClick={handleResend}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {lang === "ar" ? "Renvoyer le code" : "Resend code"}
                </Button>

                <button
                  onClick={() => { setSignupComplete(false); setMode("login"); setOtpValue(""); }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "← Retour à la connexion" : "← Back to sign in"}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {[
                lang === "ar" ? "Vérifiez vos spams si vous ne trouvez pas l'email" : "Check your spam folder if you can't find the email",
                lang === "ar" ? "Le code expire après 1h" : "The code expires after 1h",
              ].map((tip, i) => (
                <p key={i} className="text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-primary/50" />
                  {tip}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-background flex flex-col lg:flex-row overflow-hidden">
      <SEO
        title="Join Sofara — Become a Dubai Real Estate Ambassador | Earn 3% Commission"
        description="Sign up free to become a Dubai real estate ambassador. Earn 3% commission on every sale from Emaar, Damac, Sobha. No license needed. AI-powered platform."
        canonical="https://sofara.io/auth"
        noindex
      />
      {/* Left panel — Immersive hero */}
      <div className="relative lg:w-[55%] h-52 sm:h-64 lg:h-auto lg:min-h-[100svh] flex-shrink-0 overflow-hidden">
        <img
          src={authHero}
          alt="Dubai business networking event with Burj Khalifa skyline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/50 to-transparent lg:bg-gradient-to-r lg:from-[#0a0f0a]/80 lg:via-[#0a0f0a]/40 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a]/60 via-transparent to-[#0a0f0a]/90 lg:bg-gradient-to-t lg:from-[#0a0f0a]/70 lg:via-transparent lg:to-[#0a0f0a]/50" />

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-14 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <a href="/" className="inline-block mb-6 lg:mb-10">
              <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight">sofara</span>
            </a>

            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-[1.15] mb-2 lg:mb-4">
              {lang === "ar"
                ? "Le réseau ambassadeur immobilier #1 propulsé par l'IA"
                : "The #1 AI Real Estate Ambassadors Network"}
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-4 lg:mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs sm:text-sm font-semibold">Full AI powered process</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 lg:gap-4 mb-5 lg:mb-8">
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <m.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm lg:text-base font-bold text-white">{m.value}</div>
                    <div className="text-[10px] lg:text-xs text-white/60">{m.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <ul className="space-y-2 lg:space-y-2.5 hidden sm:block">
              {trustPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm lg:text-[15px] text-white/90 font-medium">{point}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="hidden lg:flex items-center gap-3 mt-8 pt-6 border-t border-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-primary/70 flex-shrink-0" />
              <span className="text-xs text-white/40">
                {lang === "ar"
                  ? "Basé à Dubai · RERA Compliant · Technologie propriétaire · Données temps réel"
                  : "Dubai HQ · RERA Compliant · Proprietary AI · Real-time analytics"}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right panel — Auth form */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 lg:px-12 py-6 sm:py-10 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`w-full ${mode === "signup" ? "max-w-md" : "max-w-sm"} mx-auto`}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 lg:mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "Retour à l'accueil" : "Back to home"}
          </a>

          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <span className="font-display text-3xl lg:hidden font-bold text-primary tracking-tight block mb-4">sofara</span>
              <h1 className="text-xl font-bold text-foreground">{l.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{l.subtitle}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm">{lang === "ar" ? "الاسم العائلي" : "Last Name"} <span className="text-destructive">*</span></Label>
                    <Input id="lastName" placeholder={lang === "ar" ? "Dupont" : "Smith"} value={lastName} onChange={(e) => setLastName(e.target.value)} required className="bg-background/50 h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm">{lang === "ar" ? "الاسم الأول" : "First Name"} <span className="text-destructive">*</span></Label>
                    <Input id="firstName" placeholder={lang === "ar" ? "Jean" : "John"} value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="bg-background/50 h-11 rounded-xl" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email {mode === "signup" && <span className="text-destructive">*</span>}</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/50 h-11 rounded-xl" />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">
                    {lang === "ar" ? "كلمة المرور" : "Password"} {mode === "signup" && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-background/50 h-11 rounded-xl pr-11" />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-sm">{lang === "ar" ? "الهاتف" : "Phone"} <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <Select value={phoneCode} onValueChange={(v) => { setPhoneCode(v); setPhoneError(""); }}>
                      <SelectTrigger className="bg-background/50 h-11 rounded-xl border-border/50 text-sm">
                        <SelectValue>
                          {selectedPhoneEntry && (
                            <span className="flex items-center gap-1.5">
                              <span>{selectedPhoneEntry.flag}</span>
                              <span className="text-muted-foreground">{selectedPhoneEntry.code}</span>
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-popover border-border">
                        {PHONE_CODES.map((c) => (
                          <SelectItem key={`${c.code}-${c.name}`} value={c.code} className="focus:bg-primary/10 focus:text-primary">
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span>{c.name}</span>
                              <span className="text-muted-foreground">{c.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input value={phone} onChange={(e) => { const v = e.target.value.replace(/[^\d\s]/g, ""); setPhone(v); setPhoneError(validatePhone(v, phoneCode)); }} placeholder={selectedPhoneEntry ? `${selectedPhoneEntry.digits} chiffres` : ""} className="bg-background/50 h-11 rounded-xl" required />
                  </div>
                  {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-sm">{lang === "ar" ? "Occupation" : "Occupation"} <span className="text-destructive">*</span></Label>
                  <Select value={occupation} onValueChange={setOccupation}>
                    <SelectTrigger className="bg-background/50 h-11 rounded-xl border-border/50 text-sm">
                      <SelectValue placeholder={lang === "ar" ? "Sélectionnez votre activité" : "Select your activity"} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {OCCUPATIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value} className="focus:bg-primary/10 focus:text-primary">
                          {lang === "ar" ? o.labelAr : o.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {mode === "login" && (
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </button>
              )}

              <Button type="submit" variant="hero" className="w-full rounded-xl py-5 text-sm font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : l.button}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-5">
              {l.switch}{" "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary hover:underline font-semibold">
                {l.switchAction}
              </button>
            </p>
          </div>

          <ul className="mt-4 space-y-2 sm:hidden">
            {trustPoints.map((point, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-2 mt-4 sm:hidden">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-semibold">Full AI powered process</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
