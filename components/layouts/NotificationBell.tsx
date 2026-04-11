"use client";

import { Bell, Trash2, CheckCheck } from "lucide-react";
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
          className="relative rounded-full hover:bg-primary/10"
        >
          <Bell size={20} className="text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-background px-1 shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 rounded-2xl shadow-2xl border-2 overflow-hidden"
      >
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">
            Thông báo
          </h4>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markReadAll()}
                className="h-7 px-2 text-[9px] font-black uppercase text-primary hover:bg-primary/10 flex items-center gap-1 transition-all"
              >
                <CheckCheck size={12} /> Đọc hết
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="py-20 text-center animate-pulse text-[10px] font-bold uppercase text-muted-foreground">
              Đang tải...
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
                      "relative p-4 border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-all group",
                      !n.read && "bg-primary/5 border-l-2 border-l-primary",
                    )}
                    onClick={() => !n.read && markRead([n.id])}
                  >
                    <p
                      className={cn(
                        "text-[11px] leading-snug mb-1 pr-8 transition-all",
                        !n.read
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground",
                      )}
                    >
                      {n.message}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-black text-muted-foreground/60">
                        {timeAgo}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotes([n.id]);
                      }}
                      className="absolute top-4 right-2 p-1.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      title="Xóa thông báo này"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
              Trống không...
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t bg-muted/10 flex justify-between items-center px-4">
          <p className="text-[8px] font-black uppercase text-muted-foreground/50">
            {notifications.length} thông báo
          </p>
          {notifications.some((n: any) => n.read) && (
            <button
              onClick={handleDeleteRead}
              className="text-[8px] font-black uppercase text-destructive hover:underline transition-all"
            >
              Xóa tất cả đã đọc
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
