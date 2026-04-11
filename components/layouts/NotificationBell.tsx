"use client";

import { Bell, Trash2, CheckCheck, Inbox } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markReadAll,
    markRead,
    deleteNotes,
  } = useNotifications();

  const handleDeleteRead = () => {
    const readIds = notifications
      .filter((n: any) => n.read)
      .map((n: any) => n.id);

    if (readIds.length > 0) {
      deleteNotes(readIds);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-border/20 shadow-sm"
        >
          <Bell
            size={18}
            strokeWidth={2.5}
            className="text-muted-foreground group-hover:text-primary"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black font-money flex items-center justify-center rounded-lg border-2 border-background shadow-lg animate-in zoom-in duration-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-85 p-0 rounded-[1.5rem] shadow-2xl border-border/40 bg-background/95 backdrop-blur-2xl overflow-hidden font-sans mt-2"
      >
        {/* HEADER */}
        <div className="p-4 px-5 border-b border-border/40 flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-2">
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-foreground/70">
              Thông báo
            </h4>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md border border-primary/10 animate-pulse">
                {unreadCount} MỚI
              </span>
            )}
          </div>

          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markReadAll()}
                className="h-7 px-3 rounded-lg text-[9px] font-black uppercase text-primary hover:bg-primary/10 flex items-center gap-1.5 transition-all"
              >
                <CheckCheck size={12} strokeWidth={3} /> Đọc hết
              </Button>
            )}
          </div>
        </div>

        {/* LIST AREA */}
        <ScrollArea className="h-85">
          {isLoading ? (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 animate-pulse">
                Đang kiểm tra...
              </span>
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((n: any) => {
                const date = n.createdAt.endsWith("Z")
                  ? parseISO(n.createdAt)
                  : parseISO(`${n.createdAt}Z`);

                const timeAgo = formatDistanceToNow(date, {
                  addSuffix: true,
                  locale: vi,
                }).replace("khoảng ", "");

                return (
                  <div
                    key={n.id}
                    className={cn(
                      "relative p-5 border-b border-border/30 last:border-0 hover:bg-muted/40 cursor-pointer transition-all group",
                      !n.read &&
                        "bg-primary/[0.03] border-l-[3px] border-l-primary",
                    )}
                    onClick={() => !n.read && markRead([n.id])}
                  >
                    <p
                      className={cn(
                        "text-[12px] leading-relaxed mb-2 pr-6 transition-all",
                        !n.read
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground/80",
                      )}
                    >
                      {n.message}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-black text-muted-foreground/40 font-money tracking-tight">
                        {timeAgo}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotes([n.id]);
                      }}
                      className="absolute top-5 right-3 p-1.5 opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title="Xóa"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
              <Inbox size={48} strokeWidth={1} />
              <span className="font-black uppercase tracking-[0.3em] text-[10px]">
                Trống không
              </span>
            </div>
          )}
        </ScrollArea>

        {/* FOOTER */}
        <div className="p-3 px-5 border-t border-border/40 bg-muted/20 flex justify-between items-center">
          <p className="text-[9px] font-black uppercase text-muted-foreground/40 font-money">
            {notifications.length} LỊCH SỬ
          </p>
          {notifications.some((n: any) => n.read) && (
            <button
              onClick={handleDeleteRead}
              className="text-[9px] font-black uppercase text-destructive/60 hover:text-destructive hover:underline transition-all underline-offset-4"
            >
              Dọn dẹp thông báo cũ
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
