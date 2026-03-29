import { BarChart3, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  estComm: number;
  valComm: number;
  paidComm: number;
  totalComm: number;
  lang: string;
}

const DashboardStatistics = ({ estComm, valComm, paidComm, totalComm, lang }: Props) => {
  const navigate = useNavigate();
  const months = ["May", "Jun", "Jul", "Aug", "Sep"];
  
  // Simulated bar data based on commission values
  const barData = months.map((m, i) => ({
    month: m,
    a: Math.max(10, Math.round((estComm / 5) * (0.4 + Math.random() * 0.6))),
    b: Math.max(8, Math.round((valComm / 5) * (0.3 + Math.random() * 0.7))),
  }));

  const maxBar = Math.max(...barData.map(d => d.a + d.b), 1);

  return (
    <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-3xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-bold text-[hsl(var(--dash-fg))] flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-[hsl(var(--dash-muted-fg))]" />
          {lang === "ar" ? "الإحصائيات" : "Statistics"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[hsl(var(--dash-fg))] bg-[hsl(var(--dash-muted))] px-3 py-1 rounded-lg">
            Monthly
          </span>
        </div>
      </div>

      {/* Income + Spend */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs text-[hsl(var(--dash-muted-fg))] mb-1">{lang === "ar" ? "الدخل" : "Income"}</p>
          <p className="text-2xl font-display font-extrabold text-[hsl(var(--dash-fg))] tracking-tight">
            AED {estComm.toLocaleString() || "0"}
          </p>
          <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-1 flex items-center gap-1">
            <span className="text-green-500">↗ 4.1%</span> vs last year
          </p>
        </div>
        <div>
          <p className="text-xs text-[hsl(var(--dash-muted-fg))] mb-1">{lang === "ar" ? "الإنفاق" : "Validated"}</p>
          <p className="text-2xl font-display font-extrabold text-[hsl(var(--dash-fg))] tracking-tight">
            AED {valComm.toLocaleString() || "0"}
          </p>
          <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-1 flex items-center gap-1">
            <span className="text-green-500">↗ 2%</span> vs last year
          </p>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="flex items-end gap-3 h-32">
        {barData.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
              <div
                className="flex-1 rounded-t-md dash-bar-a"
                style={{ height: `${Math.max(8, (d.a / maxBar) * 100)}%` }}
              />
              <div
                className="flex-1 rounded-t-md dash-bar-b"
                style={{ height: `${Math.max(8, (d.b / maxBar) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[hsl(var(--dash-muted-fg))] mt-1">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStatistics;
