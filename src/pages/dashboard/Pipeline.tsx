import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, SlidersHorizontal, Upload, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const stageLabels: Record<string, { fr: string; en: string; color: string }> = {
  nouveau: { fr: "Nouveau", en: "New", color: "bg-gray-200 text-gray-700" },
  prequalifie: { fr: "Préqualifié", en: "Prequalified", color: "bg-green-100 text-green-700" },
  qualifie: { fr: "Qualifié", en: "Qualified", color: "bg-gray-700 text-white" },
  injoignable: { fr: "Injoignable", en: "Unreachable", color: "bg-red-100 text-red-700" },
  offre_envoyee: { fr: "Offre envoyée", en: "Offer Sent", color: "bg-purple-100 text-purple-700" },
  offre_acceptee: { fr: "Offre acceptée", en: "Offer Accepted", color: "bg-green-100 text-green-700" },
  booking: { fr: "Booking payé", en: "Booking Paid", color: "bg-green-200 text-green-800" },
  dp_paye: { fr: "DP payé", en: "DP Paid", color: "bg-green-300 text-green-900" },
};

const Pipeline = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
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
        user_id: user!.id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email || null,
        phone: form.phone || null,
        source: form.source,
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

  const filtered = leads.filter((l: any) =>
    `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalLeads = leads.length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold dash-text">Pipeline</h1>
          <p className="dash-muted-text text-sm">{lang === "fr" ? "Suivez la progression de vos leads" : "Track your leads progression"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">
                + {lang === "fr" ? "Nouveau lead" : "New lead"}
              </Button>
            </DialogTrigger>
            <DialogContent className="dash-card">
              <DialogHeader>
                <DialogTitle className="dash-text">{lang === "fr" ? "Ajouter un lead" : "Add a lead"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); addLead.mutate(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="dash-text">{lang === "fr" ? "Prénom" : "First Name"}</Label><Input required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} className="mt-1" /></div>
                  <div><Label className="dash-text">{lang === "fr" ? "Nom" : "Last Name"}</Label><Input required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} className="mt-1" /></div>
                </div>
                <div><Label className="dash-text">Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1" /></div>
                <div><Label className="dash-text">{lang === "fr" ? "Téléphone" : "Phone"}</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" /></div>
                <div><Label className="dash-text">Source</Label>
                  <Select value={form.source} onValueChange={v => setForm(p => ({ ...p, source: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">{lang === "fr" ? "Manuel" : "Manual"}</SelectItem>
                      <SelectItem value="meta_ads">Meta Ads</SelectItem>
                      <SelectItem value="google_sheet">Google Sheet</SelectItem>
                      <SelectItem value="referral">{lang === "fr" ? "Parrainage" : "Referral"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-primary text-white" disabled={addLead.isPending}>
                  {addLead.isPending ? "..." : lang === "fr" ? "Ajouter" : "Add"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline bar */}
      {totalLeads > 0 && (
        <div className="dash-card rounded-2xl p-5 mb-6">
          <div className="h-10 rounded-full overflow-hidden flex">
            {Object.entries(stageLabels).map(([key, label]) => {
              const count = leads.filter((l: any) => l.stage === key).length;
              if (count === 0) return null;
              const w = (count / totalLeads) * 100;
              return (
                <div key={key} className={`h-full ${label.color} flex items-center justify-center text-xs font-bold`} style={{ width: `${w}%`, minWidth: 32 }}>
                  {count}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.entries(stageLabels).map(([key, label]) => {
              const count = leads.filter((l: any) => l.stage === key).length;
              if (count === 0) return null;
              return <span key={key} className="text-xs dash-muted-text">● {lang === "fr" ? label.fr : label.en}: {count}</span>;
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dash-muted-text" />
          <Input placeholder={lang === "fr" ? "Rechercher un lead..." : "Search a lead..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="dash-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dash-border-color">
                {["LEAD", "SOURCE", "STAGE", "SCORE", lang === "fr" ? "ACTION" : "ACTION", "KYC"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold dash-muted-text uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 dash-muted-text text-sm">
                  {lang === "fr" ? "Aucun lead. Ajoutez votre premier lead !" : "No leads. Add your first lead!"}
                </td></tr>
              ) : (
                filtered.map((lead: any) => {
                  const stage = stageLabels[lead.stage] || stageLabels.nouveau;
                  return (
                    <tr key={lead.id} className="border-b dash-border-color last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium dash-text">{lead.first_name} {lead.last_name?.charAt(0)}.</td>
                      <td className="px-5 py-4 text-sm dash-muted-text capitalize">{lead.source?.replace(/_/g, " ")}</td>
                      <td className="px-5 py-4">
                        <Select value={lead.stage} onValueChange={(v) => updateStage.mutate({ id: lead.id, stage: v })}>
                          <SelectTrigger className={`text-xs h-7 w-auto rounded-full border-0 ${stage.color}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(stageLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{lang === "fr" ? v.fr : v.en}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-4"><span className="text-xs font-medium dash-card rounded-full px-2 py-1 dash-text">{lead.score}</span></td>
                      <td className="px-5 py-4 text-sm dash-muted-text">{lead.next_action || "—"}</td>
                      <td className="px-5 py-4"><span className="text-xs dash-muted-text capitalize">{lead.kyc_status?.replace(/_/g, " ")}</span></td>
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
