import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ChevronDown, Search } from "lucide-react";
import { z } from "zod";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
const avatarImg = "/favicon.png";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/landing-chat`;
const MAX_QUESTIONS = 8;

// Brand tokens
const BRAND = {
  bg: "#0a0a0a",
  bgSoft: "#161616",
  bgInput: "#1f1f1f",
  border: "#2a2a2a",
  borderAccent: "#D3F34B40",
  accent: "#D3F34B",
  accentSoft: "#D3F34Bcc",
  accentDim: "#D3F34B80",
  accentFaint: "#D3F34B33",
  text: "#f5f5f5",
  textDim: "#bdbdbd",
} as const;

type Msg = { role: "user" | "assistant"; content: string };

// Country dial codes with flag emojis (focused on key markets)
const COUNTRIES: { code: string; dial: string; name: string; flag: string }[] = [
  { code: "AE", dial: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", dial: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "ES", dial: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "IT", dial: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "BE", dial: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "CH", dial: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "LU", dial: "+352", name: "Luxembourg", flag: "🇱🇺" },
  { code: "NL", dial: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "MA", dial: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "DZ", dial: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "TN", dial: "+216", name: "Tunisia", flag: "🇹🇳" },
  { code: "EG", dial: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "QA", dial: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", dial: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", dial: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", dial: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "JO", dial: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "LB", dial: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "TR", dial: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "RU", dial: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "IN", dial: "+91", name: "India", flag: "🇮🇳" },
  { code: "PK", dial: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "CN", dial: "+86", name: "China", flag: "🇨🇳" },
  { code: "SG", dial: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "BR", dial: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", dial: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", dial: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
];

const i18n: Record<string, Record<Lang, string>> = {
  formIntro: {
    en: "Before we chat, please share a few details so our team can follow up.",
    fr: "Avant de discuter, partagez quelques infos pour qu'on puisse vous recontacter.",
    es: "Antes de chatear, comparte algunos datos para que podamos contactarte.",
    ru: "Прежде чем начать, поделитесь данными, чтобы мы могли с вами связаться.",
    ar: "Before we chat, please share a few details so our team can follow up.",
  },
  firstName: { en: "First name", fr: "Prénom", es: "Nombre", ru: "Имя", ar: "First name" },
  lastName: { en: "Last name", fr: "Nom", es: "Apellido", ru: "Фамилия", ar: "Last name" },
  email: { en: "Email", fr: "Email", es: "Email", ru: "Email", ar: "Email" },
  phone: { en: "Phone number", fr: "Téléphone", es: "Teléfono", ru: "Телефон", ar: "Phone number" },
  startChat: { en: "Start chat", fr: "Démarrer le chat", es: "Iniciar chat", ru: "Начать чат", ar: "Start chat" },
  searchCountry: { en: "Search country", fr: "Rechercher", es: "Buscar país", ru: "Поиск страны", ar: "Search country" },
  privacy: {
    en: "By continuing you accept our privacy policy.",
    fr: "En continuant vous acceptez notre politique de confidentialité.",
    es: "Al continuar aceptas nuestra política de privacidad.",
    ru: "Продолжая, вы принимаете нашу политику конфиденциальности.",
    ar: "By continuing you accept our privacy policy.",
  },
  welcome: {
    en: "Hi {name}! I'm Sara, your Sofara assistant 👋 Ask me anything about investing in Dubai or the ambassador program.",
    fr: "Bonjour {name} ! Je suis Sara, votre assistante Sofara 👋 Posez-moi vos questions sur l'investissement à Dubaï ou le programme ambassadeur.",
    es: "¡Hola {name}! Soy Sara, tu asistente Sofara 👋 Pregúntame lo que quieras sobre invertir en Dubái o el programa de embajadores.",
    ru: "Привет, {name}! Я Сара, ваша помощница Sofara 👋 Спрашивайте что угодно об инвестициях в Дубае или программе амбассадоров.",
    ar: "Hi {name}! I'm Sara, your Sofara assistant 👋 Ask me anything about investing in Dubai or the ambassador program.",
  },
  placeholder: {
    en: "Ask your question…",
    fr: "Posez votre question…",
    es: "Haz tu pregunta…",
    ru: "Задайте ваш вопрос…",
    ar: "Ask your question…",
  },
  limitReached: {
    en: "You've reached the question limit for this session. Contact us at hello@sofara.io to continue the conversation!",
    fr: "Vous avez atteint la limite de questions pour cette session. Contactez-nous à hello@sofara.io pour continuer !",
    es: "Has alcanzado el límite de preguntas de esta sesión. ¡Contáctanos en hello@sofara.io para continuar!",
    ru: "Вы достигли лимита вопросов для этой сессии. Напишите нам на hello@sofara.io, чтобы продолжить!",
    ar: "You've reached the question limit for this session. Contact us at hello@sofara.io to continue the conversation!",
  },
  online: { en: "Online", fr: "En ligne", es: "En línea", ru: "В сети", ar: "Online" },
  required: { en: "Required", fr: "Requis", es: "Requerido", ru: "Обязательно", ar: "Required" },
  invalidEmail: { en: "Invalid email", fr: "Email invalide", es: "Email inválido", ru: "Неверный email", ar: "Invalid email" },
  invalidPhone: { en: "Invalid phone", fr: "Téléphone invalide", es: "Teléfono inválido", ru: "Неверный телефон", ar: "Invalid phone" },
};

const leadSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^\d{6,15}$/),
});

const STORAGE_KEY = "sofara-chatbot-lead";

export default function LandingChatbot() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasLead, setHasLead] = useState<boolean>(() => !!localStorage.getItem(STORAGE_KEY));
  const [leadName, setLeadName] = useState<string>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").first_name || ""; } catch { return ""; }
  });

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Anti-bot: honeypot field + minimum time-to-submit
  const [honeypot, setHoneypot] = useState("");
  const formMountedAt = useRef<number>(Date.now());

  // Chat state
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [welcomed, setWelcomed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Welcome message after lead is captured
  useEffect(() => {
    if (isOpen && hasLead && !welcomed) {
      setWelcomed(true);
      setTimeout(() => {
        setMessages([{ role: "assistant", content: i18n.welcome[lang].replace("{name}", leadName || "") }]);
      }, 300);
    }
  }, [isOpen, hasLead, welcomed, lang, leadName]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setCountryOpen(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q));
  }, [countryQuery]);

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    // Anti-bot: silently drop if honeypot filled or form submitted too fast (< 1.5s)
    if (honeypot.trim() !== "" || Date.now() - formMountedAt.current < 1500) {
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setFormError(i18n.required[lang]); }, 800);
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    const parsed = leadSchema.safeParse({
      first_name: firstName, last_name: lastName, email, phone: cleanPhone,
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue.path[0] === "email") setFormError(i18n.invalidEmail[lang]);
      else if (issue.path[0] === "phone") setFormError(i18n.invalidPhone[lang]);
      else setFormError(i18n.required[lang]);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("chatbot_leads").insert({
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        country_code: country.dial,
        phone: parsed.data.phone,
        language: lang,
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
      });
      if (error) throw error;
      const payload = { first_name: parsed.data.first_name, ts: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLeadName(parsed.data.first_name);
      setHasLead(true);
    } catch {
      setFormError("Could not save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (questionCount >= MAX_QUESTIONS) {
      setMessages(prev => [...prev, { role: "user", content: text.trim() }, { role: "assistant", content: i18n.limitReached[lang] }]);
      setInput("");
      return;
    }
    const userMsg: Msg = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    setQuestionCount(prev => prev + 1);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user")
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: updated }),
      });
      if (!resp.ok) { upsert("Sorry, something went wrong. Please try again."); setIsLoading(false); return; }
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
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
            if (c) upsert(c);
          } catch { /* skip */ }
        }
      }
    } catch {
      upsert("Connection error. Please try again.");
    }
    setIsLoading(false);
  };

  const limitReached = questionCount >= MAX_QUESTIONS;

  /* ── Collapsed bubble ── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative">
          <div className="absolute -inset-2 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" style={{ background: `radial-gradient(circle, ${BRAND.accent} 0%, transparent 70%)` }} />
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: `2px solid ${BRAND.accent}` }} />
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
            style={{ background: BRAND.bg, border: `2px solid ${BRAND.accent}`, boxShadow: `0 0 16px ${BRAND.accent}40, 0 0 4px ${BRAND.accent}60 inset` }}
          >
            <img src={avatarImg} alt="Sofara" className="w-9 h-9 object-contain" />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2" style={{ background: BRAND.accent, borderColor: BRAND.bg }} />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full animate-ping opacity-60" style={{ background: BRAND.accent }} />
        </div>
      </button>
    );
  }

  /* ── Expanded chat window ── */
  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[560px] max-h-[calc(100dvh-5rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: BRAND.bg, border: `1px solid ${BRAND.border}`, fontFamily: "var(--font-body, 'Poppins', sans-serif)" }}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: BRAND.bgSoft, borderBottom: `1px solid ${BRAND.border}` }}>
          <img src={avatarImg} alt="Sara" className="w-9 h-9 rounded-full object-cover" style={{ border: `1px solid ${BRAND.borderAccent}` }} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-display, 'Poppins', sans-serif)", color: BRAND.accent }}>Sara</h3>
            <p className="text-[10px] flex items-center gap-1" style={{ color: BRAND.textDim }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: BRAND.accent }} />
              {i18n.online[lang]}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: BRAND.textDim }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Lead capture form (always shown first) ── */}
        {!hasLead ? (
          <form onSubmit={submitLead} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }} autoComplete="off">
            {/* Honeypot — hidden from humans, irresistible to bots */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="website-url">Website</label>
              <input
                id="website-url" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={e => setHoneypot(e.target.value)}
              />
            </div>
            <div className="flex items-start gap-2 mb-1">
              <img src={avatarImg} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" style={{ border: `1px solid ${BRAND.borderAccent}` }} />
              <div className="rounded-2xl rounded-bl-sm px-3 py-2 text-[12.5px] leading-snug" style={{ background: BRAND.bgSoft, border: `1px solid ${BRAND.border}`, color: BRAND.text }}>
                {i18n.formIntro[lang]}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                value={firstName} onChange={e => setFirstName(e.target.value)} required maxLength={100}
                placeholder={i18n.firstName[lang]}
                className="h-10 px-3 rounded-xl text-[13px] focus:outline-none focus:ring-2"
                style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text, ["--tw-ring-color" as any]: BRAND.accentFaint }}
              />
              <input
                value={lastName} onChange={e => setLastName(e.target.value)} required maxLength={100}
                placeholder={i18n.lastName[lang]}
                className="h-10 px-3 rounded-xl text-[13px] focus:outline-none focus:ring-2"
                style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text, ["--tw-ring-color" as any]: BRAND.accentFaint }}
              />
            </div>

            <input
              value={email} onChange={e => setEmail(e.target.value)} required type="email" maxLength={255}
              placeholder={i18n.email[lang]}
              className="w-full h-10 px-3 rounded-xl text-[13px] focus:outline-none focus:ring-2"
              style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text, ["--tw-ring-color" as any]: BRAND.accentFaint }}
            />

            {/* Phone with country dial code */}
            <div className="relative flex gap-2">
              <button
                type="button"
                onClick={() => setCountryOpen(o => !o)}
                className="h-10 px-2.5 rounded-xl flex items-center gap-1.5 text-[13px] shrink-0 hover:bg-white/5 transition-colors"
                style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text }}
                aria-haspopup="listbox" aria-expanded={countryOpen}
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span className="font-medium">{country.dial}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                required inputMode="tel" maxLength={20}
                placeholder={i18n.phone[lang]}
                className="flex-1 min-w-0 h-10 px-3 rounded-xl text-[13px] focus:outline-none focus:ring-2"
                style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text, ["--tw-ring-color" as any]: BRAND.accentFaint }}
              />

              {countryOpen && (
                <div className="absolute top-11 left-0 z-10 w-64 max-h-60 rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{ background: BRAND.bgSoft, border: `1px solid ${BRAND.border}` }}>
                  <div className="p-2 shrink-0 flex items-center gap-2" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                    <Search className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND.textDim }} />
                    <input
                      autoFocus
                      value={countryQuery}
                      onChange={e => setCountryQuery(e.target.value)}
                      placeholder={i18n.searchCountry[lang]}
                      className="flex-1 min-w-0 bg-transparent text-[12px] focus:outline-none"
                      style={{ color: BRAND.text }}
                    />
                  </div>
                  <div className="overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                    {filteredCountries.map(c => (
                      <button
                        key={c.code} type="button"
                        onClick={() => { setCountry(c); setCountryOpen(false); setCountryQuery(""); }}
                        className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-[12.5px] hover:bg-white/5 transition-colors"
                        style={{ color: BRAND.text }}
                      >
                        <span className="text-base">{c.flag}</span>
                        <span className="flex-1 truncate">{c.name}</span>
                        <span style={{ color: BRAND.accent }}>{c.dial}</span>
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <p className="px-3 py-3 text-[12px] text-center" style={{ color: BRAND.textDim }}>—</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <p className="text-[11.5px]" style={{ color: "#ff7676" }}>{formError}</p>
            )}

            <button
              type="submit" disabled={submitting}
              className="w-full h-10 rounded-xl font-semibold text-[13px] transition-opacity disabled:opacity-50 hover:opacity-90"
              style={{ background: BRAND.accent, color: BRAND.bg }}
            >
              {submitting ? "…" : i18n.startChat[lang]}
            </button>

            <p className="text-[10px] text-center" style={{ color: BRAND.textDim }}>{i18n.privacy[lang]}</p>
          </form>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex min-w-0 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <img src={avatarImg} alt="Sara" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0" style={{ border: `1px solid ${BRAND.borderAccent}` }} />
                  )}
                  <div
                    className={`max-w-[85%] min-w-0 rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                    style={msg.role === "user"
                      ? { background: BRAND.accent, color: BRAND.bg, fontWeight: 500 }
                      : { background: BRAND.bgSoft, border: `1px solid ${BRAND.border}`, color: BRAND.text }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-xs max-w-none break-words [&_p]:text-[13px] [&_p]:my-0.5 [&_li]:text-[13px] [&_li]:my-0 [&_strong]:text-[#D3F34B] [&_a]:text-[#D3F34B] [&_a]:underline">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <img src={avatarImg} alt="Sara" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0" />
                  <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: BRAND.bgSoft, border: `1px solid ${BRAND.border}` }}>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: BRAND.accent, animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: BRAND.accentDim, animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: BRAND.accent, animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="p-2.5 shrink-0"
              style={{ borderTop: `1px solid ${BRAND.border}`, background: BRAND.bgSoft }}
            >
              {limitReached ? (
                <p className="text-[11px] text-center py-1" style={{ color: BRAND.textDim }}>
                  {i18n.limitReached[lang]}
                </p>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={i18n.placeholder[lang]}
                    className="flex-1 min-w-0 h-9 px-3.5 rounded-xl text-[13px] focus:outline-none focus:ring-2"
                    style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text, ["--tw-ring-color" as any]: BRAND.accentFaint }}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 shrink-0 hover:opacity-90 transition-opacity"
                    style={{ background: BRAND.accent, color: BRAND.bg }}
                    aria-label="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[9px] text-center mt-1.5" style={{ color: BRAND.textDim }}>Powered by Sofara</p>
            </form>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
