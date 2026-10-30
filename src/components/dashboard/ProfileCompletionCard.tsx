import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserRound } from "lucide-react";
import { OCCUPATIONS, PHONE_CODES, phoneError } from "@/lib/profile-options";

type EmailLang = "en" | "fr" | "es" | "ru" | "ar";
const EMAIL_LANGS: { value: EmailLang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
];

interface Props {
  isFr: boolean;
  /** "dashboard" uses the dashboard card style, "status" sits inside the account status screen. */
  variant?: "dashboard" | "status";
}

/**
 * Profile completion, asked right after account creation instead of on the sign-up form:
 * last name, phone and activity (all nullable in public.profiles), plus the email language.
 * Hidden once the profile is complete.
 */
const ProfileCompletionCard = ({ isFr, variant = "dashboard" }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [emailLang, setEmailLang] = useState<EmailLang>(isFr ? "fr" : "en");
  const [phoneErr, setPhoneErr] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("profiles").select("first_name, last_name, phone, occupation").eq("id", user.id).maybeSingle();
      if (cancelled) return;
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const metaLang = typeof meta.email_lang === "string" ? (meta.email_lang as EmailLang) : null;
      if (metaLang && EMAIL_LANGS.some((l) => l.value === metaLang)) setEmailLang(metaLang);
      setFirstName(data?.first_name || (typeof meta.first_name === "string" ? meta.first_name : ""));
      setLastName(data?.last_name || "");
      setOccupation(data?.occupation || "");
      const p = data?.phone || "";
      if (p) {
        const entry = [...PHONE_CODES].sort((a, b) => b.code.length - a.code.length).find((c) => p.startsWith(c.code));
        if (entry) { setPhoneCode(entry.code); setPhone(p.slice(entry.code.length)); } else setPhone(p);
      }
      setComplete(!!(data?.last_name && data?.phone && data?.occupation));
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!user || !ready || complete) return null;

  const selected = PHONE_CODES.find((c) => c.code === phoneCode);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const pErr = phoneError(digits, phoneCode, isFr);
    if (pErr) { setPhoneErr(pErr); return; }
    if (!lastName.trim() || !digits || !occupation) {
      toast({ variant: "destructive", title: isFr ? "Champs requis" : "Required fields", description: isFr ? "Merci de remplir les trois champs." : "Please fill in the three fields." });
      return;
    }
    setSaving(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const { error } = await supabase
      .from("profiles")
      .update({ last_name: lastName.trim(), full_name: fullName, phone: `${phoneCode}${digits}`, occupation })
      .eq("id", user.id);
    if (!error) {
      // Keep auth metadata in sync: emails read email_lang from it.
      await supabase.auth.updateUser({ data: { last_name: lastName.trim(), full_name: fullName, email_lang: emailLang } }).catch(() => undefined);
    }
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: isFr ? "Profil non enregistré" : "Profile not saved", description: error.message });
      return;
    }
    toast({ title: isFr ? "Profil complété" : "Profile completed", description: isFr ? "Merci, notre équipe a tout ce qu'il faut." : "Thank you, our team has everything it needs." });
    setComplete(true);
  };

  const wrap = variant === "status"
    ? "mt-6 text-left rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-bg)/.5)] p-5"
    : "mb-6 rounded-2xl border border-[hsl(var(--dash-accent)/.35)] bg-[hsl(var(--dash-card))] p-5";
  const field = "mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-[13px]";

  return (
    <form onSubmit={save} className={wrap}>
      <div className="flex items-start gap-3 mb-4">
        <span className="w-9 h-9 rounded-xl bg-[hsl(var(--dash-accent)/.15)] flex items-center justify-center shrink-0">
          <UserRound className="w-4 h-4 text-[hsl(var(--dash-accent-ink))]" />
        </span>
        <div>
          <h2 className="text-[14px] font-semibold text-[hsl(var(--dash-fg))]">{isFr ? "Complétez votre profil" : "Complete your profile"}</h2>
          <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] leading-snug">
            {isFr ? "Trois informations pour que notre équipe puisse vous accompagner." : "Three details so our team can support you."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-[hsl(var(--dash-muted-fg))]">{isFr ? "Nom" : "Last name"} *</Label>
          <Input value={lastName} autoComplete="family-name" onChange={(e) => setLastName(e.target.value)} className={field} />
        </div>
        <div>
          <Label className="text-xs text-[hsl(var(--dash-muted-fg))]">{isFr ? "Activité" : "Activity"} *</Label>
          <Select value={occupation} onValueChange={setOccupation}>
            <SelectTrigger className={field}><SelectValue placeholder={isFr ? "Sélectionnez votre activité" : "Select your activity"} /></SelectTrigger>
            <SelectContent>
              {OCCUPATIONS.map((o) => <SelectItem key={o.value} value={o.value}>{isFr ? o.labelAr : o.labelEn}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs text-[hsl(var(--dash-muted-fg))]">{isFr ? "Téléphone (WhatsApp de préférence)" : "Phone (WhatsApp preferred)"} *</Label>
          <div className="grid grid-cols-[130px_1fr] gap-2">
            <Select value={phoneCode} onValueChange={(v) => { setPhoneCode(v); setPhoneErr(""); }}>
              <SelectTrigger className={field}>
                <SelectValue>{selected && <span className="flex items-center gap-1.5"><span>{selected.flag}</span><span>{selected.code}</span></span>}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {PHONE_CODES.map((c) => (
                  <SelectItem key={`${c.code}-${c.name}`} value={c.code}>
                    <span className="flex items-center gap-2"><span>{c.flag}</span><span>{c.name}</span><span className="text-muted-foreground">{c.code}</span></span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => { const v = e.target.value.replace(/[^\d\s]/g, ""); setPhone(v); setPhoneErr(phoneError(v, phoneCode, isFr)); }} placeholder={selected ? (isFr ? `${selected.digits} chiffres` : `${selected.digits} digits`) : ""} className={field} />
          </div>
          {phoneErr && <p className="text-[11px] text-destructive mt-1">{phoneErr}</p>}
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs text-[hsl(var(--dash-muted-fg))]">{isFr ? "Langue de nos emails" : "Language of our emails"}</Label>
          <Select value={emailLang} onValueChange={(v) => setEmailLang(v as EmailLang)}>
            <SelectTrigger className={field}><SelectValue /></SelectTrigger>
            <SelectContent>
              {EMAIL_LANGS.map((o) => <SelectItem key={o.value} value={o.value}><span dir={o.value === "ar" ? "rtl" : undefined}>{o.label}</span></SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button type="submit" disabled={saving} className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-[13px] font-semibold px-5 py-2.5 hover:brightness-95 disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isFr ? "Enregistrer mon profil" : "Save my profile"}
      </button>
    </form>
  );
};

export default ProfileCompletionCard;
