import { useState } from "react";
import { Bot, MessageSquare, Target, Building2, FileText, Shield, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const tools = [
  { id: "whatsapp-copilot", name: "WhatsApp Copilot", icon: MessageSquare, desc: "AI assistant for ambassador-lead conversations", uses: 342, avgTime: "2.1s" },
  { id: "qualify-lead", name: "Qualify Lead AI", icon: Target, desc: "BANT scoring and lead qualification", uses: 189, avgTime: "3.2s" },
  { id: "project-matching", name: "Project Matching", icon: Building2, desc: "Match leads with ideal projects", uses: 156, avgTime: "2.8s" },
  { id: "scripts-objections", name: "Scripts & Objections", icon: FileText, desc: "Sales scripts and objection handling", uses: 98, avgTime: "1.9s" },
  { id: "auto-score", name: "Auto Score", icon: Shield, desc: "Automatic lead scoring", uses: 234, avgTime: "1.5s" },
  { id: "voice-agent", name: "Voice Agent", icon: Bot, desc: "AI voice calling assistant", uses: 45, avgTime: "4.1s" },
];

const AdminAIConfig = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Record<string, string>>({
    "whatsapp-copilot": "You are a Dubai real estate expert helping ambassadors respond to their leads. Always respond in the language of the question. Never promise guaranteed returns...",
    "qualify-lead": "You are a lead qualification expert. Analyze the lead based on BANT criteria: Budget, Authority, Need, Timeline...",
    "project-matching": "You are a real estate project matching AI. Given a client profile, suggest the best matching projects from the database...",
    "scripts-objections": "You are a sales training expert. Provide scripts and objection handling for Dubai real estate...",
    "auto-score": "Score leads from A to D based on engagement, budget, and timeline...",
    "voice-agent": "You are a friendly AI voice assistant for Sofara. Help qualify leads over phone...",
  });
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(tools.map(t => [t.id, true]))
  );

  const tool = tools.find(t => t.id === selectedTool);

  return (
    <div className="space-y-6 max-w-[1400px] font-['Inter']">
      <div>
        <h1 className="text-xl font-bold text-[#1A1A1E]">AI Tools Configuration</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Manage AI tools available to Pro ambassadors. Control prompts, knowledge base, and access.</p>
      </div>

      {!selectedTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#D2F34C]/15 flex items-center justify-center">
                  <t.icon className="w-5 h-5 text-[#1A1A1E]" />
                </div>
                <Switch checked={enabled[t.id]} onCheckedChange={v => { setEnabled({ ...enabled, [t.id]: v }); toast({ title: `${t.name} ${v ? "enabled" : "disabled"}` }); }} />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1E]">{t.name}</h3>
              <p className="text-xs text-[#9CA3AF] mt-1">{t.desc}</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#F5F5F7]">
                <span className="text-[10px] text-[#6B7280]"><strong className="text-[#1A1A1E]">{t.uses}</strong> uses/mo</span>
                <span className="text-[10px] text-[#6B7280]">Avg: <strong className="text-[#1A1A1E]">{t.avgTime}</strong></span>
              </div>
              <button
                onClick={() => setSelectedTool(t.id)}
                className="mt-3 w-full py-2 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#1A1A1E] hover:bg-[#F9FAFB] transition-colors"
              >
                Configure →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <button onClick={() => setSelectedTool(null)} className="text-xs font-medium text-[#6B7280] hover:text-[#1A1A1E]">← Back to all tools</button>

          <div className="flex items-center gap-3">
            {tool && <div className="w-10 h-10 rounded-xl bg-[#D2F34C]/15 flex items-center justify-center"><tool.icon className="w-5 h-5 text-[#1A1A1E]" /></div>}
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1E]">{tool?.name}</h2>
              <p className="text-xs text-[#9CA3AF]">{tool?.desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* System Prompt */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-bold text-[#1A1A1E] mb-3">System Prompt</h3>
              <textarea
                value={prompts[selectedTool] || ""}
                onChange={e => setPrompts({ ...prompts, [selectedTool]: e.target.value })}
                rows={12}
                className="w-full rounded-lg border border-[#E5E7EB] p-3 text-xs text-[#1A1A1E] font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50"
              />
              <button onClick={() => toast({ title: "Prompt saved" })} className="mt-3 px-4 py-2 bg-[#D2F34C] text-[#1A1A1E] rounded-lg text-xs font-bold hover:bg-[#BDE040]">
                Save Prompt
              </button>
            </div>

            {/* Test Area */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-bold text-[#1A1A1E] mb-3">Response Preview</h3>
              <textarea
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                rows={3}
                placeholder="Type a test question..."
                className="w-full rounded-lg border border-[#E5E7EB] p-3 text-xs text-[#1A1A1E] resize-none focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50 mb-3"
              />
              <button
                onClick={() => { setTestOutput("This is a simulated AI response based on the current system prompt. In production, this would call the actual AI model."); toast({ title: "Test sent" }); }}
                className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1E] text-white rounded-lg text-xs font-bold hover:bg-[#2C2C2E]"
              >
                <Play className="w-3.5 h-3.5" /> Test Response
              </button>
              {testOutput && (
                <div className="mt-3 p-3 bg-[#F9FAFB] rounded-lg text-xs text-[#6B7280]">
                  {testOutput}
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-[#F5F5F7]">
                <h4 className="text-xs font-bold text-[#1A1A1E] mb-3">Usage Limits</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#6B7280]">Max per day per ambassador</span>
                    <input type="number" defaultValue={50} className="w-16 h-7 px-2 rounded border border-[#E5E7EB] text-xs text-center" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#6B7280]">Max per month per ambassador</span>
                    <input type="number" defaultValue={500} className="w-16 h-7 px-2 rounded border border-[#E5E7EB] text-xs text-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAIConfig;
