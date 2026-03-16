import { useLanguage } from "@/i18n/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title_fr: string; title_en: string; description_fr: string; description_en: string; emoji: string }) => void;
  submitting?: boolean;
}

const CreateChannelDialog = ({ open, onClose, onSubmit, submitting }: Props) => {
  const { lang } = useLanguage();
  const [titleFr, setTitleFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descFr, setDescFr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [emoji, setEmoji] = useState("💬");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFr.trim() || !titleEn.trim()) return;
    onSubmit({ title_fr: titleFr.trim(), title_en: titleEn.trim(), description_fr: descFr.trim(), description_en: descEn.trim(), emoji });
    setTitleFr(""); setTitleEn(""); setDescFr(""); setDescEn(""); setEmoji("💬");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))]">
        <DialogHeader>
          <DialogTitle className="dash-text font-display">
            {lang === "fr" ? "Créer un espace" : "Create a channel"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-[3rem_1fr] gap-2">
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="h-10 text-center text-lg rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] focus:outline-none" maxLength={4} />
            <input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} placeholder="Titre FR" className="h-10 px-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]" required />
          </div>
          <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Title EN" className="w-full h-10 px-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]" required />
          <input value={descFr} onChange={(e) => setDescFr(e.target.value)} placeholder="Description FR" className="w-full h-10 px-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]" />
          <input value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Description EN" className="w-full h-10 px-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]" />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium rounded-lg border border-[hsl(var(--dash-border))] dash-muted-text hover:bg-[hsl(var(--dash-muted))] transition-colors">
              {lang === "fr" ? "Annuler" : "Cancel"}
            </button>
            <button type="submit" disabled={submitting || !titleFr.trim() || !titleEn.trim()} className="px-4 py-2 text-xs font-semibold rounded-lg bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity disabled:opacity-40">
              {submitting ? "..." : lang === "fr" ? "Créer" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;
