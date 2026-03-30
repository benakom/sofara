import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Filter } from "lucide-react";
import { toast } from "sonner";

const STAGES = [
  { value: "nouveau", label: "Nouveau", color: "bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]" },
  { value: "contacté", label: "Contacté", color: "bg-[hsl(45,90%,55%/.12)] text-[hsl(45,90%,55%)]" },
  { value: "qualifié", label: "Qualifié", color: "bg-[hsl(80,70%,55%/.12)] text-[hsl(80,70%,55%)]" },
  { value: "négociation", label: "Négociation", color: "bg-[hsl(280,70%,60%/.12)] text-[hsl(280,70%,60%)]" },
  { value: "closing", label: "Closing", color: "bg-[hsl(160,70%,50%/.12)] text-[hsl(160,70%,50%)]" },
  { value: "perdu", label: "Perdu", color: "bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]" },
];

interface Profile { id: string; full_name: string | null; }

const AdminPipeline = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterAmbassador, setFilterAmbassador] = useState("all");

  const fetchData = async () => {
    const [leadsRes, profilesRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);
    setLeads(leadsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getName = (uid: string) => profiles.find(p => p.id === uid)?.full_name || uid.slice(0, 8) + "…";

  const handleStageChange = async (leadId: string, newStage: string) => {
    const { error } = await supabase.from("leads").update({ stage: newStage, updated_at: new Date().toISOString() }).eq("id", leadId);
    if (error) { toast.error("Erreur"); return; }
    toast.success(`Stage → ${newStage}`);
    fetchData();
  };

  const ambassadorsWithLeads = [...new Set(leads.map(l => l.user_id))];

  const filtered = leads
    .filter(l => filterStage === "all" || l.stage === filterStage)
    .filter(l => filterAmbassador === "all" || l.user_id === filterAmbassador)
    .filter(l => `${l.first_name} ${l.last_name} ${getName(l.user_id)}`.toLowerCase().includes(search.toLowerCase()));

  const stageCounts = STAGES.map(s => ({ ...s, count: leads.filter(l => l.stage === s.value).length }));

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Pipeline</h1>
        <p className="text-sm text-[hsl(228,10%,50%)] mt-1">{leads.length} leads au total · {ambassadorsWithLeads.length} ambassadeurs actifs</p>
      </div>

      {/* Stage summary chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStage("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterStage === "all" ? "bg-white/10 text-white" : "bg-[hsl(228,18%,12%)] text-[hsl(228,10%,50%)] hover:text-white"
          }`}
        >
          Tous ({leads.length})
        </button>
        {stageCounts.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilterStage(s.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStage === s.value ? "bg-white/10 text-white" : "bg-[hsl(228,18%,12%)] text-[hsl(228,10%,50%)] hover:text-white"
            }`}
          >
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(228,10%,35%)]" />
          <input
            type="text" placeholder="Rechercher un lead ou ambassadeur..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] text-sm text-white placeholder:text-[hsl(228,10%,35%)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/.5)]"
          />
        </div>
        <Select value={filterAmbassador} onValueChange={setFilterAmbassador}>
          <SelectTrigger className="w-[200px] bg-[hsl(228,20%,11%)] border-[hsl(228,18%,16%)] text-sm h-10 text-white">
            <Filter className="w-3.5 h-3.5 mr-2 text-[hsl(228,10%,40%)]" />
            <SelectValue placeholder="Ambassadeur" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(228,20%,12%)] border-[hsl(228,18%,18%)]">
            <SelectItem value="all">Tous les ambassadeurs</SelectItem>
            {ambassadorsWithLeads.map(uid => (
              <SelectItem key={uid} value={uid}>{getName(uid)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(228,18%,14%)] hover:bg-transparent">
              <TableHead className="text-[hsl(228,10%,45%)]">Ambassadeur</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Lead</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Contact</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Stage</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Score</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Date</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => {
              const stageObj = STAGES.find(s => s.value === l.stage) ?? STAGES[0];
              return (
                <TableRow key={l.id} className="border-[hsl(228,18%,12%)] hover:bg-[hsl(228,18%,12%)]">
                  <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getName(l.user_id)}</TableCell>
                  <TableCell className="font-medium text-white">{l.first_name} {l.last_name}</TableCell>
                  <TableCell>
                    <div className="text-[11px] text-[hsl(228,10%,50%)]">{l.email || "—"}</div>
                    <div className="text-[10px] text-[hsl(228,10%,35%)]">{l.phone || ""}</div>
                  </TableCell>
                  <TableCell>
                    <Select value={l.stage ?? "nouveau"} onValueChange={(v) => handleStageChange(l.id, v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 ${stageObj.color} font-semibold w-[120px]`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(228,20%,12%)] border-[hsl(228,18%,18%)]">
                        {STAGES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[hsl(228,18%,14%)] text-[hsl(228,10%,60%)] text-[10px]">{l.score ?? "C"}</Badge>
                  </TableCell>
                  <TableCell className="text-[hsl(228,10%,45%)] text-xs">{new Date(l.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-xs text-[hsl(228,10%,40%)] max-w-[150px] truncate">{l.notes || "—"}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-[hsl(228,10%,40%)]">Aucun lead trouvé</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPipeline;
