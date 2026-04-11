// app/(auth)/layout.tsx
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 overflow-hidden bg-background">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-[440px] z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-card/40 backdrop-blur-2xl border-2 border-border/40 p-8 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* CONTENT */}
          <div className="relative z-10">
            {children}
          </div>
        </div>

        {/* FOOTER INFO (Optional) */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            Homie Finance • Secure Cloud System
          </p>
        </div>
      </div>
    </div>
  );
}