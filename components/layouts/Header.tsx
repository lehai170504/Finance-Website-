"use client";

import { useEffect } from "react";
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
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useProfile();
  const { logout, isLoading: isAuthLoading } = useAuth();
  useRealtimeNotifications();

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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4 lg:gap-12">
          
          {/* MOBILE MENU - Tối ưu lại style cho đẹp */}
          {user && (
            <div className="lg:hidden flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 border-b border-border/50 text-left">
                    <SheetTitle className="flex items-center gap-3">
                      <Image
                        src="/logo-icon.png" 
                        alt="Homie Finance Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                        priority
                      />
                      <div className="flex flex-col leading-none">
                        <span className="font-black text-xl tracking-tighter text-foreground">
                          HOMIE<span className="text-primary">.</span>
                        </span>
                        <span className="text-[9px] font-black tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
                          Finance
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 p-6">
                    {mainNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95",
                          pathname.startsWith(item.href)
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <item.icon size={18} />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* LOGO CHÍNH (DESKTOP/MOBILE) */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <Image
              src="/logo-icon.png"
              alt="Homie Icon"
              width={40}
              height={40}
              className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              priority
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tighter text-foreground">
                HOMIE<span className="text-primary">.</span>
              </span>
              <span className="text-[9px] font-black tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
                Finance
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          {user && (
            <nav className="hidden lg:flex items-center gap-2">
              {mainNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <item.icon size={16} className={cn(isActive && "text-primary")} />
                    {item.name}
                    
                    {isActive && (
                      <span className="absolute -bottom-[20px] left-1/2 w-1/2 -translate-x-1/2 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(0,136,255,0.5)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          {user && <NotificationBell />}
          <ThemeToggle />

          <div className="flex items-center ml-2">
            {isLoading ? (
              <div className="w-10 h-10 bg-muted/50 animate-pulse rounded-full border-2 border-border/50" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full bg-primary/10 text-primary font-black text-lg hover:bg-primary/20 hover:scale-105 transition-all p-0 border border-primary/10"
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 mt-2 rounded-[1.5rem] p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
                >
                  <DropdownMenuLabel className="py-4 px-3 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Tài khoản
                    </span>
                    <span className="text-base font-black tracking-tight truncate text-foreground">
                      {user.username}
                    </span>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-border/50 mx-2" />
                  
                  <div className="p-1 flex flex-col gap-1">
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl py-3 px-3 cursor-pointer font-black text-xs uppercase tracking-wider focus:bg-primary/10 focus:text-primary transition-colors"
                    >
                      <Link href="/profile" className="flex items-center gap-3">
                        <User size={16} /> Hồ sơ cá nhân
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => logout()}
                      disabled={isAuthLoading}
                      className="rounded-xl py-3 px-3 cursor-pointer font-black text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors uppercase text-xs tracking-wider flex items-center gap-3 mt-1"
                    >
                      <LogOut size={16} />
                      {isAuthLoading ? "ĐANG THOÁT..." : "ĐĂNG XUẤT"}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Nút khi chưa đăng nhập
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-5 hover:bg-primary/10 hover:text-primary"
                >
                  <Link href="/login">ĐĂNG NHẬP</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-xl font-black uppercase tracking-widest h-10 px-6 text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <Link href="/register">BẮT ĐẦU</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}