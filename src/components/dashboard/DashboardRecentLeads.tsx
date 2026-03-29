import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  leads: any[];
  lang: string;
}

const DashboardRecentLeads = ({ leads, lang }: Props) => {
  const navigate = useNavigate();

  // Simulated visitor circles data
  const circles = [
    { label: lang === "ar" ? "مؤهل" : "Qualified", count: leads.filter((l: any) => l.stage === "qualifie").length, color: "bg-[hsl(var(--dash-accent))]", textColor: "text-[hsl(var(--dash-accent-fg))]", size: "w-24 h-24" },
    { label: lang === "ar" ? "محتمل" : "Prospect", count: leads.filter((l: any) => l.stage === "nouveau" || l.stage === "contacte").length, color: "bg-[hsl(210,60%,82%)]", textColor: "text-[hsl(210,60%,30%)]", size: "w-20 h-20" },
    { label: lang === "ar" ? "مغلق" : "Closed", count: leads.filter((l: any) => ["booking", "dp_paye"].includes(l.stage)).length, color: "bg-[hsl(220,14%,88%)]", textColor: "text-[hsl(220,15%,30%)]", size: "w-16 h-16" },
  ];

  const totalLeads = leads.length || 1;

  return (
    <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-display font-bold text-[hsl(var(--dash-fg))] flex items-center gap-2.5">
          <Users className="w-5 h-5 text-[hsl(var(--dash-muted-fg))]" />
          {lang === "ar" ? "العملاء" : "Leads"}
        </h2>
        <button onClick={() => navigate("/dashboard/pipeline")}
          className="text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] flex items-center gap-1">
          This Month ▾
        </button>
      </div>

      {/* Circles */}
      <div className="flex items-center justify-center gap-3 my-4 flex-wrap">
        {circles.map((c, i) => (
          <div key={i} className={`${c.size} ${c.color} rounded-full flex flex-col items-center justify-center`}>
            <span className={`text-lg font-display font-extrabold ${c.textColor}`}>{c.count}</span>
            <span className={`text-[9px] font-medium ${c.textColor} opacity-70`}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="mt-auto space-y-3 pt-4">
        {[
          { label: lang === "ar" ? "هدف التأهيل" : "Qualified Target", pct: Math.min(Math.round((circles[0].count / totalLeads) * 100), 100), color: "dash-bar-a" },
          { label: lang === "ar" ? "هدف الاحتمال" : "Prospect Target", pct: Math.min(Math.round((circles[1].count / totalLeads) * 100), 100), color: "dash-bar-b" },
          { label: lang === "ar" ? "هدف الإغلاق" : "Closed Target", pct: Math.min(Math.round((circles[2].count / totalLeads) * 100), 100), color: "bg-[hsl(220,14%,70%)]" },
        ].map((bar, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[hsl(var(--dash-fg))] font-medium">{bar.label}</span>
              <span className="text-[hsl(var(--dash-muted-fg))] font-semibold">{bar.pct}%</span>
            </div>
            <div className="h-1.5 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
              <div className={`h-full ${bar.color} rounded-full transition-all duration-700`} style={{ width: `${bar.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentLeads;
