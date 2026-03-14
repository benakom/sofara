import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const stageLabels: Record<string, { fr: string; en: string; color: string; barColor: string }> = {
  nouveau: { fr: "Nouveau", en: "New", color: "bg-slate-100 text-slate-700", barColor: "bg-slate-400" },
  prequalifie: { fr: "Préqualifié", en: "Prequalified", color: "bg-sky-100 text-sky-700", barColor: "bg-sky-500" },
  qualifie: { fr: "Qualifié", en: "Qualified", color: "bg-violet-100 text-violet-700", barColor: "bg-violet-500" },
  injoignable: { fr: "Injoignable", en: "Unreachable", color: "bg-red-100 text-red-600", barColor: "bg-red-500" },
  offre_envoyee: { fr: "Offre envoyée", en: "Offer Sent", color: "bg-amber-100 text-amber-700", barColor: "bg-amber-500" },
  offre_acceptee: { fr: "Offre acceptée", en: "Offer Accepted", color: "bg-emerald-100 text-emerald-700", barColor: "bg-emerald-500" },
  booking: { fr: "Booking payé", en: "Booking Paid", color: "bg-green-100 text-green-700", barColor: "bg-green-500" },
  dp_paye: { fr: "DP payé", en: "DP Paid", color: "bg-teal-100 text-teal-700", barColor: "bg-teal-600" },
};

const Pipeline = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", source: "manual" });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const addLead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("leads").insert({
        user_id: user!.id, first_name: form.first_name, last_name: form.last_name,
        email: form.email || null, phone: form.phone || null, source: form.source,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setNewLeadOpen(false);
      setForm({ first_name: "", last_name: "", email: "", phone: "", source: "manual" });
      toast({ title: lang === "fr" ? "Lead ajouté !" : "Lead added!" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.message }),
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const { error } = await supabase.from("leads").update({ stage, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const totalLeads = leads.length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-xl font-display font-bold dash-text">Pipeline</h1>
          <p className="dash-muted-text text-base sm:text-sm">{lang === "fr" ? "Suivez la progression de vos leads." : "Track your leads progression."}</p>
        </div>
        <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-lg bg-[hsl(var(--primary))] text-white hover:opacity-90">
              + {lang === "fr" ? "Nouveau lead" : "New lead"}
            </Button>
          </DialogTrigger>
          <DialogContent className="dash-form-bg border-[hsl(var(--dash-border))]">
            <DialogHeader>
              <DialogTitle className="dash-text">{lang === "fr" ? "Ajouter un lead" : "Add a lead"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addLead.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="dash-text text-xs">{lang === "fr" ? "Prénom" : "First Name"}</Label><Input required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} className="mt-1 dash-input" /></div>
                <div><Label className="dash-text text-xs">{lang === "fr" ? "Nom" : "Last Name"}</Label><Input required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} className="mt-1 dash-input" /></div>
              </div>
              <div><Label className="dash-text text-xs">Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1 dash-input" /></div>
              <div><Label className="dash-text text-xs">{lang === "fr" ? "Téléphone" : "Phone"}</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1 dash-input" /></div>
              <div><Label className="dash-text text-xs">Source</Label>
                <Select value={form.source} onValueChange={v => setForm(p => ({ ...p, source: v }))}>
                  <SelectTrigger className="mt-1 dash-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">{lang === "fr" ? "Manuel" : "Manual"}</SelectItem>
                    <SelectItem value="meta_ads">Meta Ads</SelectItem>
                    <SelectItem value="google_sheet">Google Sheet</SelectItem>
                    <SelectItem value="referral">{lang === "fr" ? "Parrainage" : "Referral"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-[hsl(var(--primary))] text-white" disabled={addLead.isPending}>
                {addLead.isPending ? "..." : lang === "fr" ? "Ajouter" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vivid pipeline progress bar */}
      {totalLeads > 0 && (
        <div className="dash-card rounded-xl p-4 mb-5">
          <p className="text-sm sm:text-xs font-medium dash-muted-text mb-2 uppercase tracking-wider">{lang === "fr" ? "Répartition" : "Distribution"}</p>
          <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
            {Object.entries(stageLabels).map(([key, label]) => {
              const count = leads.filter((l: any) => l.stage === key).length;
              if (count === 0) return null;
              return (
                <div key={key} className={`h-full ${label.barColor} rounded-full transition-all relative group`}
                  style={{ width: `${(count / totalLeads) * 100}%`, minWidth: 8 }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {lang === "fr" ? label.fr : label.en}: {count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            {Object.entries(stageLabels).map(([key, label]) => {
              const count = leads.filter((l: any) => l.stage === key).length;
              if (count === 0) return null;
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs sm:text-[11px] dash-muted-text">
                  <div className={`w-2 h-2 rounded-full ${label.barColor}`} />
                  {lang === "fr" ? label.fr : label.en}: {count}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="dash-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dash-border-color">
                {["LEAD", "SOURCE", "STAGE", "SCORE", "ACTION", "KYC"].map((h) => (
                  <th key={h} className="text-left text-xs sm:text-[11px] font-semibold dash-muted-text uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-14 dash-muted-text text-sm">
                  {lang === "fr" ? "Aucun lead. Ajoutez votre premier lead !" : "No leads. Add your first lead!"}
                </td></tr>
              ) : (
                leads.map((lead: any) => {
                  const stage = stageLabels[lead.stage] || stageLabels.nouveau;
                  return (
                    <tr key={lead.id} className="border-b dash-border-color last:border-0 hover:bg-[hsl(var(--dash-muted)/.5)] transition-colors">
                      <td className="px-4 py-3 text-sm font-medium dash-text">{lead.first_name} {lead.last_name?.charAt(0)}.</td>
                      <td className="px-4 py-3 text-sm dash-muted-text capitalize">{lead.source?.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">
                        <Select value={lead.stage} onValueChange={(v) => updateStage.mutate({ id: lead.id, stage: v })}>
                          <SelectTrigger className={`text-[11px] h-6 w-auto rounded-full border-0 px-2.5 ${stage.color}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(stageLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{lang === "fr" ? v.fr : v.en}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 dash-text">{lead.score}</span></td>
                      <td className="px-4 py-3 text-sm dash-muted-text">{lead.next_action || "—"}</td>
                      <td className="px-4 py-3"><span className="text-xs dash-muted-text capitalize">{lead.kyc_status?.replace(/_/g, " ")}</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Pipeline;
