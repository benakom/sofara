import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, Link2, MessageCircle, Send, UserPlus, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserTier } from "@/hooks/useUserTier";
import { ambassadorInviteLink, investorLinks } from "@/lib/share-links";

const whatsapp = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

const LinkRow = ({ label, url, waText, isFr }: { label: string; url: string; waText: string; isFr: boolean }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: isFr ? "Lien copié" : "Link copied" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ variant: "destructive", title: isFr ? "Copie impossible" : "Could not copy", description: url });
    }
  };
  return (
    <div>
      <p className="text-[11px] font-medium text-[hsl(var(--dash-muted-fg))] mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <span className="flex-1 min-w-0 truncate rounded-lg border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-bg))] px-2.5 py-1.5 text-[12px] font-mono text-[hsl(var(--dash-fg))]">{url.replace(/^https?:\/\//, "")}</span>
        <button type="button" onClick={copy} aria-label={isFr ? "Copier le lien" : "Copy link"} className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-fg))] hover:border-[hsl(var(--dash-accent)/.5)]">
          {copied ? <Check className="w-3.5 h-3.5 text-[hsl(var(--dash-accent-ink))]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <a href={whatsapp(waText)} target="_blank" rel="noopener noreferrer" aria-label={isFr ? "Partager sur WhatsApp" : "Share on WhatsApp"} className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#25D366] text-white hover:brightness-95">
          <MessageCircle className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

/**
 * The three things an ambassador can do, kept separate:
 * 1. share their investor link (Cevitas, OffPlanSimulator) with their code,
 * 2. present a buyer through the consented lead form,
 * 3. invite another ambassador with their sign-up link.
 */
const ShareActions = ({ isFr }: { isFr: boolean }) => {
  const navigate = useNavigate();
  const { referralCode } = useUserTier();
  const links = referralCode ? investorLinks(referralCode) : null;
  const invite = referralCode ? ambassadorInviteLink(referralCode, isFr) : null;

  const card = "rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-5 flex flex-col";
  const head = (n: number, Icon: typeof Link2, title: string, desc: string) => (
    <div className="flex items-start gap-3 mb-4">
      <span className="relative w-9 h-9 rounded-xl bg-[hsl(var(--dash-accent)/.15)] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[hsl(var(--dash-accent-ink))]" />
        <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-[hsl(var(--dash-accent))] text-black text-[9px] font-bold flex items-center justify-center">{n}</span>
      </span>
      <div className="min-w-0">
        <h2 className="text-[14px] font-semibold text-[hsl(var(--dash-fg))] leading-tight">{title}</h2>
        <p className="mt-1 text-[12px] text-[hsl(var(--dash-muted-fg))] leading-snug">{desc}</p>
      </div>
    </div>
  );
  const pending = <p className="text-[12px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Votre code apparaît ici dans un instant." : "Your code appears here in a moment."}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <section className={card}>
        {head(1, Link2, isFr ? "Partager mon lien investisseur" : "Share my investor link", isFr ? "Les personnes qui visitent ces sites avec votre lien vous sont rattachées." : "People who visit these sites through your link are attributed to you.")}
        {links ? (
          <div className="space-y-3">
            <LinkRow isFr={isFr} label="Cevitas Real Estate" url={links.cevitas} waText={isFr ? `Pour découvrir l'immobilier à Dubaï avec une agence licenciée RERA : ${links.cevitas}` : `To explore Dubai real estate with a RERA-licensed agency: ${links.cevitas}`} />
            <LinkRow isFr={isFr} label="OffPlanSimulator" url={links.offplan} waText={isFr ? `Simulez un investissement sur plan à Dubaï en quelques minutes : ${links.offplan}` : `Simulate a Dubai off-plan investment in a few minutes: ${links.offplan}`} />
          </div>
        ) : pending}
      </section>

      <section className={card}>
        {head(2, Send, isFr ? "Présenter un acheteur" : "Present a buyer", isFr ? "Une personne de votre réseau veut acheter à Dubaï et a accepté d'être contactée : enregistrez-la en trois étapes." : "Someone in your network wants to buy in Dubai and agreed to be contacted: register them in three steps.")}
        <button type="button" onClick={() => navigate("/dashboard/import-leads")} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-[13px] font-semibold px-4 py-2.5 hover:brightness-95">
          <Send className="w-4 h-4" /> {isFr ? "Présenter un acheteur" : "Present a buyer"}
        </button>
      </section>

      <section className={card}>
        {head(3, UserPlus, isFr ? "Inviter un ambassadeur" : "Invite an ambassador", isFr ? "Invitez des personnes qui ont un réseau et touchez 10 % de bonus sur leurs ventes." : "Invite people who have a network and earn a 10% bonus on their sales.")}
        {invite ? (
          <div className="space-y-3">
            <LinkRow isFr={isFr} label={isFr ? "Votre lien d'inscription" : "Your sign-up link"} url={invite} waText={isFr ? `Je suis ambassadeur Sofara à Dubaï. Rejoins le réseau, c'est gratuit : ${invite}` : `I'm a Sofara ambassador in Dubai. Join the network, it's free: ${invite}`} />
            <button type="button" onClick={() => navigate("/dashboard/referrals")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-accent-ink))]">
              {isFr ? "Voir mes filleuls" : "See my referrals"} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : pending}
      </section>
    </div>
  );
};

export default ShareActions;
