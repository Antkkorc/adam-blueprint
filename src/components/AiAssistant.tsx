"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Maximize2, Minimize2, Send, X } from "lucide-react";

interface Message { role: "user" | "assistant"; text: string; links?: Array<{ label: string; href: string }>; searchLink?: string }

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Hi, I’m your AI assistant. How can I help you with the Adam Blueprint website today?" }]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width: 390, height: 620 });
  const [panelPosition, setPanelPosition] = useState<{ left: number; top: number } | null>(null);
  const [launcherPosition, setLauncherPosition] = useState<{ left: number; top: number } | null>(null);
  const launcherDrag = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number; moved: boolean } | null>(null);
  const launcherWasDragged = useRef(false);
  const panelDrag = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number } | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("adam-blueprint-assistant-position");
    if (!stored) return;
    const restorePosition = () => {
      try {
        const position = JSON.parse(stored) as { left?: unknown; top?: unknown };
        if (typeof position.left === "number" && typeof position.top === "number") {
          setLauncherPosition({
            left: Math.max(8, Math.min(window.innerWidth - 64, position.left)),
            top: Math.max(8, Math.min(window.innerHeight - 64, position.top)),
          });
        }
      } catch {
        window.localStorage.removeItem("adam-blueprint-assistant-position");
      }
    };
    queueMicrotask(restorePosition);
  }, []);

  function startLauncherDrag(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = launcherPosition || { left: rect.left, top: rect.top };
    launcherDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: position.left,
      top: position.top,
      moved: false,
    };
    launcherWasDragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveLauncher(event: PointerEvent<HTMLButtonElement>) {
    const drag = launcherDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) drag.moved = true;
    if (!drag.moved) return;
    launcherWasDragged.current = true;
    const position = {
      left: Math.max(8, Math.min(window.innerWidth - 64, drag.left + deltaX)),
      top: Math.max(8, Math.min(window.innerHeight - 64, drag.top + deltaY)),
    };
    setLauncherPosition(position);
  }

  function endLauncherDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = launcherDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      const position = {
        left: Math.max(8, Math.min(window.innerWidth - 64, drag.left + event.clientX - drag.startX)),
        top: Math.max(8, Math.min(window.innerHeight - 64, drag.top + event.clientY - drag.startY)),
      };
      setLauncherPosition(position);
      window.localStorage.setItem("adam-blueprint-assistant-position", JSON.stringify(position));
    }
    launcherDrag.current = null;
  }

  function openAssistant(event: PointerEvent<HTMLButtonElement>) {
    if (launcherWasDragged.current) {
      event.preventDefault();
      launcherWasDragged.current = false;
      return;
    }
    setOpen(true);
  }

  function startPanelDrag(event: PointerEvent<HTMLElement>) {
    if (fullscreen || (event.target as HTMLElement).closest("button")) return;
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    panelDrag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePanel(event: PointerEvent<HTMLElement>) {
    const drag = panelDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPanelPosition({
      left: Math.max(8, Math.min(window.innerWidth - 308, drag.left + event.clientX - drag.startX)),
      top: Math.max(8, Math.min(window.innerHeight - 368, drag.top + event.clientY - drag.startY)),
    });
  }

  function endPanelDrag(event: PointerEvent<HTMLElement>) {
    if (panelDrag.current?.pointerId === event.pointerId) panelDrag.current = null;
  }

  function resizeAssistant(event: PointerEvent<HTMLButtonElement>, direction: string) {
    event.preventDefault();
    if (fullscreen) return;
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;
    const startLeft = rect.left;
    const startTop = rect.top;
    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const fromWest = direction.includes("w");
      const fromNorth = direction.includes("n");
      const width = Math.min(720, Math.max(300, startWidth + (fromWest ? -dx : direction.includes("e") ? dx : 0)));
      const height = Math.min(820, Math.max(360, startHeight + (fromNorth ? -dy : direction.includes("s") ? dy : 0)));
      setSize({ width, height });
      setPanelPosition({
        left: Math.max(8, Math.min(window.innerWidth - width - 8, fromWest ? startLeft + (startWidth - width) : startLeft)),
        top: Math.max(8, Math.min(window.innerHeight - height - 8, fromNorth ? startTop + (startHeight - height) : startTop)),
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;
    setMessage("");
    setMessages((current) => [...current, { role: "user", text }]);
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history: messages }) });
      const result = await response.json() as { text?: string; error?: string; links?: Array<{ label: string; href: string }>; searchLink?: string };
      setMessages((current) => [...current, { role: "assistant", text: result.text || result.error || "I could not respond right now.", links: result.links, searchLink: result.searchLink }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "I could not connect right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && <button
        type="button"
        onClick={openAssistant}
        onPointerDown={startLauncherDrag}
        onPointerMove={moveLauncher}
        onPointerUp={endLauncherDrag}
        onPointerCancel={endLauncherDrag}
        aria-label="Open Adam Blueprint assistant. Drag to move."
        title="Click to open or drag to move"
        style={launcherPosition ? { left: launcherPosition.left, top: launcherPosition.top } : undefined}
        className={`fixed ${launcherPosition ? "" : "bottom-5 right-5"} z-40 flex h-14 w-14 touch-none items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-950/40 transition-transform hover:scale-105`}
      >
        <Bot className="h-6 w-6" />
      </button>}
      {open && <section style={fullscreen ? undefined : { width: `min(${size.width}px, calc(100vw - 2rem))`, height: `min(${size.height}px, calc(100vh - 2rem))`, ...(panelPosition ? { left: panelPosition.left, top: panelPosition.top } : {}) }} className={`ai-assistant fixed z-50 flex flex-col shadow-2xl backdrop-blur-xl ${fullscreen ? "inset-3 rounded-2xl" : panelPosition ? "rounded-2xl" : "bottom-5 right-5 rounded-2xl"}`} aria-label="Adam Blueprint assistant">
        <header onPointerDown={startPanelDrag} onPointerMove={movePanel} onPointerUp={endPanelDrag} onPointerCancel={endPanelDrag} className="ai-assistant-header flex cursor-move items-center justify-between p-4">
          <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-cyan-400" /><span className="font-bold">Adam Blueprint assistant</span></div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setFullscreen((value) => !value)} aria-label={fullscreen ? "Exit fullscreen" : "Open fullscreen"} className="ai-assistant-icon-button">{fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="ai-assistant-icon-button"><X className="h-4 w-4" /></button>
          </div>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((item, index) => <div key={`${item.role}-${index}`} className={`ai-assistant-message max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${item.role === "user" ? "ai-assistant-user ml-auto" : "ai-assistant-bot"}`}>
            <div>{item.text}</div>
            {item.searchLink && <a href={item.searchLink} target="_blank" rel="noopener noreferrer" className="ai-assistant-result-link mt-2 inline-flex">View all matching properties</a>}
            {item.links && item.links.length > 0 && <div className="mt-2 space-y-1">{item.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="ai-assistant-result-link block">{link.label}</a>)}</div>}
          </div>)}
          {loading && <div className="ai-assistant-muted text-xs">Thinking...</div>}
        </div>
        <div className="px-4 pb-2"><Link href="/contact" className="text-xs font-semibold text-cyan-500 hover:underline">Need a person? Talk to an agent</Link></div>
        <form onSubmit={sendMessage} className="ai-assistant-form flex gap-2 p-3">
          <input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1200} placeholder="Ask about this website..." className="ai-assistant-input min-w-0 flex-1 rounded-xl px-3 py-2 text-sm outline-none" />
          <button type="submit" disabled={loading || !message.trim()} aria-label="Send message" className="rounded-xl bg-cyan-400 px-3 text-slate-950 disabled:opacity-50"><Send className="h-4 w-4" /></button>
        </form>
        {!fullscreen && <>
          <button type="button" aria-label="Resize assistant from the top" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "n")} className="ai-assistant-resize-handle ai-assistant-resize-n" />
          <button type="button" aria-label="Resize assistant from the right" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "e")} className="ai-assistant-resize-handle ai-assistant-resize-e" />
          <button type="button" aria-label="Resize assistant from the bottom" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "s")} className="ai-assistant-resize-handle ai-assistant-resize-s" />
          <button type="button" aria-label="Resize assistant from the left" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "w")} className="ai-assistant-resize-handle ai-assistant-resize-w" />
          <button type="button" aria-label="Resize assistant from the top right corner" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "ne")} className="ai-assistant-resize-handle ai-assistant-resize-ne" />
          <button type="button" aria-label="Resize assistant from the bottom right corner" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "se")} className="ai-assistant-resize-handle ai-assistant-resize-se" />
          <button type="button" aria-label="Resize assistant from the bottom left corner" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "sw")} className="ai-assistant-resize-handle ai-assistant-resize-sw" />
          <button type="button" aria-label="Resize assistant from the top left corner" title="Drag to resize" onPointerDown={(event) => resizeAssistant(event, "nw")} className="ai-assistant-resize-handle ai-assistant-resize-nw" />
        </>}
      </section>}
    </>
  );
}
