import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({
        title: lang === "ar" ? "Mot de passe mis à jour" : "Password updated",
        description: lang === "ar" ? "Vous pouvez maintenant vous connecter." : "You can now sign in.",
      });
      navigate("/auth");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          {lang === "ar" ? "Lien invalide ou expiré." : "Invalid or expired link."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-xl font-semibold text-foreground text-center mb-6">
          {lang === "ar" ? "كلمة مرور جديدة" : "New Password"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{lang === "ar" ? "كلمة مرور جديدة" : "New password"}</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background/50 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label={showPassword ? (lang === "ar" ? "Masquer le mot de passe" : "Hide password") : (lang === "ar" ? "Afficher le mot de passe" : "Show password")}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="hero" className="w-full rounded-xl py-5" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : lang === "ar" ? "تحديث" : "Update"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
