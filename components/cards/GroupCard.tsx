"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: any;
  userEmail?: string;
  onAction: (e: React.MouseEvent, id: string, isOwner: boolean) => void;
  onViewLogs: () => void;
}

export function GroupCard({
  group,
  userEmail,
  onAction,
  onViewLogs,
}: GroupCardProps) {
  const isOwner = group.owner?.email === userEmail;

  return (
    <div className="relative font-sans">
      <Link href={`/groups/${group.id}`}>
        <div className="group p-7 border-2 border-border/40 rounded-3xl bg-card hover:border-primary/40 transition-all duration-500 h-[280px] flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-1.5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

          <div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="font-money text-[10px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 tracking-tight">
                ID: {group.inviteCode}
              </span>

              <div className="flex items-center gap-1.5 relative z-20">
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onViewLogs();
                    }}
                    className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                    title="Nhật ký nhóm"
                  >
                    <Activity size={16} />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onAction(e, group.id, isOwner)}
                  className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                >
                  {isOwner ? <Trash2 size={16} /> : <LogOut size={16} />}
                </Button>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase leading-tight tracking-tighter group-hover:text-primary transition-colors line-clamp-2 pr-4">
              {group.name}
            </h3>

            <div className="flex items-center gap-2 mt-3 text-muted-foreground/70">
              {isOwner && <ShieldCheck size={14} className="text-primary/70" />}
              <p className="text-[10px] font-black uppercase tracking-[0.1em]">
                CHỦ: {isOwner ? "BẠN" : group.owner?.username}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between relative z-10">
            <div className="flex -space-x-2.5">
              {group.members.slice(0, 4).map((m: any, i: number) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-muted border-4 border-card flex items-center justify-center text-[11px] font-black uppercase shadow-sm group-hover:border-primary/10 transition-all overflow-hidden"
                  title={m.username}
                >
                  {m.username.charAt(0)}
                </div>
              ))}
              {group.members.length > 4 && (
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground border-4 border-card flex items-center justify-center text-[10px] font-black">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 font-black uppercase text-[9px] tracking-[0.2em] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-3 transition-all duration-500 text-primary">
              TRUY CẬP <ArrowRight size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
