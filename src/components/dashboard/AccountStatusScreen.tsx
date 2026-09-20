import { useEffect, useRef } from "react";
import { Clock, XCircle, PauseCircle, LogOut, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Status = "pending" | "onboarding" | "rejected" | "suspended";

interface Props {
  status: Status;
  lang: string;
  firstName: string;
  underReviewEmailSent: boolean;
  onSignOut: () => void;
}

// Full-screen state shown instead of the dashboard while an account is not validated.
// Also triggers the "under review" email once, as a fallback to the post-OTP call.
const AccountStatusScreen = ({ status, lang, firstName, underReviewEmailSent, onSignOut }: Props) => {
  const fr = lang === "ar" || lang === "fr";
  const fired = useRef(false);

  useEffect(() => {
    if ((status === "pending" || status === "onboarding") && !underReviewEmailSent && !fired.current) {
      fired.current = true;
      supabase.functions.invoke("onboarding-emails", { body: { event: "verified", lang: fr ? "fr" : "en" } }).catch(() => {});
    }
  }, [status, underReviewEmailSent, fr]);

  const copy = {
    pending: {
      icon: Clock,
      title: fr ? `Merci ${firstName}, votre candidature est en cours de validation` : `Thank you ${firstName}, your application is under review`,
      body: fr
        ? "Votre email est confirmé. Notre équipe examine chaque candidature personnellement, généralement sous 24 à 48 heures ouvrées. Vous recevrez un email dès que votre compte sera validé, avec un guide pour soumettre votre premier lead."
        : "Your email is confirmed. Our team reviews every application personally, usually within 24 to 48 business hours. You will receive an email as soon as your account is validated, with a guide to submit your first lead.",
      hint: fr
        ? "En attendant, notez trois personnes de votre réseau qui ont déjà parlé d'acheter à Dubaï. Ce sera le travail de votre première semaine."
        : "While you wait, write down three people in your network who have talked about buying in Dubai. That is your first week's work.",
    },
    rejected: {
      icon: XCircle,
      title: fr ? "Votre candidature n'a pas été retenue" : "Your application was not accepted",
      body: fr
        ? "Après examen, nous ne pouvons pas ouvrir de compte ambassadeur pour ce profil. Si vous pensez qu'il s'agit d'une erreur ou si votre situation a changé, écrivez-nous."
        : "After review, we are not able to open an ambassador account for this profile. If you believe this is a mistake or your situation has changed, write to us.",
      hint: null,
    },
    suspended: {
      icon: PauseCircle,
      title: fr ? "Votre compte est suspendu" : "Your account is suspended",
      body: fr
        ? "L'accès à votre espace ambassadeur est temporairement suspendu. Contactez-nous pour en connaître la raison et les étapes de réactivation."
        : "Access to your ambassador workspace is temporarily suspended. Contact us to learn why and how to reactivate it.",
      hint: null,
    },
  } as const;

  const c = copy[status === "onboarding" ? "pending" : status];
  const Icon = c.icon;

  return (
    <div className="dash-theme min-h-screen bg-[hsl(var(--dash-bg))] flex items-center justify-center px-4 py-10 font-['Poppins']">
      <div className="w-full max-w-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-2xl p-8 text-center">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-[hsl(var(--dash-accent)/.15)] items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-[hsl(var(--dash-accent-ink))]" />
        </span>
        <p className="font-display text-[15px] font-bold text-[hsl(var(--dash-fg))] tracking-tight mb-1">sofara</p>
        <h1 className="text-lg font-bold text-[hsl(var(--dash-fg))] leading-snug mb-3">{c.title}</h1>
        <p className="text-sm text-[hsl(var(--dash-muted-fg))] leading-relaxed">{c.body}</p>
        {c.hint && (
          <p className="mt-4 text-sm text-[hsl(var(--dash-fg))] bg-[hsl(var(--dash-muted)/.5)] rounded-xl px-4 py-3 leading-relaxed">{c.hint}</p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <a href="mailto:hello@sofara.io" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-xs font-bold hover:brightness-95">
            <Mail className="w-3.5 h-3.5" /> hello@sofara.io
          </a>
          <button onClick={onSignOut} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[hsl(var(--dash-border))] text-xs font-semibold text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]">
            <LogOut className="w-3.5 h-3.5" /> {fr ? "Se déconnecter" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusScreen;
