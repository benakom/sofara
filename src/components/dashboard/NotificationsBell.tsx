import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Mail, StickyNote, UserPlus, Sparkles, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";
import { leadStageText } from "@/lib/lead-stages";
import { relativeTime, stageByKey, stageColor } from "@/lib/dashboard-data";

interface Props {
  /** "ar" is the dashboard's French code; anything else renders English. */
  lang: string;
  /** Ambassadors get the email opt-out toggle; admins do not. */
  variant: "ambassador" | "admin";
  emailOptIn?: boolean | null;
  onEmailOptInChange?: (v: boolean) => void;
}

const NotificationsBell = ({ lang, variant, emailOptIn, onEmailOptInChange }: Props) => {
  const isFr = lang === "ar" || lang === "fr";
  const L: "en" | "fr" = isFr ? "fr" : "en";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, unread, loading, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const describe = (n: AppNotification): { title: string; body: string; icon: typeof Bell; color?: string } => {
    const d = n.data || {};
    const first = d.lead_first_name || (d.lead_name || "").split(" ")[0] || "";
    if (n.type === "lead_stage") {
      const t = leadStageText(d.to_stage, L, first);
      return { title: `${d.lead_name || (isFr ? "Votre lead" : "Your lead")}: ${t.label}`, body: d.note ? `${t.msg} ${isFr ? "Note :" : "Note:"} ${d.note}` : t.msg, icon: Sparkles, color: stageColor(stageByKey(d.to_stage)) };
    }
    if (n.type === "lead_note") {
      return { title: isFr ? `Note sur ${d.lead_name}` : `Note on ${d.lead_name}`, body: d.note || "", icon: StickyNote };
    }
    if (n.type === "new_lead") {
      return { title: isFr ? `Nouveau lead : ${d.lead_name}` : `New lead: ${d.lead_name}`, body: isFr ? `Ajouté par ${d.ambassador_name || "un ambassadeur"}` : `Added by ${d.ambassador_name || "an ambassador"}`, icon: UserPlus };
    }
    return { title: d.title || (isFr ? "Notification" : "Notification"), body: d.body || "", icon: Bell };
  };

  const openItem = async (n: AppNotification) => {
    await markRead(n.id);
    setOpen(false);
    if (n.url) navigate(n.url);
  };

  const toggleEmail = async (v: boolean) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ notify_email: v }).eq("id", user.id);
    setSaving(false);
    if (!error) onEmailOptInChange?.(v);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[hsl(var(--dash-accent))] text-black text-[10px] font-bold flex items-center justify-center leading-none">{unread > 99 ? "99+" : unread}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[360px] max-w-[calc(100vw-24px)] p-0 rounded-2xl border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-fg))] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--dash-border))]">
          <p className="text-[13px] font-semibold">{isFr ? "Notifications" : "Notifications"}{unread > 0 && <span className="ml-2 text-[11px] font-medium text-[hsl(var(--dash-muted-fg))]">{unread} {isFr ? "non lue(s)" : "unread"}</span>}</p>
          {unread > 0 && (
            <button onClick={markAllRead} className="inline-flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"><Check className="w-3 h-3" /> {isFr ? "Tout marquer lu" : "Mark all read"}</button>
          )}
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-4 h-4 animate-spin text-[hsl(var(--dash-muted-fg))]" /></div>
          ) : items.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--dash-muted-fg))]" />
              <p className="text-[12px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Aucune notification pour le moment. Vous serez prévenu à chaque évolution de vos leads." : "No notifications yet. You will be notified at every step of your leads."}</p>
            </div>
          ) : (
            <ul>
              {items.map((n) => {
                const d = describe(n);
                const Icon = d.icon;
                return (
                  <li key={n.id}>
                    <button onClick={() => openItem(n)} className={`w-full text-left flex gap-3 px-4 py-3 border-b border-[hsl(var(--dash-border))] last:border-0 hover:bg-[hsl(var(--dash-muted)/.4)] transition-colors ${n.read_at ? "" : "bg-[hsl(var(--dash-accent)/.06)]"}`}>
                      <span className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--dash-muted))]" style={d.color ? { background: d.color, color: "#0a0a0a" } : undefined}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className={`text-[12px] leading-snug ${n.read_at ? "font-medium" : "font-semibold"} truncate`}>{d.title}</span>
                          {!n.read_at && <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent))] shrink-0" />}
                        </span>
                        {d.body && <span className="block text-[11px] text-[hsl(var(--dash-muted-fg))] leading-snug mt-0.5 line-clamp-2">{d.body}</span>}
                        <span className="block text-[10px] text-[hsl(var(--dash-muted-fg))] mt-1">{relativeTime(n.created_at, lang)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {variant === "ambassador" && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[hsl(var(--dash-border))]">
            <span className="inline-flex items-center gap-2 text-[11px] text-[hsl(var(--dash-muted-fg))]"><Mail className="w-3.5 h-3.5" /> {isFr ? "Me prévenir aussi par email" : "Also notify me by email"}</span>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(var(--dash-muted-fg))]" /> : <Switch checked={emailOptIn !== false} onCheckedChange={toggleEmail} />}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;
