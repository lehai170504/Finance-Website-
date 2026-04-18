"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/auth";
import { toast } from "sonner";

interface TwoFactorFormProps {
  user?: UserProfile;
}

export function TwoFactorForm({ user }: TwoFactorFormProps) {
  const { setup2FA, confirm2FA, disable2FA } = useAuth();

  const [view, setView] = useState<"idle" | "setup" | "disable">("idle");
  const [qrUrl, setQrUrl] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const isEnabled = user?.is2faEnabled;

  // 🔥 BẢO HIỂM: Tự động reset view nếu trạng thái 2FA bị thay đổi từ bên ngoài hoặc sau khi mutate thành công
  useEffect(() => {
    if (isEnabled && view === "setup") {
      setView("idle");
      setCode("");
    }
    if (!isEnabled && view === "disable") {
      setView("idle");
      setPassword("");
    }
  }, [isEnabled, view]);

  const handleStartSetup = () => {
    if (isEnabled) {
      toast.error("Homie ơi, ông đã bật 2FA rồi mà!");
      return;
    }
    setup2FA.mutate(undefined, {
      onSuccess: (res) => {
        setQrUrl(res.data);
        setView("setup");
      },
    });
  };

  const handleConfirmSetup = (e: React.FormEvent) => {
    e.preventDefault();
    confirm2FA.mutate(parseInt(code), {
      onSuccess: () => {
        // Không cần setView("idle") ở đây nữa vì useEffect ở trên sẽ tự bắt sóng isEnabled thay đổi và làm việc đó
        setCode("");
      },
    });
  };

  const handleConfirmDisable = (e: React.FormEvent) => {
    e.preventDefault();
    disable2FA.mutate(password, {
      onSuccess: () => {
        setPassword("");
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* TRẠNG THÁI HIỆN TẠI */}
      <div
        className={`p-6 rounded-3xl border-2 transition-all duration-500 ${isEnabled ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/20 border-border/40"}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-2xl transition-colors duration-500 ${isEnabled ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-muted-foreground/20 text-muted-foreground"}`}
          >
            {isEnabled ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-foreground">
              Bảo vệ 2 Lớp (2FA)
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-wider mt-1 opacity-70">
              Trạng thái:{" "}
              <span
                className={isEnabled ? "text-emerald-500" : "text-destructive"}
              >
                {isEnabled ? "Đang hoạt động" : "Chưa kích hoạt"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* MÀN HÌNH MẶC ĐỊNH (IDLE) */}
      {view === "idle" && (
        <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-300">
          {isEnabled ? (
            /* ĐÃ BẬT -> CHỈ HIỆN THÔNG BÁO VÀ NÚT TẮT */
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full mb-2">
                  <Lock size={40} />
                </div>
                <p className="text-sm font-bold text-foreground">
                  Tài khoản của ông đang cực kỳ an toàn!
                </p>
                <p className="text-[12px] text-muted-foreground max-w-[280px]">
                  Mọi lần đăng nhập từ thiết bị lạ đều yêu cầu mã xác thực từ
                  điện thoại của ông.
                </p>
              </div>
              <Button
                variant="destructive"
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-destructive/20 transition-transform active:scale-95"
                onClick={() => setView("disable")}
              >
                Vô hiệu hóa 2FA
              </Button>
            </div>
          ) : (
            /* CHƯA BẬT -> HIỆN NÚT SETUP */
            <>
              <p className="text-sm font-medium text-muted-foreground max-w-sm">
                Sử dụng ứng dụng Google Authenticator để tạo mã đăng nhập động,
                bảo vệ tài khoản khỏi tin tặc ngay cả khi bị lộ mật khẩu.
              </p>
              <Button
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-transform active:scale-95"
                onClick={handleStartSetup}
                disabled={setup2FA.isPending}
              >
                {setup2FA.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : null}
                {setup2FA.isPending
                  ? "Đang tạo mã..."
                  : "Thiết lập bảo mật ngay"}
              </Button>
            </>
          )}
        </div>
      )}

      {/* MÀN HÌNH BẬT 2FA (QUÉT QR) - Chỉ hiển thị khi CHƯA BẬT và view = setup */}
      {view === "setup" && !isEnabled && (
        <form
          onSubmit={handleConfirmSetup}
          className="flex flex-col items-center space-y-6 animate-in slide-in-from-right-4 duration-500"
        >
          <div className="bg-white p-4 rounded-3xl shadow-xl border border-border/50">
            {qrUrl ? (
              <QRCodeSVG value={qrUrl} size={200} />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-muted/20 animate-pulse rounded-2xl">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Smartphone size={14} /> Quét mã bằng Google Authenticator
          </p>

          <div className="w-full max-w-xs space-y-4">
            <Input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-16 text-center text-3xl tracking-[0.5em] font-black rounded-2xl border-2 focus:border-primary/50 transition-all"
              autoFocus
            />
            <Button
              type="submit"
              disabled={confirm2FA.isPending || code.length !== 6}
              className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
            >
              {confirm2FA.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Xác nhận & Kích hoạt"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full uppercase text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => {
                setView("idle");
                setCode("");
              }}
            >
              Hủy bỏ
            </Button>
          </div>
        </form>
      )}

      {/* MÀN HÌNH TẮT 2FA (NHẬP MẬT KHẨU) - Chỉ hiển thị khi ĐÃ BẬT và view = disable */}
      {view === "disable" && isEnabled && (
        <form
          onSubmit={handleConfirmDisable}
          className="flex flex-col items-center space-y-6 animate-in slide-in-from-left-4 duration-500"
        >
          <div className="w-full max-w-xs space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
                <KeyRound size={12} className="text-destructive" /> Xác nhận mật
                khẩu hiện tại
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 px-5 rounded-2xl border-2 font-bold focus:border-destructive/50 transition-all"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              variant="destructive"
              disabled={disable2FA.isPending || !password}
              className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-destructive/20"
            >
              {disable2FA.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Xác nhận tắt 2FA"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full uppercase text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => {
                setView("idle");
                setPassword("");
              }}
            >
              Quay lại
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
