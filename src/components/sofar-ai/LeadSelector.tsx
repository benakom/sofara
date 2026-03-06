import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { User, ChevronDown, X, Search } from "lucide-react";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  score: string | null;
  stage: string | null;
  source: string | null;
}

interface LeadSelectorProps {
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead | null) => void;
}

const scoreColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-sky-100 text-sky-700",
  C: "bg-amber-100 text-amber-700",
  D: "bg-red-100 text-red-700",
};

export default function LeadSelector({ selectedLead, onSelectLead }: LeadSelectorProps) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("leads")
      .select("id, first_name, last_name, email, phone, score, stage, source")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(100)
      .then(({ data }) => { if (data) setLeads(data); });
  }, [user]);

  const filtered = leads.filter((l) =>
    `${l.first_name} ${l.last_name} ${l.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedLead) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[hsl(var(--primary)/.08)] border border-[hsl(var(--primary)/.2)]">
        <User className="w-4 h-4 text-[hsl(var(--primary))]" />
        <span className="text-sm font-medium dash-text truncate">
          {selectedLead.first_name} {selectedLead.last_name}
        </span>
        {selectedLead.score && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${scoreColors[selectedLead.score] || "bg-muted text-muted-foreground"}`}>
            {selectedLead.score}
          </span>
        )}
        <button onClick={() => onSelectLead(null)} className="ml-auto p-0.5 rounded-full hover:bg-[hsl(var(--dash-border))] transition-colors">
          <X className="w-3.5 h-3.5 dash-muted-text" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary)/.4)] hover:bg-[hsl(var(--primary)/.04)] transition-all text-sm dash-muted-text"
      >
        <User className="w-4 h-4" />
        <span>{lang === "fr" ? "Sélectionner un lead…" : "Select a lead…"}</span>
        <ChevronDown className="w-3.5 h-3.5 ml-auto" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-xl border border-[hsl(var(--dash-border))] shadow-lg max-h-64 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[hsl(var(--dash-border))]">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[hsl(var(--dash-muted))]">
              <Search className="w-3.5 h-3.5 dash-muted-text" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "fr" ? "Rechercher…" : "Search…"}
                className="flex-1 text-xs bg-transparent outline-none dash-text placeholder:text-[hsl(var(--dash-muted-fg))]"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="text-xs dash-muted-text text-center py-4">
                {lang === "fr" ? "Aucun lead trouvé" : "No leads found"}
              </p>
            ) : (
              filtered.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => { onSelectLead(lead); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--primary)/.06)] transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[hsl(var(--primary))]">
                      {lead.first_name[0]}{lead.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium dash-text truncate">{lead.first_name} {lead.last_name}</p>
                    <p className="text-[10px] dash-muted-text truncate">{lead.stage} • {lead.source}</p>
                  </div>
                  {lead.score && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${scoreColors[lead.score] || "bg-muted"}`}>
                      {lead.score}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
