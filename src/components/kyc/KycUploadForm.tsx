import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Upload, User, Phone, Mail, Globe, FileCheck, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  stage: string | null;
}

const KycUploadForm = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isUaeResident, setIsUaeResident] = useState(false);
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [emiratesIdFile, setEmiratesIdFile] = useState<File | null>(null);
  const [visaFile, setVisaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchLeads = async () => {
      const { data } = await supabase
        .from("leads")
        .select("id, first_name, last_name, email, phone, stage")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (data) setLeads(data);
    };
    fetchLeads();
  }, [user]);

  useEffect(() => {
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead) {
      setClientPhone(lead.phone || "");
      setClientEmail(lead.email || "");
    }
  }, [selectedLeadId, leads]);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${selectedLeadId}/${folder}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("kyc-documents").upload(path, file);
    if (error) { console.error("Upload error:", error); return null; }
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedLeadId) return;

    if (!passportFile) { toast.error(lang === "ar" ? "Le passeport est requis" : "Passport is required"); return; }
    if (isUaeResident && (!emiratesIdFile || !visaFile)) { toast.error(lang === "ar" ? "Emirates ID et Visa de résidence sont requis pour les résidents UAE" : "Emirates ID and Residence Visa are required for UAE residents"); return; }
    if (!clientPhone.trim() || !clientEmail.trim()) { toast.error(lang === "ar" ? "Téléphone et email sont requis" : "Phone and email are required"); return; }

    setSubmitting(true);
    try {
      const passportPath = await uploadFile(passportFile, "passport");
      if (!passportPath) throw new Error("Passport upload failed");

      let emiratesIdPath: string | null = null;
      let visaPath: string | null = null;

      if (isUaeResident) {
        emiratesIdPath = emiratesIdFile ? await uploadFile(emiratesIdFile, "emirates_id") : null;
        visaPath = visaFile ? await uploadFile(visaFile, "visa") : null;
        if (!emiratesIdPath || !visaPath) throw new Error("Document upload failed");
      }

      const { error } = await supabase.from("kyc_submissions").insert({
        user_id: user.id, lead_id: selectedLeadId, is_uae_resident: isUaeResident,
        client_phone: clientPhone.trim(), client_email: clientEmail.trim(),
        passport_path: passportPath, emirates_id_path: emiratesIdPath, residence_visa_path: visaPath,
      });

      if (error) throw error;
      await supabase.from("leads").update({ kyc_status: "submitted" }).eq("id", selectedLeadId);
      setSubmitted(true);
      toast.success(lang === "ar" ? "Documents KYC soumis avec succès !" : "KYC documents submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(lang === "ar" ? "Erreur lors de la soumission" : "Submission error");
    } finally { setSubmitting(false); }
  };

  const readyLeads = leads.filter(l => l.stage === "closing" || l.stage === "won" || l.stage === "négociation");

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="dash-card rounded-xl p-6 text-center">
        <div className="p-3 rounded-full bg-[hsl(var(--dash-accent)/.12)] w-fit mx-auto mb-3">
          <CheckCircle className="w-8 h-8 text-[hsl(var(--dash-accent))]" />
        </div>
        <h3 className="text-lg font-display font-bold dash-text mb-1">
          {lang === "ar" ? "Documents KYC soumis !" : "KYC Documents Submitted!"}
        </h3>
        <p className="text-sm dash-muted-text mb-4">
          {lang === "ar" ? "Les documents seront vérifiés dans les plus brefs délais." : "Documents will be reviewed shortly."}
        </p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setSelectedLeadId(""); setPassportFile(null); setEmiratesIdFile(null); setVisaFile(null); }}>
          {lang === "ar" ? "Soumettre un autre dossier" : "Submit another file"}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="dash-card rounded-xl p-4">
      <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2 mb-4">
        <Upload className="w-4 h-4 text-[hsl(var(--dash-accent))]" />
        {lang === "ar" ? "Soumettre les documents KYC" : "Submit KYC Documents"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {lang === "ar" ? "Sélectionner le client" : "Select client"}
          </Label>
          <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
            <SelectTrigger><SelectValue placeholder={lang === "ar" ? "Choisir un lead prêt à acheter..." : "Choose a lead ready to buy..."} /></SelectTrigger>
            <SelectContent>
              {readyLeads.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  {lang === "ar" ? "Aucun lead en phase de closing" : "No leads in closing phase"}
                </div>
              )}
              {readyLeads.map(lead => (
                <SelectItem key={lead.id} value={lead.id}>{lead.first_name} {lead.last_name} — {lead.stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedLeadId && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{lang === "ar" ? "WhatsApp du client" : "Client WhatsApp"}</Label>
                <Input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+971 50 123 4567" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{lang === "ar" ? "Email du client" : "Client email"}</Label>
                <Input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com" required />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--dash-muted)/.3)] border border-[hsl(var(--dash-border))]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 dash-muted-text" />
                <span className="text-sm font-medium dash-text">{lang === "ar" ? "Résident aux Émirats ?" : "UAE Resident?"}</span>
              </div>
              <Switch checked={isUaeResident} onCheckedChange={setIsUaeResident} />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold dash-muted-text uppercase tracking-wider">{lang === "ar" ? "Documents requis" : "Required Documents"}</p>
              <FileUploadField label={lang === "ar" ? "Passeport (copie couleur)" : "Passport (color copy)"} file={passportFile} onFileChange={setPassportFile} required />
              {isUaeResident && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FileUploadField label="Emirates ID" file={emiratesIdFile} onFileChange={setEmiratesIdFile} required />
                </motion.div>
              )}
              {isUaeResident && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FileUploadField label={lang === "ar" ? "Visa de résidence" : "Residence Visa"} file={visaFile} onFileChange={setVisaFile} required />
                </motion.div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={submitting || !selectedLeadId}>
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {lang === "ar" ? "Envoi en cours..." : "Submitting..."}</>
              ) : (
                <><FileCheck className="w-4 h-4 mr-2" /> {lang === "ar" ? "Soumettre le dossier KYC" : "Submit KYC File"}</>
              )}
            </Button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

const FileUploadField = ({ label, file, onFileChange, required }: {
  label: string; file: File | null; onFileChange: (f: File | null) => void; required?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium flex items-center gap-1.5">
      <Upload className="w-3.5 h-3.5" />
      {label}
      {required && <span className="text-[hsl(0,72%,60%)]">*</span>}
    </Label>
    <label className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-[hsl(var(--dash-accent))] ${
      file ? "border-[hsl(var(--dash-accent)/.4)] bg-[hsl(var(--dash-accent)/.06)]" : "border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.2)]"
    }`}>
      {file ? (
        <>
          <CheckCircle className="w-4 h-4 text-[hsl(var(--dash-accent))] shrink-0" />
          <span className="text-sm dash-text truncate">{file.name}</span>
        </>
      ) : (
        <>
          <Upload className="w-4 h-4 dash-muted-text shrink-0" />
          <span className="text-sm dash-muted-text">PDF, JPG, PNG (max 10MB)</span>
        </>
      )}
      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => onFileChange(e.target.files?.[0] || null)} />
    </label>
  </div>
);

export default KycUploadForm;
