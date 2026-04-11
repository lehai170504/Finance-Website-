"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { data: user, isLoading } = useProfile();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background selection:bg-primary/20">
      <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-all group"
          >
            <Image
              src="/logo-icon.png"
              alt="Homie Icon"
              width={64}
              height={64}
              className="object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter text-foreground">
                HOMIE<span className="text-primary">.</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Đăng nhập
            </Link>
            <Button
              asChild
              className="rounded-full px-6 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Link href="/register">Bắt đầu ngay</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="w-full py-32 md:py-40 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
          {/* Background Gradient mờ ảo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="space-y-8 max-w-4xl relative z-10">
            <div className="inline-block rounded-full bg-muted/80 backdrop-blur-sm border px-4 py-1.5 text-xs font-black tracking-widest text-primary uppercase shadow-sm">
              ✨ Phiên bản 2.0 đã sẵn sàng
            </div>

            <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
              Làm chủ tài chính. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Kiến tạo tương lai.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl font-medium leading-relaxed">
              Hệ thống quản lý chi tiêu cá nhân loại bỏ mọi chi tiết thừa. Tập
              trung hoàn toàn vào tốc độ, độ bảo mật và tính chính xác của dữ
              liệu.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-14 font-black uppercase text-xs tracking-widest w-full sm:w-auto shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Trải nghiệm miễn phí <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-14 font-black uppercase text-xs tracking-widest w-full sm:w-auto border-2 hover:bg-muted"
              >
                <Link href="/login">Tôi đã có tài khoản</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-muted/30 border-y px-4">
          <div className="container mx-auto">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col space-y-4 group">
                <span className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                  01.
                </span>
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  Tốc độ siêu thực
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Phản hồi dưới 10ms. Mọi thao tác ghi chép được xử lý tức thì
                  nhờ công nghệ bộ nhớ đệm tiên tiến và kiến trúc SSE thời gian
                  thực.
                </p>
              </div>
              <div className="flex flex-col space-y-4 group">
                <span className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                  02.
                </span>
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  Số liệu minh bạch
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Báo cáo tài chính trực quan, rõ ràng. Nhìn là hiểu ngay dòng
                  tiền của bạn đang đi về đâu, từ cá nhân đến quỹ nhóm chung.
                </p>
              </div>
              <div className="flex flex-col space-y-4 group">
                <span className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                  03.
                </span>
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  Bảo mật đa lớp
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Dữ liệu được mã hóa chuẩn ngân hàng. Bạn là người duy nhất có
                  quyền kiểm soát và truy cập vào thông tin nhạy cảm của mình.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-card border-t pt-20 pb-10 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Cột Logo & Giới thiệu */}
            <div className="lg:col-span-2 space-y-6">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-all"
              >
                <Image
                  src="/logo-icon.png"
                  alt="Homie Icon"
                  width={48}
                  height={48}
                  className="object-contain drop-shadow-md"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-black text-3xl tracking-tighter text-foreground">
                    HOMIE<span className="text-primary">.</span>
                  </span>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground mt-1">
                    Finance
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
                Nền tảng quản lý tài chính thế hệ mới. Đơn giản hóa việc theo
                dõi chi tiêu, chia sẻ hóa đơn và đạt được tự do tài chính cùng
                những người thân yêu.
              </p>
              <div className="flex gap-4 pt-2">
                <Link
                  href="#"
                  className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors text-muted-foreground"
                >
                  <TwitterIcon />
                </Link>
                <Link
                  href="https://github.com/lehai170504/Finance-Web"
                  className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors text-muted-foreground"
                >
                  <GithubIcon />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/h%E1%BA%A3i-l%C3%AA-ho%C3%A0ng-4708b43ba/"
                  className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors text-muted-foreground"
                >
                  <LinkedinIcon />
                </Link>
              </div>
            </div>

            {/* Cột Sản phẩm */}
            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-xs text-foreground">
                Sản phẩm
              </h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Tính năng cốt lõi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Quản lý nhóm
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Báo cáo phân tích
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Tải ứng dụng Mobile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột Công ty */}
            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-xs text-foreground">
                Về chúng tôi
              </h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Câu chuyện Homie
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Blog tài chính
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột Pháp lý */}
            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-xs text-foreground">
                Pháp lý
              </h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Điều khoản dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Quy định cookie
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} HOMIE FINANCE. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Hệ thống đang hoạt động ổn định
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-8.5a6.5 6.5 0 0 0-1.7-4.5 5.8 5.8 0 0 0-.2-4.5s-1.4-.5-4.5 2a13.8 13.8 0 0 0-8 0c-3-2.5-4.5-2-4.5-2a5.8 5.8 0 0 0-.2 4.5 6.5 6.5 0 0 0-1.7 4.5c0 7 3 8.2 6 8.5-.8.7-1 2-1 3.2v4"></path>
      <path d="M9 18c-4.5 1.6-5-2.5-7-3"></path>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}
