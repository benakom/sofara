import { type LucideIcon } from "lucide-react";

type ChatMode = "general" | "evaluate" | "compare" | "market";

interface ChatModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  modeConfig: Record<ChatMode, { icon: LucideIcon; label: string; color: string }>;
}

export default function ChatModeSelector({ mode, onModeChange, modeConfig }: ChatModeSelectorProps) {
  return (
    <div className="flex gap-1 p-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {(Object.entries(modeConfig) as [ChatMode, typeof modeConfig[ChatMode]][]).map(([key, cfg]) => {
        const Icon = cfg.icon;
        const isActive = mode === key;
        return (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              isActive
                ? `bg-gradient-to-r ${cfg.color} text-white shadow-md`
                : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <Icon className="w-3 h-3" />
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}
