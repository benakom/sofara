import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { t, lang } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: lang === "fr" ? "Erreur de connexion" : "Login error",
        description: error.message,
      });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: lang === "fr" ? "Erreur d'inscription" : "Signup error",
        description: error.message,
      });
    } else {
      toast({
        title: lang === "fr" ? "Vérifiez votre email" : "Check your email",
        description: lang === "fr"
          ? "Un lien de confirmation vous a été envoyé."
          : "A confirmation link has been sent to you.",
      });
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({
        title: lang === "fr" ? "Email envoyé" : "Email sent",
        description: lang === "fr"
          ? "Vérifiez votre boîte mail pour réinitialiser votre mot de passe."
          : "Check your inbox to reset your password.",
      });
    }
  };

  const labels = {
    login: {
      title: lang === "fr" ? "Connexion" : "Sign In",
      subtitle: lang === "fr" ? "Accédez à votre espace ambassadeur" : "Access your ambassador space",
      button: lang === "fr" ? "Se connecter" : "Sign In",
      switch: lang === "fr" ? "Pas encore de compte ?" : "No account yet?",
      switchAction: lang === "fr" ? "Créer un compte" : "Create account",
    },
    signup: {
      title: lang === "fr" ? "Créer un compte" : "Create Account",
      subtitle: lang === "fr" ? "Rejoignez le programme ambassadeur Sofara" : "Join the Sofara ambassador program",
      button: lang === "fr" ? "S'inscrire" : "Sign Up",
      switch: lang === "fr" ? "Déjà un compte ?" : "Already have an account?",
      switchAction: lang === "fr" ? "Se connecter" : "Sign In",
    },
    forgot: {
      title: lang === "fr" ? "Mot de passe oublié" : "Forgot Password",
      subtitle: lang === "fr" ? "Entrez votre email pour réinitialiser" : "Enter your email to reset",
      button: lang === "fr" ? "Envoyer le lien" : "Send reset link",
      switch: lang === "fr" ? "Retour à la" : "Back to",
      switchAction: lang === "fr" ? "connexion" : "sign in",
    },
  };

  const l = labels[mode];

  const onSubmit = mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] animate-pulse-soft" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to home */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
        </a>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <a href="/" className="font-display text-3xl font-bold text-foreground tracking-tight">
              sofara
            </a>
            <h1 className="text-xl font-semibold text-foreground mt-6">{l.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{l.subtitle}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  {lang === "fr" ? "Mot de passe" : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50"
                />
              </div>
            )}

            {mode === "login" && (
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {lang === "fr" ? "Mot de passe oublié ?" : "Forgot password?"}
              </button>
            )}

            <Button
              type="submit"
              variant="hero"
              className="w-full rounded-xl py-5"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : l.button}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {l.switch}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary hover:underline font-medium"
            >
              {l.switchAction}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
