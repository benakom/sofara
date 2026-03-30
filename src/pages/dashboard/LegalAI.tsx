import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUp, Scale, Send, X, FileText, AlertTriangle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-ai-analyze`;

const ACCEPTED_DOCS = [
  "SPA (Sales & Purchase Agreement)",
  "Oqood",
  "MOU (Memorandum of Understanding)",
  "Ejari / Lease contracts",
  "Power of Attorney",
  "NOC (No Objection Certificate)",
  "Title Deeds",
];

const LegalAI = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      toast({ variant: "destructive", title: "Erreur", description: lang === "ar" ? "Seuls les fichiers PDF sont acceptés." : "Only PDF files are accepted." });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Erreur", description: lang === "ar" ? "Fichier trop volumineux (max 20 MB)." : "File too large (max 20 MB)." });
      return;
    }
    setFile(f);
    setAnalysis("");
  }, [lang, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file || isLoading) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      toast({ variant: "destructive", title: "Erreur", description: lang === "ar" ? "Vous devez être connecté." : "You must be logged in." });
      return;
    }

    setIsLoading(true);
    setAnalysis("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);
    formData.append("lang", lang);

    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Error" }));
        toast({ variant: "destructive", title: "Erreur", description: err.error });
        setIsLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) {
              result += c;
              setAnalysis(result);
            }
          } catch { break; }
        }
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: lang === "ar" ? "Impossible de contacter LegalAI." : "Unable to reach LegalAI." });
    }
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--dash-accent))] flex items-center justify-center shadow-lg">
          <Scale className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold dash-text flex items-center gap-2">
            LegalAI
            <span className="text-[10px] font-bold bg-[hsl(var(--dash-accent)/.2)] text-[hsl(var(--dash-accent))] px-2 py-0.5 rounded-full">PRO</span>
          </h1>
          <p className="text-xs dash-muted-text">
            {lang === "ar" ? "Analysez vos contrats immobiliers Dubai & EAU" : "Analyze your Dubai & UAE real estate contracts"}
          </p>
        </div>
      </div>

      {/* Accepted documents info */}
      <div className="rounded-xl border border-[hsl(var(--dash-accent)/.2)] bg-[hsl(var(--dash-accent)/.06)] p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--dash-accent))] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium dash-text mb-1.5">
              {lang === "ar" ? "Documents acceptés (immobilier Dubai & EAU uniquement)" : "Accepted documents (Dubai & UAE real estate only)"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ACCEPTED_DOCS.map(doc => (
                <span key={doc} className="text-[10px] px-2 py-1 rounded-lg bg-[hsl(var(--dash-muted))] dash-muted-text">{doc}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.1)]"
            : file
              ? "border-[hsl(var(--dash-accent)/.4)] bg-[hsl(var(--dash-accent)/.05)]"
              : "border-[hsl(var(--dash-border))] hover:border-[hsl(var(--dash-accent)/.4)] hover:bg-[hsl(var(--dash-accent)/.05)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-[hsl(var(--dash-accent))]" />
            <div className="text-left">
              <p className="text-sm font-medium dash-text">{file.name}</p>
              <p className="text-xs dash-muted-text">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(""); }}
              className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors"
            >
              <X className="w-4 h-4 dash-muted-text" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <FileUp className="w-10 h-10 mx-auto dash-muted-text" />
            <p className="text-sm font-medium dash-text">
              {lang === "ar" ? "Glissez votre PDF ici ou cliquez" : "Drag your PDF here or click"}
            </p>
            <p className="text-xs dash-muted-text">PDF • Max 20 MB</p>
          </div>
        )}
      </div>

      {/* Question + Analyze */}
      {file && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={lang === "ar" ? "Question spécifique (optionnel) : ex. Y a-t-il des pénalités de retard ?" : "Specific question (optional): e.g. Are there late payment penalties?"}
              className="flex-1 h-10 px-4 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)]"
              disabled={isLoading}
            />
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="h-10 px-5 rounded-xl bg-[hsl(var(--dash-accent))] text-black text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {lang === "ar" ? "Analyser" : "Analyze"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Analysis result */}
      <AnimatePresence>
        {(analysis || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4 text-[hsl(var(--dash-accent))]" />
              <h2 className="text-sm font-semibold dash-text">
                {lang === "ar" ? "Analyse juridique" : "Legal analysis"}
              </h2>
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(var(--dash-accent))] ml-auto" />}
            </div>
            {analysis ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-[hsl(var(--dash-fg))] prose-p:text-[hsl(var(--dash-muted-fg))] prose-strong:text-[hsl(var(--dash-accent))] prose-li:text-[hsl(var(--dash-muted-fg))] [&_p]:text-sm [&_li]:text-sm">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm dash-muted-text">
                <Loader2 className="w-4 h-4 animate-spin" />
                {lang === "ar" ? "Analyse en cours…" : "Analyzing…"}
              </div>
            )}

            {analysis && !isLoading && (
              <div className="mt-6 pt-4 border-t border-[hsl(var(--dash-border))]">
                <p className="text-[10px] dash-muted-text leading-relaxed">
                  ⚖️ {lang === "ar"
                    ? "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un avis juridique. Consultez un avocat agréé aux EAU pour toute décision juridique."
                    : "This analysis is provided for informational purposes only and does not constitute legal advice. Consult a UAE-licensed attorney for any legal decisions."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LegalAI;
