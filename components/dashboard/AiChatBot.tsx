"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, X, Send, Bot, User, MessageCircle } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Chào homie! Tôi là Trợ lý tài chính AI. Bạn cần tôi tư vấn gì không?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await aiService.chat(userMsg);
      setMessages(prev => [...prev, { role: "ai", content: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Lỗi rồi homie ơi, tôi không kết nối được với bộ não trung tâm!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* KHUNG CHAT */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-background border-2 border-primary/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-5 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Homie AI Advisor</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Đang trực tuyến</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/20 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === "ai" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-xs font-medium leading-relaxed max-w-[80%] shadow-sm",
                  msg.role === "ai" ? "bg-white border border-border/40 text-foreground" : "bg-primary text-white"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center animate-bounce">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-border/40 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/40 bg-background">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Hỏi AI bất cứ điều gì..."
                className="w-full pl-5 pr-12 py-3.5 bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm transition-all outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NÚT BẤM MỞ CHAT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative",
          isOpen ? "bg-rose-500 rotate-90" : "bg-primary"
        )}
      >
        {isOpen ? <X size={28} strokeWidth={3} /> : (
          <>
            <MessageCircle size={28} strokeWidth={2.5} className="group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-4 border-background rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-4 border-background rounded-full" />
          </>
        )}
      </button>
    </div>
  );
}
