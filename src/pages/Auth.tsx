import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Loader2, CheckCircle2, Sparkles, TrendingUp, Users, Globe, ShieldCheck, Mail, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authHero from "@/assets/auth-hero.jpg";
import { track } from "@/lib/analytics";

// Supabase/Lovable issues 8-digit verification codes for this project; accept 6 to 8 to stay tolerant.
const OTP_LENGTH = 8;
const OTP_MIN_LENGTH = 6;

// Language of the emails the ambassador will receive (welcome journey, newsletters).
type EmailLang = "en" | "fr" | "es" | "ru" | "ar";
const EMAIL_LANG_OPTIONS: { value: EmailLang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
];
// URL locale (?lang= set by the sign-up CTAs: en | fr | es | ru | ar) -> default communication language.
const isEmailLang = (v: string | null): v is EmailLang => v === "en" || v === "fr" || v === "es" || v === "ru" || v === "ar";
const EMAIL_LANG_LABEL: Record<"en" | "fr", { label: string; hint: string }> = {
  en: { label: "Preferred language for our emails", hint: "Your welcome guide and tips will be sent in this language." },
  fr: { label: "Langue de communication préférée", hint: "Votre guide de bienvenue et nos conseils vous seront envoyés dans cette langue." },
};

const readParams = () => {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

const Auth = () => {
  const { lang, setLang } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // The sign-up CTAs pass ?mode=signup and the locale of the page the visitor came from (?lang=).
  // A referral link (?ref=) also opens the sign-up view.
  const [params] = useState(readParams);
  const urlLocale = params.get("lang");
  // This page is written in French or English only. "ar" is the app's legacy code for French.
  const isFr = urlLocale ? urlLocale === "fr" : lang === "ar" || lang === "fr";

  const initialMode = (): "login" | "signup" | "forgot" => {
    const m = params.get("mode");
    if (m === "signup" || m === "login" || m === "forgot") return m;
    return params.get("ref") ? "signup" : "login";
  };
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [signupComplete, setSignupComplete] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpValue, setOtpValue] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Sign-up keeps only what the account needs. Last name, phone and activity are asked
  // right after, in the profile completion card of the ambassador space.
  const [firstName, setFirstName] = useState("");
  // Emails default to the language of the page the visitor came from, else the language of this form.
  const [emailLang, setEmailLang] = useState<EmailLang>(() => (isEmailLang(urlLocale) ? urlLocale : isFr ? "fr" : "en"));

  // Keep the ambassador space in French after a French sign-up page.
  useEffect(() => {
    if (urlLocale === "fr" && lang !== "ar") setLang("ar");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const ref = params.get("ref");
    if (ref) localStorage.setItem("sofara_ref", ref);
  }, [params]);

  // GA4: the visitor sees the account-creation form.
  const startTracked = useRef(false);
  useEffect(() => {
    if (mode === "signup" && !signupComplete && !startTracked.current) {
      startTracked.current = true;
      track("signup_start", { source: params.get("source") || undefined, page_locale: urlLocale || undefined, referred: !!params.get("ref") });
    }
  }, [mode, signupComplete, params, urlLocale]);

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
          ? (isFr ? "Email non vérifié" : "Email not verified")
          : (isFr ? "Erreur de connexion" : "Login error"),
        description: isEmailNotConfirmed
          ? (isFr
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
    if (!firstName.trim()) {
      toast({ variant: "destructive", title: isFr ? "Champ requis" : "Required field", description: isFr ? "Indiquez votre prénom." : "Please enter your first name." });
      return;
    }
    if (password.length < 8) {
      toast({ variant: "destructive", title: isFr ? "Mot de passe trop court" : "Password too short", description: isFr ? "8 caractères minimum." : "At least 8 characters." });
      return;
    }
    setLoading(true);
    const refCode = localStorage.getItem("sofara_ref");
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          first_name: firstName.trim(),
          full_name: firstName.trim(),
          lang: emailLang === "fr" ? "fr" : emailLang === "en" ? "en" : isFr ? "fr" : "en",
          email_lang: emailLang,
          ...(refCode ? { ref_code: refCode } : {}),
        },
      },
    });
    setLoading(false);

    const existsTitle = isFr ? "Compte existant" : "Account already exists";
    const existsDesc = isFr ? "Un compte existe déjà avec cet email. Connectez-vous." : "An account already exists with this email. Please sign in.";

    if (error) {
      const exists = /already registered|already exists|already been registered/i.test(error.message);
      toast({
        variant: "destructive",
        title: exists ? existsTitle : (isFr ? "Erreur d'inscription" : "Signup error"),
        description: exists ? existsDesc : error.message,
      });
      if (exists) setMode("login");
      return;
    }

    // With email confirmation enabled, Supabase returns a user with no identities when the email is already taken.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      toast({ variant: "destructive", title: existsTitle, description: existsDesc });
      setMode("login");
      return;
    }

    localStorage.removeItem("sofara_ref");
    track("signup_complete", { method: "email", referred: !!refCode, email_lang: emailLang });

    if (data.session) {
      // Email confirmation is off: the ambassador space is live right away.
      toast({
        title: isFr ? "Bienvenue chez Sofara !" : "Welcome to Sofara!",
        description: isFr ? "Votre espace ambassadeur est prêt." : "Your ambassador space is ready.",
      });
      navigate("/dashboard");
      return;
    }

    setSignupEmail(cleanEmail);
    setSignupComplete(true);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length < OTP_MIN_LENGTH) return;
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
        title: isFr ? "Code invalide" : "Invalid code",
        description: /expired|invalid/i.test(error.message)
          ? (isFr ? "Code expiré ou déjà utilisé. Cliquez sur « Renvoyer un code » et utilisez le nouveau." : "Code expired or already used. Click \"Resend code\" and use the new one.")
          : error.message,
      });
      setOtpValue("");
    } else {
      toast({
        title: isFr ? "Compte vérifié !" : "Account verified!",
        description: isFr
          ? "Votre candidature est en cours de validation par notre équipe."
          : "Your application is now being reviewed by our team.",
      });
      // "Application under review" email (idempotent server side).
      supabase.functions.invoke("onboarding-emails", { body: { event: "verified", lang: emailLang } }).catch(() => {});
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
      toast({ title: isFr ? "Email envoyé" : "Email sent", description: isFr ? "Vérifiez votre boîte mail pour réinitialiser votre mot de passe." : "Check your inbox to reset your password." });
    }
  };




  const labels = {
    login: {
      title: isFr ? "Connexion" : "Sign In",
      subtitle: isFr ? "Accédez à votre espace ambassadeur" : "Access your ambassador dashboard",
      button: isFr ? "Se connecter" : "Sign In",
      switch: isFr ? "Pas encore de compte ?" : "No account yet?",
      switchAction: isFr ? "Créer un compte" : "Create account",
    },
    signup: {
      title: isFr ? "Créer mon compte ambassadeur" : "Create your ambassador account",
      subtitle: isFr ? "Votre espace est prêt en 30 secondes" : "Your space is ready in 30 seconds",
      button: isFr ? "Créer mon compte" : "Create my account",
      switch: isFr ? "Vous avez déjà un compte ?" : "Already have an account?",
      switchAction: isFr ? "Se connecter" : "Sign In",
    },
    forgot: {
      title: isFr ? "Mot de passe oublié" : "Forgot Password",
      subtitle: isFr ? "Entrez votre email pour réinitialiser" : "Enter your email to reset",
      button: isFr ? "Envoyer le lien" : "Send reset link",
      switch: isFr ? "Retour à la" : "Back to",
      switchAction: isFr ? "connexion" : "sign in",
    },
  };

  const l = labels[mode];
  const onSubmit = mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot;

  const metrics = [
    { icon: TrendingUp, value: isFr ? "Jusqu'à 3 %" : "Up to 3%", label: isFr ? "Commission par vente" : "Commission per sale" },
    { icon: Users, value: "700+", label: isFr ? "Ambassadeurs actifs" : "Active ambassadors" },
  ];

  const trustPoints = isFr
    ? [
        "Une équipe dédiée à Dubaï, du contact à la signature",
        "Jusqu'à 3 % de commission par vente",
        "Transparence totale — suivi en temps réel",
        "Formation & accompagnement premium",
        "Aucune licence immobilière requise",
      ]
    : [
        "Dedicated Dubai team from contact to signing",
        "Up to 3% commission per sale",
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

  // ─── Email Verification Screen ───
  if (signupComplete) {
    const handleResend = async () => {
      setLoading(true);
      const { error } = await supabase.auth.resend({ type: "signup", email: signupEmail, options: { emailRedirectTo: `${window.location.origin}/auth` } });
      setLoading(false);
      if (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } else {
        setOtpValue("");
        toast({ title: isFr ? "Nouveau code envoyé !" : "New code sent!", description: isFr ? "Utilisez le code du dernier email reçu." : "Use the code from the latest email." });
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

        {/* Right panel — Verification */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 lg:px-12 py-10 lg:py-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm mx-auto text-center"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 sm:p-10 shadow-2xl">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <Mail className="w-9 h-9 text-primary" />
              </motion.div>

              <h2 className="text-xl font-bold text-foreground mb-2">
                {isFr ? "Vérifiez votre email" : "Verify your email"}
              </h2>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                {isFr ? "Votre compte est créé. Un code de vérification a été envoyé à :" : "Your account is created. A verification code was sent to:"}
              </p>
              <p className="text-sm font-semibold text-primary mb-6 break-all">{signupEmail}</p>

              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isFr
                    ? "Copiez le code reçu par email et collez-le ci-dessous pour activer votre espace ambassadeur."
                    : "Copy the code from the email and paste it below to activate your ambassador space."}
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={OTP_LENGTH} pattern={REGEXP_ONLY_DIGITS} inputMode="numeric" autoComplete="one-time-code" value={otpValue} onChange={(value) => setOtpValue(value.replace(/\D/g, "").slice(0, OTP_LENGTH))}>
                  <InputOTPGroup>
                    {Array.from({ length: OTP_LENGTH }, (_, i) => i).map((i) => (
                      <InputOTPSlot key={i} index={i} className="w-9 sm:w-10 h-14 text-lg font-bold border-border/50 bg-background/50 text-foreground" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                variant="hero"
                className="w-full rounded-xl py-5 text-sm font-semibold mb-4"
                onClick={handleVerifyOtp}
                disabled={otpVerifying || otpValue.length < OTP_MIN_LENGTH}
              >
                {otpVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : (isFr ? "Activer mon espace" : "Activate my space")}
              </Button>

              <div className="space-y-3">
                <Button variant="outline" className="w-full rounded-xl py-5 text-sm gap-2" onClick={handleResend} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {isFr ? "Renvoyer un code" : "Resend code"}
                </Button>

                <button
                  onClick={() => { setSignupComplete(false); setMode("login"); setOtpValue(""); }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {isFr ? "← Retour à la connexion" : "← Back to sign in"}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {[
                isFr ? "Vérifiez vos spams si vous ne trouvez pas l'email" : "Check your spam folder if you can't find the email",
                isFr ? "Le code expire après 1h. Utilisez toujours le dernier email reçu." : "The code expires after 1h. Always use the most recent email.",
              ].map((tip, i) => (
                <p key={i} className="text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> {tip}
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
        title="Join Sofara — Become a Dubai Real Estate Ambassador | Earn Up to 3% Commission"
        description="Sign up free to become a Dubai real estate ambassador. Earn up to 3% commission on every sale from Emaar, Damac, Sobha. No license needed. Paid in AED."
        canonical="https://sofara.io/auth"
        noindex
      />
      {/* Left panel — Immersive hero */}
      <div className="relative lg:w-[55%] h-52 sm:h-64 lg:h-auto lg:min-h-[100svh] flex-shrink-0 overflow-hidden">
        <img
          src={authHero}
          alt="Dubai business networking event with Burj Khalifa skyline"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
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
              {isFr
                ? "Le réseau des ambassadeurs de l'immobilier à Dubaï et aux Émirats"
                : "The Dubai & UAE Real Estate Ambassadors Network"}
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-4 lg:mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs sm:text-sm font-semibold">{isFr ? "Équipe dédiée à Dubaï" : "Dedicated Dubai team"}</span>
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
                {isFr
                  ? "Basé à Dubai · RERA Compliant · Technologie propriétaire · Données temps réel"
                  : "Dubai HQ · RERA Compliant · Paid in AED · Real-time tracking"}
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
            {isFr ? "Retour à l'accueil" : "Back to home"}
          </a>

          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <span className="font-display text-3xl lg:hidden font-bold text-primary tracking-tight block mb-4">sofara</span>
              <h1 className="text-xl font-bold text-foreground">{l.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{l.subtitle}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3.5" autoComplete="off">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm">{isFr ? "Prénom" : "First name"} <span className="text-destructive">*</span></Label>
                  <Input id="firstName" autoComplete="given-name" placeholder={isFr ? "Jean" : "John"} value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="bg-background/50 h-11 rounded-xl" />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email {mode === "signup" && <span className="text-destructive">*</span>}</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/50 h-11 rounded-xl" />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">
                    {isFr ? "Mot de passe" : "Password"} {mode === "signup" && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder={mode === "signup" ? (isFr ? "8 caractères minimum" : "At least 8 characters") : "••••••••"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === "signup" ? 8 : 6} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="bg-background/50 h-11 rounded-xl pr-11" />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    {isFr
                      ? "Nom, téléphone et activité vous seront demandés juste après, dans votre espace."
                      : "Last name, phone and activity are asked right after, in your space."}
                  </p>
                  <Label htmlFor="emailLang" className="text-sm">{EMAIL_LANG_LABEL[isFr ? "fr" : "en"].label} <span className="text-destructive">*</span></Label>
                  <Select value={emailLang} onValueChange={(v) => setEmailLang(v as EmailLang)}>
                    <SelectTrigger id="emailLang" className="bg-background/50 h-11 rounded-xl border-border/50 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {EMAIL_LANG_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value} className="focus:bg-primary/10 focus:text-primary">
                          <span dir={o.value === "ar" ? "rtl" : undefined}>{o.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{EMAIL_LANG_LABEL[isFr ? "fr" : "en"].hint}</p>
                </div>
              )}

              {mode === "login" && (
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {isFr ? "Mot de passe oublié ?" : "Forgot password?"}
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
            <span className="text-xs text-primary font-semibold">{isFr ? "Équipe dédiée à Dubaï" : "Dedicated Dubai team"}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
