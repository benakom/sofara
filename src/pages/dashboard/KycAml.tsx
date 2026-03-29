import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { AlertTriangle, CheckCircle, Lock, Star, ShieldCheck, FileText, Upload, Award, BookOpen, Zap, Target } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import KycUploadForm from "@/components/kyc/KycUploadForm";

const kycDocs = [
  { titleFr: "Passeport valide (copie couleur)", titleEn: "Valid Passport (color copy)", required: true, desc: "Emirates ID or passport" },
  { titleFr: "Justificatif de domicile (< 3 mois)", titleEn: "Proof of Address (< 3 months)", required: true, desc: "Utility bill, bank statement" },
  { titleFr: "Relevé bancaire (< 3 mois)", titleEn: "Bank Statement (< 3 months)", required: true, desc: "Last 3 months" },
  { titleFr: "Source of Funds Declaration", titleEn: "Source of Funds Declaration", required: true, desc: "Signed declaration" },
  { titleFr: "Formulaire de réservation signé", titleEn: "Signed Reservation Form", required: true, desc: "Developer form" },
  { titleFr: "Power of Attorney (si applicable)", titleEn: "Power of Attorney (if applicable)", required: false, desc: "Notarized document" },
];

const amlModules = [
  { titleFr: "Qu'est-ce que le blanchiment d'argent ?", titleEn: "What is money laundering?", pts: 10, completed: false, icon: BookOpen },
  { titleFr: "Signaux d'alerte (red flags)", titleEn: "Warning signs (red flags)", pts: 15, completed: false, icon: AlertTriangle },
  { titleFr: "Obligations de déclaration", titleEn: "Declaration obligations", pts: 20, completed: false, icon: FileText },
  { titleFr: "Cas pratiques : identifier les risques", titleEn: "Case studies: identifying risks", pts: 25, completed: false, icon: Target },
  { titleFr: "Quiz final : certification AML", titleEn: "Final quiz: AML certification", pts: 30, completed: false, icon: Award },
];

const KycAml = () => {
  const { lang } = useLanguage();
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const totalPts = amlModules.reduce((a, m) => a + m.pts, 0);
  const earnedPts = amlModules.filter(m => m.completed).reduce((a, m) => a + m.pts, 0);
  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = kycDocs.filter(d => d.required).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl sm:text-xl font-display font-extrabold dash-text tracking-tight mb-0.5">KYC & AML</h1>
      <p className="dash-muted-text text-xs mt-0.5 mb-5">{lang === "ar" ? "الامتثال والتحقق." : "Compliance and verification."}</p>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { labelAr: "Documents", labelEn: "Documents", value: `${checkedCount}/${totalDocs}`, icon: FileText, accent: "bg-blue-50 text-blue-600" },
          { labelAr: "AML Score", labelEn: "AML Score", value: `${earnedPts}/${totalPts}`, icon: ShieldCheck, accent: "bg-violet-50 text-violet-600" },
          { labelAr: "Certification", labelEn: "Certification", value: earnedPts >= totalPts ? "✅" : "🔒", icon: Award, accent: "bg-amber-50 text-amber-600" },
          { labelAr: "XP gagnés", labelEn: "XP Earned", value: `${earnedPts}`, icon: Zap, accent: "bg-emerald-50 text-emerald-600" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${s.accent}`}><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-xs font-medium dash-muted-text uppercase tracking-wider">{lang === "ar" ? s.labelAr : s.labelEn}</span>
            </div>
            <p className="text-xl sm:text-lg font-display font-bold dash-text">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* KYC Checklist */}
        <div className="dash-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Checklist KYC</h2>
            <span className="text-xs dash-muted-text">{checkedCount}/{totalDocs}</span>
          </div>
          {/* Progress */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${totalDocs > 0 ? (checkedCount / totalDocs) * 100 : 0}%` }} />
          </div>
          <div className="space-y-2">
            {kycDocs.map((doc, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                checkedDocs[i] ? "bg-emerald-50 border-emerald-200" : "bg-[hsl(var(--dash-muted)/.3)] border-[hsl(var(--dash-border))]"
              }`}>
                <Checkbox
                  checked={!!checkedDocs[i]}
                  onCheckedChange={(v) => setCheckedDocs(prev => ({ ...prev, [i]: !!v }))}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dash-text">{lang === "ar" ? doc.titleFr : doc.titleEn}</span>
                    {doc.required && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">{lang === "ar" ? "Requis" : "Required"}</span>}
                  </div>
                  <p className="text-[11px] dash-muted-text mt-0.5">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AML Training */}
        <div className="space-y-4">
          <div className="dash-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[hsl(var(--dash-accent))]" /> {lang === "ar" ? "Formation AML" : "AML Training"}</h2>
              <span className="text-xs font-medium text-[hsl(var(--dash-accent))]">{earnedPts}/{totalPts} pts</span>
            </div>
            <div className="h-1.5 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[hsl(var(--dash-accent))] rounded-full transition-all" style={{ width: `${(earnedPts / totalPts) * 100}%` }} />
            </div>
            <div className="space-y-2">
              {amlModules.map((mod, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                  mod.completed ? "bg-emerald-50 border-emerald-200" : "bg-[hsl(var(--dash-muted)/.3)] border-[hsl(var(--dash-border))]"
                }`}>
                  <div className={`p-1.5 rounded-lg ${mod.completed ? "bg-emerald-100" : "bg-gray-100"}`}>
                    {mod.completed ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <mod.icon className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dash-text truncate">{lang === "ar" ? mod.titleFr : mod.titleEn}</p>
                    <p className="text-[11px] dash-muted-text">+{mod.pts} XP</p>
                  </div>
                  {!mod.completed && <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Certification card */}
          <div className="dash-card rounded-2xl p-5 border-[hsl(var(--primary)/.2)]" style={{ borderColor: "hsl(var(--primary) / 0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold dash-text">{lang === "ar" ? "Certification AML Sofara" : "Sofara AML Certification"}</h3>
                <p className="text-[11px] dash-muted-text">{lang === "ar" ? "Complétez tous les modules pour obtenir votre badge." : "Complete all modules to earn your badge."}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs dash-muted-text">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === "ar" ? `${amlModules.filter(m => m.completed).length}/${amlModules.length} modules complétés` : `${amlModules.filter(m => m.completed).length}/${amlModules.length} modules completed`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Upload Form */}
      <div className="mt-5">
        <KycUploadForm />
      </div>
    </motion.div>
  );
};

export default KycAml;
