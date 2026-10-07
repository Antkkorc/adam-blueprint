"use client";

import { FormEvent, useState } from "react";
import { Bot, Maximize2, Minimize2, Send, X } from "lucide-react";

interface Message { role: "user" | "assistant"; text: string }

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Hi! I can help you compare homes and understand the Botswana property market." }]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;
    setMessage("");
    setMessages((current) => [...current, { role: "user", text }]);
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history: messages }) });
      const result = await response.json() as { text?: string; error?: string };
      setMessages((current) => [...current, { role: "assistant", text: result.text || result.error || "I could not respond right now." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "I could not connect right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && <button type="button" onClick={() => setOpen(true)} aria-label="Open Adam Blueprint assistant" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-950/40 transition-transform hover:scale-105"><Bot className="h-6 w-6" /></button>}
      {open && <section className={`fixed z-50 flex flex-col border border-cyan-400/30 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl ${fullscreen ? "inset-3 rounded-2xl" : "bottom-5 right-5 h-[min(620px,calc(100vh-2rem))] w-[min(390px,calc(100vw-2rem))] rounded-2xl"}`} aria-label="Adam Blueprint assistant">
        <header className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-cyan-300" /><span className="font-bold">Property assistant</span></div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setFullscreen((value) => !value)} aria-label={fullscreen ? "Exit fullscreen" : "Open fullscreen"} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">{fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((item, index) => <div key={`${item.role}-${index}`} className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${item.role === "user" ? "ml-auto bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-200"}`}>{item.text}</div>)}
          {loading && <div className="text-xs text-slate-500">Thinking...</div>}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-800 p-3">
          <input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1200} placeholder="Ask about buying or renting..." className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
          <button type="submit" disabled={loading || !message.trim()} aria-label="Send message" className="rounded-xl bg-cyan-400 px-3 text-slate-950 disabled:opacity-50"><Send className="h-4 w-4" /></button>
        </form>
      </section>}
    </>
  );
}
