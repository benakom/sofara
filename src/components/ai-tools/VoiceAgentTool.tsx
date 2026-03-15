import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

export default function VoiceAgentTool() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const speakText = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    setIsSpeaking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text: text.substring(0, 500) }),
      });

      if (!resp.ok) throw new Error("TTS failed");

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch (e) {
      console.error("TTS error:", e);
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  const sendToAI = useCallback(async (text: string) => {
    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsProcessing(true);

    let assistantText = "";
    const upsertAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantText } : m));
        }
        return [...prev, { role: "assistant", content: assistantText }];
      });
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: updated }),
      });

      if (!resp.ok) throw new Error("AI failed");
      if (!resp.body) throw new Error("No body");

      const reader = resp.body.getReader();
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
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsertAssistant(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      // Speak the response
      if (assistantText) speakText(assistantText);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Erreur", description: "Connexion échouée." });
    }
    setIsProcessing(false);
  }, [messages, speakText, toast]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: "destructive", title: "Erreur", description: lang === "fr" ? "Reconnaissance vocale non supportée par ce navigateur." : "Speech recognition not supported." });
      return;
    }

    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "fr" ? "fr-FR" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
      if (event.results[0].isFinal) {
        setIsListening(false);
        setTranscript("");
        if (t.trim()) sendToAI(t.trim());
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [lang, sendToAI, toast]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold dash-text">
              {lang === "fr" ? "Voice Agent SofarAI" : "SofarAI Voice Agent"}
            </h2>
            <p className="text-[10px] dash-muted-text">
              {lang === "fr" ? "Parlez, SofarAI vous répond à voix haute" : "Speak, SofarAI answers out loud"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-lg transition-colors ${voiceEnabled ? "bg-sky-100 text-sky-600" : "bg-gray-100 text-gray-400"}`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl bg-[hsl(var(--dash-muted)/.3)] border border-[hsl(var(--dash-border))] p-4 space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4 animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-sm font-semibold dash-text mb-1">
              {lang === "fr" ? "Appuyez sur le micro pour parler" : "Press the mic to speak"}
            </h3>
            <p className="text-xs dash-muted-text max-w-xs">
              {lang === "fr"
                ? "SofarAI vous répondra à voix haute grâce à la technologie ElevenLabs"
                : "SofarAI will answer out loud using ElevenLabs technology"}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5 ${isSpeaking && i === messages.length - 1 ? "animate-pulse" : ""}`}>
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-[hsl(var(--primary))] text-white rounded-br-md"
                : "bg-white border border-[hsl(var(--dash-border))] dash-text rounded-bl-md"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 dash-muted-text" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            </div>
          </div>
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mb-3 px-4 py-2 rounded-lg bg-sky-50 border border-sky-200">
          <p className="text-xs text-sky-700 italic">🎤 {transcript}</p>
        </div>
      )}

      {/* Mic Button */}
      <div className="flex justify-center">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? "bg-red-500 hover:bg-red-600 scale-110"
              : "bg-gradient-to-br from-sky-500 to-blue-600 hover:scale-105"
          } text-white disabled:opacity-40 shadow-lg`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
              <span className="absolute -inset-2 rounded-full border-2 border-red-300 animate-pulse" />
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] dash-muted-text mt-2 text-center">
        {isListening
          ? (lang === "fr" ? "🔴 Écoute en cours… Parlez maintenant" : "🔴 Listening… Speak now")
          : isSpeaking
          ? (lang === "fr" ? "🔊 SofarAI parle…" : "🔊 SofarAI is speaking…")
          : (lang === "fr" ? "Appuyez pour parler à SofarAI" : "Press to talk to SofarAI")}
      </p>
    </div>
  );
}
