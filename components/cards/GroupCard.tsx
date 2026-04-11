"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, LogOut, ArrowRight, ShieldCheck, Activity } from "lucide-react";

interface GroupCardProps {
  group: any;
  userEmail?: string;
  onAction: (e: React.MouseEvent, id: string, isOwner: boolean) => void;
  onViewLogs: () => void;
}

export function GroupCard({ group, userEmail, onAction, onViewLogs }: GroupCardProps) {
  const isOwner = group.owner?.email === userEmail;

  return (
    <div className="relative">
      <Link href={`/groups/${group.id}`}>
        <div className="group p-8 border-2 border-border/50 rounded-[2.5rem] bg-card hover:border-primary/30 transition-all duration-300 h-[300px] flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

          <div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1.5 rounded-xl uppercase tracking-widest border border-primary/10">
                MÃ: {group.inviteCode}
              </span>

              <div className="flex items-center gap-2 relative z-20">
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        onViewLogs();
                    }}
                    className="rounded-xl bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    title="Xem nhật ký nhóm"
                  >
                    <Activity size={18} />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onAction(e, group.id, isOwner)}
                  className="rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  {isOwner ? <Trash2 size={18} /> : <LogOut size={18} />}
                </Button>
              </div>
            </div>

            <h3 className="text-3xl font-black uppercase leading-[1.1] tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
              {group.name}
            </h3>

            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
              {isOwner && <ShieldCheck size={14} className="text-primary" />}
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Chủ: {isOwner ? "BẠN" : group.owner?.username}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between relative z-10">
            {/* AVATAR STACK */}
            <div className="flex -space-x-3">
              {group.members.slice(0, 4).map((m: any, i: number) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded-2xl bg-muted border-4 border-card flex items-center justify-center text-[11px] font-black uppercase shadow-sm group-hover:border-primary/10 transition-colors"
                >
                  {m.username.charAt(0)}
                </div>
              ))}
              {group.members.length > 4 && (
                <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground border-4 border-card flex items-center justify-center text-[11px] font-black">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300 text-primary">
              Vào nhóm <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}