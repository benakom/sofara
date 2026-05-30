import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Check, X, Mail, MessageCircle, UserCheck, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Application {
  id: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  status: string;
  created_at: string;
  email?: string | null;
}

const AdminApplications = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    // Profiles pending or onboarding
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone, country, status, created_at")
      .in("status", ["pending", "onboarding"])
      .order("created_at", { ascending: false });

    // Exclude superadmins
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const superIds = new Set((roles ?? []).filter(r => r.role === "superadmin").map(r => r.user_id));
    const filtered = (profiles ?? []).filter(p => !superIds.has(p.id));

    // Try to enrich with email via admin function (best-effort) – fallback: no email
    setApps(filtered as Application[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    const { error } = await supabase.from("profiles").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    setActing(null);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: status === "approved" ? "Application approved" : "Application rejected" });
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const waLink = (phone: string | null) => {
    if (!phone) return null;
    const clean = phone.replace(/[^\d]/g, "");
    return `https://wa.me/${clean}`;
  };

  const visible = apps.filter(a =>
    !search || (a.full_name || "").toLowerCase().includes(search.toLowerCase()) || (a.phone || "").includes(search)
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#154B3B]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#154B3B]">Ambassador Applications</h1>
          <span className="bg-[#D2F34C] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{visible.length}</span>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#154B3B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Applicant</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Country</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Applied</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Contact</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Decision</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <button onClick={() => navigate(`/admin/ambassadors/${a.id}`)} className="flex items-center gap-3 text-left hover:underline">
                      <div className="w-8 h-8 rounded-full bg-[#154B3B]/10 flex items-center justify-center text-[10px] font-bold text-[#154B3B]">
                        {(a.full_name || "?")[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#154B3B]">{a.full_name || "—"}</p>
                        <p className="text-[10px] text-[#F59E0B] font-semibold uppercase">{a.status}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{a.country || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{a.phone || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-[#9CA3AF]">
                    {new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a.phone && (
                        <a href={waLink(a.phone)!} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#25D366]/10 text-[#25D366] text-[11px] font-medium hover:bg-[#25D366]/20">
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                      <button
                        onClick={() => navigate(`/admin/ambassadors/${a.id}`)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#154B3B]/10 text-[#154B3B] text-[11px] font-medium hover:bg-[#154B3B]/20"
                      >
                        <Mail className="w-3 h-3" /> Profile
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={acting === a.id}
                        onClick={() => updateStatus(a.id, "approved")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D2F34C] text-black text-[11px] font-bold hover:bg-[#BDE040] disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Activate
                      </button>
                      <button
                        disabled={acting === a.id}
                        onClick={() => updateStatus(a.id, "suspended")}
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
            <UserCheck className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#154B3B] mb-1">No pending applications</h3>
            <p className="text-xs text-[#9CA3AF]">New ambassador signups will appear here for review.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
