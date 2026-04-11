"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  Users,
  BarChart3,
  User,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useProfile();
  const { logout, isLoading: isAuthLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useRealtimeNotifications();

  // Hiệu ứng đổi màu header khi cuộn chuột
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNav = [
    { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Giao dịch", href: "/transactions", icon: ReceiptText },
    { name: "Ví tiền", href: "/wallets", icon: Wallet },
    { name: "Nhóm", href: "/groups", icon: Users },
    { name: "Báo cáo", href: "/reports", icon: BarChart3 },
  ];

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_sync") {
        if (e.newValue?.startsWith("logout")) {
          queryClient.clear();
          router.push("/login");
        } else if (e.newValue?.startsWith("login")) {
          queryClient.invalidateQueries({ queryKey: ["user_profile"] });
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router, queryClient]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "h-16 bg-background/80 backdrop-blur-xl border-border/60 shadow-lg shadow-black/5"
          : "h-[80px] bg-background border-transparent",
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4 lg:gap-10">
          {/* MOBILE MENU */}
          {user && (
            <div className="lg:hidden flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <Menu size={22} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] p-0 border-r-border/40 font-sans"
                >
                  <SheetHeader className="p-8 border-b border-border/40 text-left bg-muted/20">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                        <Image
                          src="/logo-icon.png"
                          alt="Logo"
                          width={32}
                          height={32}
                          className="invert brightness-0"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter uppercase leading-none">
                          Homie.
                        </span>
                        <span className="text-[8px] font-black tracking-[0.3em] uppercase text-muted-foreground">
                          Finance
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 p-6">
                    {mainNav.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                          )}
                        >
                          <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* LOGO CHÍNH */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Image
                src="/logo-icon.png"
                alt="Homie"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none pt-1">
              <span className="font-black text-2xl tracking-tighter uppercase text-foreground">
                HOMIE<span className="text-primary">.</span>
              </span>
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-muted-foreground ml-0.5">
                Finance
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl border border-border/20">
              {mainNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 overflow-hidden",
                      isActive
                        ? "text-primary bg-background shadow-sm border border-border/50"
                        : "text-muted-foreground/70 hover:text-primary hover:bg-background/50",
                    )}
                  >
                    <item.icon size={15} strokeWidth={isActive ? 3 : 2.5} />
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary animate-in slide-in-from-left duration-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            {user && <NotificationBell />}
            <ThemeToggle />
          </div>

          <div className="flex items-center pl-3 border-l border-border/50">
            {isLoading ? (
              <div className="w-10 h-10 bg-muted/60 animate-pulse rounded-2xl border-2 border-border/20" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group h-11 px-2 pr-4 rounded-2xl bg-muted/40 hover:bg-primary/5 transition-all border border-border/20 gap-3"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Homie
                      </span>
                      <span className="text-xs font-bold text-foreground flex items-center gap-1">
                        {user.username}{" "}
                        <ChevronDown size={12} className="opacity-50" />
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 mt-3 rounded-[1.5rem] p-2 bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl animate-in zoom-in-95 duration-200"
                >
                  <DropdownMenuLabel className="py-5 px-4 flex flex-col gap-1.5">
                    <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em]">
                      Tài khoản hệ thống
                    </span>
                    <span className="text-base font-black tracking-tight truncate flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {user.username}
                    </span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border/40 mx-2" />

                  <div className="p-1 space-y-1">
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl py-3 px-4 font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary cursor-pointer transition-colors"
                    >
                      <Link href="/profile" className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <User size={16} />
                        </div>
                        Hồ sơ cá nhân
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => logout()}
                      disabled={isAuthLoading}
                      className="rounded-xl py-3 px-4 font-black text-[10px] uppercase tracking-widest text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer transition-colors flex items-center gap-4"
                    >
                      <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                        <LogOut size={16} />
                      </div>
                      {isAuthLoading ? "ĐANG THOÁT..." : "ĐĂNG XUẤT"}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-5 hover:bg-primary/5"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-xl font-black uppercase tracking-widest h-10 px-6 text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Link href="/register">Bắt đầu ngay</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
