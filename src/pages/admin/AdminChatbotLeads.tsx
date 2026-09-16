import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, MessageCircle, Mail, Bot, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface ChatbotLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone: string;
  language: string | null;
  source_page: string | null;
  created_at: string;
}

const AdminChatbotLeads = () => {
  const [leads, setLeads] = useState<ChatbotLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("chatbot_leads")
        .select("*")
        .order("created_at", { ascending: false });
      setLeads((data ?? []) as ChatbotLead[]);
      setLoading(false);
    })();
  }, []);

  const fullPhone = (l: ChatbotLead) => `${l.country_code}${l.phone}`.replace(/[^\d]/g, "");
  const waLink = (l: ChatbotLead) => `https://wa.me/${fullPhone(l)}?text=${encodeURIComponent(
    `Hi ${l.first_name}, this is Sofara. Thanks for your interest — happy to help with Dubai real estate.`
  )}`;
  const mailLink = (l: ChatbotLead) =>
    `mailto:${l.email}?subject=${encodeURIComponent("Welcome to Sofara")}&body=${encodeURIComponent(
      `Hi ${l.first_name},\n\nThank you for reaching out via our website. I'd love to share investment opportunities tailored to you.\n\nBest,\nSofara Team`
    )}`;

  const filtered = leads.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(s) ||
      l.email.toLowerCase().includes(s) ||
      l.phone.includes(s)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = () => {
    const headers = ["First", "Last", "Email", "Phone", "Language", "Source Page", "Created"];
    const rows = filtered.map(l => [
      l.first_name, l.last_name, l.email, fullPhone(l), l.language || "", l.source_page || "",
      new Date(l.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "chatbot-leads.csv"; a.click();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-fg))]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Chatbot Leads</h1>
          <span className="bg-[hsl(var(--dash-accent))] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--dash-border))] rounded-lg text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
        <input
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search name, email, phone..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]"
        />
      </div>

      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Lang</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Source</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Captured</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Contact</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(l => (
                <tr key={l.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]">
                  <td className="px-4 py-3 text-sm font-medium text-[hsl(var(--dash-fg))]">{l.first_name} {l.last_name}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{l.email}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{l.country_code} {l.phone}</td>
                  <td className="px-4 py-3 text-[10px] uppercase text-[hsl(var(--dash-muted-fg))]">{l.language || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))] truncate max-w-[160px]">{l.source_page || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">
                    {new Date(l.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a href={waLink(l)} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#25D366]/10 text-[#25D366] text-[11px] font-medium hover:bg-[#25D366]/20">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                      <a href={mailLink(l)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[hsl(var(--dash-accent)/.12)] text-[hsl(var(--dash-fg))] text-[11px] font-medium hover:bg-[hsl(var(--dash-accent)/.2)]">
                        <Mail className="w-3 h-3" /> Email
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <div className="text-center py-16">
            <Bot className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-1">No chatbot leads yet</h3>
            <p className="text-xs text-[hsl(var(--dash-muted-fg))]">Leads captured by the website chatbot will appear here.</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dash-border))]">
            <p className="text-xs text-[hsl(var(--dash-muted-fg))]">Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronLeft className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronRight className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatbotLeads;
