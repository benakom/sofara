import { useLanguage } from "@/i18n/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
  submitting?: boolean;
}

const CreatePostDialog = ({ open, onClose, onSubmit, submitting }: Props) => {
  const { lang } = useLanguage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title.trim(), content.trim());
    setTitle("");
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))]">
        <DialogHeader>
          <DialogTitle className="dash-text font-display">
            {lang === "fr" ? "Nouveau post" : "New post"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={lang === "fr" ? "Titre du post" : "Post title"}
            className="w-full h-10 px-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
            maxLength={200}
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={lang === "fr" ? "Contenu de votre message…" : "Write your message…"}
            className="w-full h-32 px-3 py-2.5 rounded-lg bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] resize-none"
            maxLength={5000}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[hsl(var(--dash-border))] dash-muted-text hover:bg-[hsl(var(--dash-muted))] transition-colors"
            >
              {lang === "fr" ? "Annuler" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {submitting ? "..." : lang === "fr" ? "Publier" : "Publish"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
