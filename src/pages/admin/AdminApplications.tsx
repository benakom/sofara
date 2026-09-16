import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Mail, MessageCircle, UserCheck, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  occupation: string;
  ref_code: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const AdminApplications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ambassador_applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setApps((data ?? []) as Application[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    const { error } = await supabase
      .from("ambassador_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setActing(null);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: status === "contacted" ? "Marked as contacted" : "Application rejected" });
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const waLink = (phone: string | null) => {
    if (!phone) return null;
    const clean = phone.replace(/[^\d]/g, "");
    return `https://wa.me/${clean}`;
  };

  const mailLink = (email: string) => `mailto:${email}`;

  const visible = apps.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.phone.includes(search)
    );
  });

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-fg))]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Ambassador Applications</h1>
          <span className="bg-[hsl(var(--dash-accent))] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{visible.length}</span>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]"
          />
        </div>
      </div>

      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Applicant</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Occupation</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Applied</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Contact</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Decision</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--dash-accent)/.12)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--dash-fg))]">
                        {(a.first_name || "?")[0]}{(a.last_name || "")[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[hsl(var(--dash-fg))]">{a.first_name} {a.last_name}</p>
                        <p className="text-[10px] text-[#F59E0B] font-semibold uppercase">{a.status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{a.email}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{a.phone}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))] capitalize">{a.occupation.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">
                    {new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a href={mailLink(a.email)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[hsl(var(--dash-accent)/.12)] text-[hsl(var(--dash-fg))] text-[11px] font-medium hover:bg-[hsl(var(--dash-accent)/.2)]">
                        <Mail className="w-3 h-3" /> Email
                      </a>
                      <a href={waLink(a.phone)!} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#25D366]/10 text-[#25D366] text-[11px] font-medium hover:bg-[#25D366]/20">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={acting === a.id}
                        onClick={() => updateStatus(a.id, "contacted")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-[11px] font-bold hover:brightness-95 disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Contacted
                      </button>
                      <button
                        disabled={acting === a.id}
                        onClick={() => updateStatus(a.id, "rejected")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] text-[11px] font-bold hover:bg-[#EF4444]/20 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && (
          <div className="text-center py-16">
            <UserCheck className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-1">No pending applications</h3>
            <p className="text-xs text-[hsl(var(--dash-muted-fg))]">New ambassador applications will appear here for review.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
