import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, SlidersHorizontal, Upload, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const stageColors: Record<string, string> = {
  nouveau: "bg-muted-foreground",
  prequalifie: "bg-green-500",
  qualifie: "bg-foreground",
  injoignable: "bg-destructive",
  offre_envoyee: "bg-purple-500",
  offre_acceptee: "bg-green-500",
  booking: "bg-green-600",
  dp: "bg-green-700",
};

const Pipeline = () => {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Pipeline</h1>
          <p className="text-muted-foreground text-sm">{lang === "fr" ? "Suivez la progression de vos leads" : "Track your leads progression"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <Upload className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <Link className="w-4 h-4" /> Google Sheet
          </Button>
          <Button size="sm" className="gap-2 rounded-lg bg-foreground text-background hover:bg-foreground/90">
            + {lang === "fr" ? "Nouveau lead" : "New lead"}
          </Button>
        </div>
      </div>

      {/* Pipeline bar */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-5 mb-6">
        <div className="h-10 rounded-full overflow-hidden flex bg-secondary">
          <div className="flex items-center justify-center text-xs font-bold text-muted-foreground/50 w-full">
            {lang === "fr" ? "Aucune donnée" : "No data"}
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={lang === "fr" ? "Rechercher un lead..." : "Search a lead..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
        <Button variant="outline" size="default" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" /> {lang === "fr" ? "Filtres" : "Filters"}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["LEAD", "SOURCE", "STAGE", "SCORE", lang === "fr" ? "PROCHAINE ACTION" : "NEXT ACTION", "KYC"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  {lang === "fr" ? "Aucun lead dans votre pipeline. Importez vos premiers leads !" : "No leads in your pipeline. Import your first leads!"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Pipeline;
