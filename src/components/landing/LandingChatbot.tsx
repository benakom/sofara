import { useState, useRef, useEffect, useMemo, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ChevronDown, Search } from "lucide-react";
import { z } from "zod";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
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

// The chatbot's "ar" strings are Arabic; the site's Arabic interface language is "arb".
type ChatLang = Exclude<Lang, "arb">;
type T = Record<ChatLang, string>;
const i18n: Record<string, T> = {
  hello: {
    en: "Hi 👋 I'm Sara, Sofara's virtual assistant. Ask me anything about the ambassador program.",
    fr: "Bonjour 👋 Je suis Sara, l'assistante virtuelle de Sofara. Posez-moi votre question sur le programme ambassadeur.",
    es: "Hola 👋 Soy Sara, la asistente virtual de Sofara. Pregúntame lo que quieras sobre el programa de embajadores.",
    ru: "Здравствуйте 👋 Я Сара, виртуальный ассистент Sofara. Задайте вопрос о программе амбассадоров.",
    ar: "مرحباً 👋 أنا سارة، المساعدة الافتراضية لدى Sofara. اسألني عن برنامج السفراء.",
  },
  welcomeBack: {
    en: "Welcome back {name} 👋 What would you like to know?",
    fr: "Ravie de vous revoir {name} 👋 Que souhaitez-vous savoir ?",
    es: "Hola de nuevo {name} 👋 ¿Qué te gustaría saber?",
    ru: "Рада видеть вас снова, {name} 👋 Что вы хотите узнать?",
    ar: "أهلاً بعودتك {name} 👋 ماذا تريد أن تعرف؟",
  },
  askName: {
    en: "Good question, I'll answer it right away. So our team can follow up properly, may I have your first and last name?",
    fr: "Bonne question, j'y réponds tout de suite. Pour que notre équipe puisse bien vous accompagner, puis-je avoir votre prénom et votre nom ?",
    es: "Buena pregunta, te respondo enseguida. Para que nuestro equipo pueda acompañarte bien, ¿me dices tu nombre y apellido?",
    ru: "Хороший вопрос, сейчас отвечу. Чтобы наша команда могла вам помочь, подскажите, пожалуйста, ваши имя и фамилию?",
    ar: "سؤال جيد، سأجيبك فوراً. حتى يتمكن فريقنا من متابعتك بشكل صحيح، هل يمكنني معرفة اسمك الأول واسم العائلة؟",
  },
  askLastName: {
    en: "Thanks {name}! And your last name?",
    fr: "Merci {name} ! Et votre nom de famille ?",
    es: "¡Gracias {name}! ¿Y tu apellido?",
    ru: "Спасибо, {name}! А ваша фамилия?",
    ar: "شكراً {name}! وما اسم العائلة؟",
  },
  askPhone: {
    en: "Nice to meet you {name}. What's your WhatsApp number? We only use it to reply to you.",
    fr: "Enchantée {name}. Quel est votre numéro WhatsApp ? Il sert uniquement à vous répondre.",
    es: "Encantada, {name}. ¿Cuál es tu número de WhatsApp? Solo lo usamos para responderte.",
    ru: "Приятно познакомиться, {name}. Ваш номер WhatsApp? Мы используем его только для ответа вам.",
    ar: "تشرفنا {name}. ما رقم واتساب الخاص بك؟ نستخدمه فقط للرد عليك.",
  },
  askEmail: {
    en: "Perfect. And your email, so we can send you the details?",
    fr: "Parfait. Et votre e-mail, pour vous envoyer les détails ?",
    es: "Perfecto. ¿Y tu email, para enviarte los detalles?",
    ru: "Отлично. И ваш email, чтобы отправить подробности?",
    ar: "ممتاز. وما بريدك الإلكتروني لنرسل لك التفاصيل؟",
  },
  askIntent: {
    en: "Last one: what brings you to Sofara?",
    fr: "Dernière question : qu'est-ce qui vous amène chez Sofara ?",
    es: "Última pregunta: ¿qué te trae a Sofara?",
    ru: "Последний вопрос: что привело вас в Sofara?",
    ar: "سؤال أخير: ما الذي يهمك في Sofara؟",
  },
  intentAmbassador: { en: "Become an ambassador", fr: "Devenir ambassadeur", es: "Ser embajador", ru: "Стать амбассадором", ar: "أن أصبح سفيراً" },
  intentBuy: { en: "Buy property in Dubai", fr: "Acheter à Dubaï", es: "Comprar en Dubái", ru: "Купить в Дубае", ar: "شراء عقار في دبي" },
  intentBoth: { en: "Both", fr: "Les deux", es: "Ambos", ru: "И то и другое", ar: "الاثنان" },
  thanks: {
    en: "Thank you {name}, our team now has your details. Here's my answer:",
    fr: "Merci {name}, notre équipe a bien vos coordonnées. Voici ma réponse :",
    es: "Gracias {name}, nuestro equipo ya tiene tus datos. Esta es mi respuesta:",
    ru: "Спасибо, {name}, наша команда получила ваши данные. Вот мой ответ:",
    ar: "شكراً {name}، وصلت بياناتك إلى فريقنا. إليك إجابتي:",
  },
  badPhone: {
    en: "That number looks incomplete. Could you check it? Digits only, without the country code.",
    fr: "Ce numéro semble incomplet. Pouvez-vous le vérifier ? Uniquement les chiffres, sans l'indicatif.",
    es: "Ese número parece incompleto. ¿Puedes revisarlo? Solo dígitos, sin el prefijo.",
    ru: "Похоже, номер неполный. Проверьте, пожалуйста: только цифры, без кода страны.",
    ar: "يبدو أن الرقم غير مكتمل. هل يمكنك التحقق منه؟ أرقام فقط دون رمز الدولة.",
  },
  badEmail: {
    en: "This email doesn't look right. Could you check it?",
    fr: "Cet e-mail ne semble pas correct. Pouvez-vous le vérifier ?",
    es: "Este email no parece correcto. ¿Puedes revisarlo?",
    ru: "Похоже, email указан с ошибкой. Проверьте, пожалуйста.",
    ar: "يبدو أن البريد الإلكتروني غير صحيح. هل يمكنك التحقق منه؟",
  },
  saveError: {
    en: "Sorry, I couldn't save your details. Please try again in a moment.",
    fr: "Désolée, je n'ai pas pu enregistrer vos coordonnées. Réessayez dans un instant.",
    es: "Lo siento, no pude guardar tus datos. Inténtalo de nuevo en un momento.",
    ru: "Извините, не удалось сохранить данные. Попробуйте чуть позже.",
    ar: "عذراً، لم أتمكن من حفظ بياناتك. حاول مرة أخرى بعد قليل.",
  },
  namePh: { en: "First and last name", fr: "Prénom et nom", es: "Nombre y apellido", ru: "Имя и фамилия", ar: "الاسم الأول واسم العائلة" },
  lastNamePh: { en: "Last name", fr: "Nom", es: "Apellido", ru: "Фамилия", ar: "اسم العائلة" },
  phonePh: { en: "WhatsApp number", fr: "Numéro WhatsApp", es: "Número de WhatsApp", ru: "Номер WhatsApp", ar: "رقم واتساب" },
  emailPh: { en: "Email", fr: "E-mail", es: "Email", ru: "Email", ar: "البريد الإلكتروني" },
  privacy: {
    en: "Your details stay confidential and are only used by the Sofara and Cevitas team.",
    fr: "Vos coordonnées restent confidentielles et ne servent qu'à l'équipe Sofara et Cevitas.",
    es: "Tus datos son confidenciales y solo los usa el equipo de Sofara y Cevitas.",
    ru: "Ваши данные конфиденциальны и используются только командой Sofara и Cevitas.",
    ar: "بياناتك سرية ويستخدمها فريق Sofara وCevitas فقط.",
  },
  searchCountry: { en: "Search country", fr: "Rechercher", es: "Buscar país", ru: "Поиск страны", ar: "ابحث عن الدولة" },
  aiBadge: {
    en: "Virtual assistant · replies in seconds",
    fr: "Assistante virtuelle · répond en quelques secondes",
    es: "Asistente virtual · responde en segundos",
    ru: "Виртуальный ассистент · отвечает за секунды",
    ar: "مساعدة افتراضية · ترد خلال ثوانٍ",
  },
  faqTitle: { en: "Frequently asked questions", fr: "Questions fréquentes", es: "Preguntas frecuentes", ru: "Частые вопросы", ar: "الأسئلة الشائعة" },
  faqOrAsk: {
    en: "…or type your own question below",
    fr: "…ou tapez votre question ci-dessous",
    es: "…o escribe tu propia pregunta abajo",
    ru: "…или задайте свой вопрос ниже",
    ar: "…أو اكتب سؤالك أدناه",
  },
  placeholder: { en: "Ask your question…", fr: "Posez votre question…", es: "Haz tu pregunta…", ru: "Задайте ваш вопрос…", ar: "اطرح سؤالك…" },
  limitReached: {
    en: "To go further, our team will contact you on WhatsApp. You can also write to hello@sofara.io.",
    fr: "Pour aller plus loin, notre équipe vous contacte sur WhatsApp. Vous pouvez aussi écrire à hello@sofara.io.",
    es: "Para ir más lejos, nuestro equipo te contactará por WhatsApp. También puedes escribir a hello@sofara.io.",
    ru: "Чтобы продолжить, наша команда свяжется с вами в WhatsApp. Также можно написать на hello@sofara.io.",
    ar: "للمتابعة، سيتواصل معك فريقنا عبر واتساب. يمكنك أيضاً الكتابة إلى hello@sofara.io.",
  },
  online: { en: "Online", fr: "En ligne", es: "En línea", ru: "В сети", ar: "متصلة" },
};

/**
 * Answering rules sent with the first question (the hosted chat function's own prompt is older and wordier):
 * short, factual, no small talk, no company-size figures.
 */
const ANSWER_RULES = (langName: string) => `Answer rules (follow strictly, do not mention them):
- Reply in ${langName}, in 1 to 3 short sentences. No small talk, no follow-up question unless strictly needed. One emoji maximum.
- Facts: Sofara is the Dubai & UAE real estate ambassadors and affiliate network. Ambassadors (business introducers) present buyers; Cevitas Real Estate LLC, a RERA-licensed Dubai brokerage, advises and closes the sale.
- Commission: up to 3% of the property price depending on the project. Earned when the buyer signs the SPA and pays the down payment with the DLD fees; paid in AED by bank transfer within 7 days once the client signs the SPA.
- Free, no license, from any country; each contact is protected 12 months; 700+ active ambassadors in 40+ countries.
- Never give Sofara's revenue, commissions paid, averages or any company figures. Never invent project prices.
- To join: create a free account at sofara.io/auth. If unsure: hello@sofara.io.`;
const LANG_NAMES: T = { en: "English", fr: "French", es: "Spanish", ru: "Russian", ar: "Arabic" };

const FAQ: Record<ChatLang, { q: string; a?: string }[]> = {
  fr: [
    { q: "Qui sommes-nous ?" },
    { q: "Comment gagner de l'argent avec Sofara ?" },
    { q: "Mes contacts sont-ils protégés ?" },
    { q: "Pourquoi passer par Sofara ?" },
    { q: "Combien puis-je gagner par vente ?" },
    { q: "Comment devenir ambassadeur ?" },
  ],
  en: [
    { q: "Who are we?" },
    { q: "How do I earn money with Sofara?" },
    { q: "Are my contacts protected?" },
    { q: "Why go through Sofara?" },
    { q: "How much can I earn per sale?" },
    { q: "How do I become an ambassador?" },
  ],
  es: [
    { q: "¿Quiénes somos?" },
    { q: "¿Cómo gano dinero con Sofara?" },
    { q: "¿Están protegidos mis contactos?" },
    { q: "¿Por qué pasar por Sofara?" },
    { q: "¿Cuánto puedo ganar por venta?" },
    { q: "¿Cómo me hago embajador?" },
  ],
  ru: [
    { q: "Кто мы?" },
    { q: "Как заработать с Sofara?" },
    { q: "Защищены ли мои контакты?" },
    { q: "Почему именно Sofara?" },
    { q: "Сколько я могу заработать с одной продажи?" },
    { q: "Как стать амбассадором?" },
  ],
  ar: [
    { q: "من نحن؟" },
    { q: "كيف أربح المال مع Sofara؟" },
    { q: "هل عملائي المحتملون محميون؟" },
    { q: "لماذا أمرّ عبر Sofara؟" },
    { q: "كم يمكنني الربح من كل عملية بيع؟" },
    { q: "كيف أصبح سفيراً؟" },
  ],
};


const emailSchema = z.string().trim().email().max(255);

const STORAGE_KEY = "sofara-chatbot-lead";

/** Lead capture happens inside the conversation, one short question at a time, before the first answer. */
type Stage = "idle" | "name" | "lastName" | "phone" | "email" | "intent" | "saving" | "chat";

export default function LandingChatbot() {
  const { lang: uiLang } = useLanguage();
  const lang: ChatLang = uiLang === "arb" ? "ar" : uiLang;
  const L = (k: string, name = "") => (i18n[k][lang] ?? i18n[k].en).replace("{name}", name);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLead, setHasLead] = useState<boolean>(() => {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
  });
  const [leadName, setLeadName] = useState<string>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").first_name || ""; } catch { return ""; }
  });

  const [stage, setStage] = useState<Stage>(hasLead ? "chat" : "idle");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const openedAt = useRef<number>(Date.now());

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [welcomed, setWelcomed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, stage]);

  useEffect(() => {
    if (isOpen && !welcomed) {
      setWelcomed(true);
      openedAt.current = Date.now();
      setMessages([{ role: "assistant", content: hasLead ? L("welcomeBack", leadName) : L("hello") }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, welcomed]);

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

  const say = (...msgs: Msg[]) => setMessages(prev => [...prev, ...msgs]);

  /** Real questions and answers only (no scripted messages): this is what the chat function receives. */
  const qaRef = useRef<Msg[]>([]);

  /** Streams Sara's answer to `question`; the answering rules ride on the first question of the session. */
  const ask = async (question: string) => {
    setIsLoading(true);
    setQuestionCount(prev => prev + 1);
    const isFirst = qaRef.current.length === 0;
    const content = isFirst ? `${ANSWER_RULES(LANG_NAMES[lang] ?? "English")}\n\nQuestion: ${question}` : question;
    const apiMessages = [...qaRef.current, { role: "user" as const, content }].slice(-12);

    let answer = "";
    let placed = false;
    const upsert = (chunk: string) => {
      answer += chunk;
      setMessages(prev => {
        if (!placed) { placed = true; setStreaming(true); return [...prev, { role: "assistant", content: answer }]; }
        return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: answer } : m));
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: apiMessages, lang }),
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
      qaRef.current = [...apiMessages, { role: "assistant", content: answer }];
    } catch {
      upsert("Connection error. Please try again.");
    }
    setStreaming(false);
    setIsLoading(false);
  };

  const saveLead = async (intent: string) => {
    setStage("saving");
    // Bots fill everything instantly; people take a few seconds.
    if (Date.now() - openedAt.current < 4000) { setStage("intent"); return; }
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("chatbot_leads").insert({
        first_name: firstName.slice(0, 100),
        last_name: (lastName || "-").slice(0, 100),
        email: email.trim().slice(0, 255),
        country_code: country.dial,
        phone: phone.replace(/\D/g, ""),
        language: lang,
        // Qualification travels with the source page so the admin sees it next to the lead.
        source_page: `${typeof window !== "undefined" ? window.location.pathname : ""} · ${intent}${pendingQuestion ? ` · Q: ${pendingQuestion.slice(0, 160)}` : ""}`.slice(0, 500),
      });
      if (error) throw error;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ first_name: firstName, ts: Date.now() })); } catch { /* ignore */ }
      setLeadName(firstName);
      setHasLead(true);
      setStage("chat");
      say({ role: "user", content: intent }, { role: "assistant", content: L("thanks", firstName) });
      if (pendingQuestion) await ask(pendingQuestion);
    } catch {
      say({ role: "assistant", content: L("saveError") });
      setStage("intent");
    }
  };

  const handleSend = async (raw: string) => {
    const text = raw.trim();
    if (!text || isLoading || stage === "saving") return;
    setInput("");

    if (stage === "chat") {
      if (questionCount >= MAX_QUESTIONS) {
        say({ role: "user", content: text }, { role: "assistant", content: L("limitReached") });
        return;
      }
      say({ role: "user", content: text });
      await ask(text);
      return;
    }
    if (stage === "idle") {
      setPendingQuestion(text);
      say({ role: "user", content: text }, { role: "assistant", content: L("askName") });
      setStage("name");
      return;
    }
    if (stage === "name") {
      const parts = text.replace(/\s+/g, " ").split(" ");
      const first = parts[0].slice(0, 100);
      const last = parts.slice(1).join(" ").slice(0, 100);
      setFirstName(first);
      setLastName(last);
      say({ role: "user", content: text }, { role: "assistant", content: last ? L("askPhone", first) : L("askLastName", first) });
      setStage(last ? "phone" : "lastName");
      return;
    }
    if (stage === "lastName") {
      setLastName(text.slice(0, 100));
      say({ role: "user", content: text }, { role: "assistant", content: L("askPhone", firstName) });
      setStage("phone");
      return;
    }
    if (stage === "phone") {
      const digits = text.replace(/\D/g, "").replace(/^0+/, "");
      if (digits.length < 6 || digits.length > 15) {
        say({ role: "user", content: text }, { role: "assistant", content: L("badPhone") });
        return;
      }
      setPhone(digits);
      say({ role: "user", content: `${country.dial} ${digits}` }, { role: "assistant", content: L("askEmail") });
      setStage("email");
      return;
    }
    if (stage === "email") {
      if (!emailSchema.safeParse(text).success) {
        say({ role: "user", content: text }, { role: "assistant", content: L("badEmail") });
        return;
      }
      setEmail(text);
      say({ role: "user", content: text }, { role: "assistant", content: L("askIntent") });
      setStage("intent");
    }
  };


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
            <span className="font-extrabold text-[40px] leading-none" style={{ color: BRAND.accent, fontFamily: "var(--font-display, 'Poppins', sans-serif)" }}>S</span>
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
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: "var(--font-display, 'Poppins', sans-serif)", color: BRAND.accent }}>
              Sara
              <span className="text-[8.5px] font-semibold tracking-wide px-1.5 py-0.5 rounded" style={{ background: BRAND.accentFaint, color: BRAND.accent, border: `1px solid ${BRAND.borderAccent}` }}>24/7</span>
            </h3>
            <p className="text-[10px] flex items-center gap-1 truncate" style={{ color: BRAND.textDim }} title={L("aiBadge")}>
              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse shrink-0" style={{ background: BRAND.accent }} />
              <span className="truncate">{L("aiBadge")}</span>
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: BRAND.textDim }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

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

          {(isLoading && !streaming) || stage === "saving" ? (
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
          ) : null}

          {/* FAQ quick picks, before the first question */}
          {(stage === "idle" || (stage === "chat" && !messages.some(m => m.role === "user"))) && !isLoading && (
            <div className="pt-1">
              <p className="text-[10.5px] uppercase tracking-wider mb-2 font-semibold" style={{ color: BRAND.accent }}>{L("faqTitle")}</p>
              <div className="flex flex-wrap gap-1.5">
                {(FAQ[lang] || FAQ.en).map((f, i) => (
                  <button key={i} type="button" onClick={() => handleSend(f.q)}
                    className="text-[12px] px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity text-left"
                    style={{ background: BRAND.bgSoft, border: `1px solid ${BRAND.borderAccent}`, color: BRAND.text }}>
                    {f.q}
                  </button>
                ))}
              </div>
              <p className="text-[10.5px] mt-2 italic" style={{ color: BRAND.textDim }}>{L("faqOrAsk")}</p>
            </div>
          )}

          {/* Visitor's goal, one tap */}
          {stage === "intent" && (
            <div className="flex flex-wrap gap-1.5 pl-8">
              {(["intentAmbassador", "intentBuy", "intentBoth"] as const).map((k) => (
                <button key={k} type="button" onClick={() => saveLead(L(k))}
                  className="text-[12.5px] px-3.5 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: BRAND.accentFaint, border: `1px solid ${BRAND.borderAccent}`, color: BRAND.accent }}>
                  {L(k)}
                </button>
              ))}
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input: adapts to the step (question, name, WhatsApp with country code, email) */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="p-2.5 shrink-0 relative"
          style={{ borderTop: `1px solid ${BRAND.border}`, background: BRAND.bgSoft }}
        >
          {stage === "chat" && questionCount >= MAX_QUESTIONS ? (
            <p className="text-[11px] text-center py-1" style={{ color: BRAND.textDim }}>{L("limitReached")}</p>
          ) : (
            <div className="flex gap-2 items-center">
              {stage === "phone" && (
                <button type="button" onClick={() => setCountryOpen(o => !o)}
                  className="h-9 px-2 rounded-xl flex items-center gap-1 text-[12.5px] shrink-0 hover:bg-white/5 transition-colors"
                  style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text }}
                  aria-haspopup="listbox" aria-expanded={countryOpen} aria-label={L("searchCountry")}>
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="font-medium">{country.dial}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              )}
              <input
                value={input}
                onChange={e => setInput(stage === "phone" ? e.target.value.replace(/[^\d\s]/g, "") : e.target.value)}
                placeholder={stage === "name" ? L("namePh") : stage === "lastName" ? L("lastNamePh") : stage === "phone" ? L("phonePh") : stage === "email" ? L("emailPh") : L("placeholder")}
                type={stage === "email" ? "email" : "text"}
                inputMode={stage === "phone" ? "tel" : stage === "email" ? "email" : "text"}
                autoComplete={stage === "name" ? "name" : stage === "lastName" ? "family-name" : stage === "phone" ? "tel-national" : stage === "email" ? "email" : "off"}
                maxLength={stage === "phone" ? 20 : 300}
                className="flex-1 min-w-0 h-9 px-3.5 rounded-xl text-[13px] focus:outline-none focus:ring-2"
                style={{ background: BRAND.bgInput, border: `1px solid ${BRAND.border}`, color: BRAND.text, "--tw-ring-color": BRAND.accentFaint } as CSSProperties}
                disabled={isLoading || stage === "intent" || stage === "saving"}
              />
              <button type="submit" disabled={isLoading || !input.trim() || stage === "intent" || stage === "saving"}
                className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 shrink-0 hover:opacity-90 transition-opacity"
                style={{ background: BRAND.accent, color: BRAND.bg }} aria-label="Send">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {stage === "phone" && countryOpen && (
            <div className="absolute bottom-14 left-2.5 z-10 w-64 max-h-60 rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{ background: BRAND.bgSoft, border: `1px solid ${BRAND.border}` }}>
              <div className="p-2 shrink-0 flex items-center gap-2" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                <Search className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND.textDim }} />
                <input autoFocus value={countryQuery} onChange={e => setCountryQuery(e.target.value)} placeholder={L("searchCountry")}
                  className="flex-1 min-w-0 bg-transparent text-[12px] focus:outline-none" style={{ color: BRAND.text }} />
              </div>
              <div className="overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                {filteredCountries.map(c => (
                  <button key={c.code} type="button" onClick={() => { setCountry(c); setCountryOpen(false); setCountryQuery(""); }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-[12.5px] hover:bg-white/5 transition-colors" style={{ color: BRAND.text }}>
                    <span className="text-base">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span style={{ color: BRAND.accent }}>{c.dial}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[9px] text-center mt-1.5" style={{ color: BRAND.textDim }}>
            {stage === "chat" || stage === "idle" ? "Powered by Sofara" : L("privacy")}
          </p>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
