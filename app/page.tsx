"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Fingerprint,
  Lock,
  Globe,
  Plus,
  MousePointer2,
  PieChart,
  History,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  BrainCircuit,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { data: user, isLoading } = useProfile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-3xl animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Homie Engine Starting...
          </span>
        </div>
      </div>
    );
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background selection:bg-primary/20 font-sans scroll-smooth overflow-x-hidden">
      {/* 🟢 HEADER */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full border-b bg-background/40 backdrop-blur-2xl sticky top-0 z-[100]"
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
              <TrendingUp className="text-white size-6" strokeWidth={3} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground uppercase">
              HOMIE<span className="text-primary italic">.</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {["Tính năng", "Bảo mật", "Quy trình", "Bảng giá"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all hover:translate-y-[-2px]"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all hidden sm:block"
            >
              Đăng nhập
            </Link>
            <Button
              asChild
              className="rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Link href="/register">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 w-full">
        {/* 🚀 HERO SECTION - NÂNG CẤP VỚI BENTO GRID & DYNAMIC GRADIENT */}
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 blur-[180px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full" />
            <div className="absolute top-[30%] left-[10%] w-[10%] h-[10%] bg-emerald-500/10 blur-[80px] rounded-full animate-bounce-slow" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="container mx-auto relative z-10"
          >
            <div className="flex flex-col items-center text-center space-y-12 mb-28">
               <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-3 rounded-full bg-primary/5 backdrop-blur-2xl border border-primary/20 px-8 py-3 text-[11px] font-black tracking-[0.5em] text-primary uppercase shadow-2xl group cursor-default"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="group-hover:tracking-[0.6em] transition-all duration-500">The New Era of Personal Finance</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-7xl font-black tracking-[calc(-0.06em)] sm:text-8xl md:text-[11rem] lg:text-[13rem] leading-[0.8] text-foreground uppercase italic drop-shadow-2xl"
              >
                ELITE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500">
                  HOMIE.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed tracking-tight opacity-80 px-4"
              >
                Trải nghiệm đỉnh cao quản trị dòng tiền. <br className="hidden md:block" /> 
                Chính xác. Bảo mật. Cá nhân hóa bởi AI.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6">
                <Button
                  asChild
                  size="lg"
                  className="rounded-[2rem] px-12 h-18 font-black uppercase text-sm tracking-[0.2em] shadow-[0_20px_40px_-15px_rgba(var(--primary),0.5)] hover:scale-105 active:scale-95 transition-all bg-primary hover:bg-primary/90"
                >
                  <Link href="/register" className="flex items-center gap-4">
                    Bắt đầu ngay <ArrowRight size={20} strokeWidth={3} />
                  </Link>
                </Button>
                <Link href="#tinh-nang" className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
                  Khám phá tính năng
                </Link>
              </motion.div>
            </div>

            {/* BENTO GRID MOCKUP - PHẦN NÀY LÀM ĐIỂM NHẤN WOW */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "circOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto"
            >
              <div className="md:col-span-8 h-[400px] rounded-[3rem] bg-gradient-to-br from-card to-muted/20 border-2 border-border/40 overflow-hidden relative group p-10">
                 <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                    <BarChart3 size={200} className="text-primary" />
                 </div>
                 <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                       <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border border-primary/20">Dashboard v2.0</span>
                       <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Trải nghiệm <br /> Quản trị 360 độ</h3>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                          <TrendingUp size={24} />
                       </div>
                       <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/30">
                          <PieChart size={24} />
                       </div>
                    </div>
                 </div>
                 {/* Giả lập Dashboard UI mờ ảo */}
                 <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[90%] h-[200px] bg-background/40 backdrop-blur-3xl rounded-t-[2rem] border-x-2 border-t-2 border-primary/10 shadow-2xl" />
              </div>

              <div className="md:col-span-4 h-[400px] rounded-[3rem] bg-primary border-2 border-primary/40 p-10 flex flex-col justify-between text-white overflow-hidden relative group">
                <div className="absolute top-[-10%] right-[-10%] opacity-20 animate-spin-slow">
                   <BrainCircuit size={250} />
                </div>
                <div className="relative z-10">
                   <Sparkles size={48} className="mb-6 fill-white" />
                   <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">AI <br /> Financial <br /> Advisor</h3>
                   <p className="text-white/70 text-sm font-medium leading-relaxed uppercase tracking-widest italic">Personalized Insight <br /> for every homie.</p>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] shadow-2xl relative z-10">
                  Thử ngay
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 📊 STATS SECTION */}
        <section className="container mx-auto px-6 py-24 border-y border-border/40 bg-muted/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Người dùng tin dùng", value: "15,000+" },
              { label: "Giao dịch ghi nhận", value: "1.2M+" },
              { label: "Tiết kiệm trung bình", value: "25%" },
              { label: "Thời gian phản hồi", value: "2ms" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center space-y-3"
              >
                <p className="text-4xl md:text-5xl font-black tracking-tighter text-primary font-money">
                  {stat.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 text-balance">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🛠️ STEP-BY-STEP */}
        <section
          id="quy trình"
          className="w-full py-40 px-6 bg-muted/20 relative"
        >
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-32 space-y-6"
            >
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary">
                Hành trình trải nghiệm
              </h2>
              <p className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Chỉ 3 phút để làm chủ <br className="hidden md:block" /> vận
                mệnh tài chính
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-16 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              {[
                {
                  step: "01",
                  title: "Khởi tạo hệ sinh thái",
                  icon: <Plus />,
                  desc: "Tích hợp mọi nguồn tiền từ Ngân hàng, Ví điện tử đến Tiền mặt vào một nơi duy nhất.",
                },
                {
                  step: "02",
                  title: "Ghi chép tinh gọn",
                  icon: <MousePointer2 />,
                  desc: "Tối ưu hóa thao tác nhập liệu chỉ trong 2 giây. Không rườm rà, không chi tiết thừa.",
                },
                {
                  step: "03",
                  title: "Phân tích & Tối ưu",
                  icon: <PieChart />,
                  desc: "AI tự động bóc tách dữ liệu, đưa ra lời khuyên để bạn tối ưu hóa 30% chi tiêu hàng tháng.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                  className="flex flex-col items-center text-center space-y-8 group relative"
                >
                  <div className="w-24 h-24 bg-background border-[6px] border-muted rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] opacity-40 italic">
                      {item.step}
                    </span>
                    <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[300px]">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 💎 KEY FEATURES */}
        <section id="tính năng" className="w-full py-40 px-6">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-8 p-12 rounded-[4rem] bg-foreground text-background overflow-hidden relative group"
              >
                <div className="absolute bottom-[-10%] right-[-5%] p-8 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                  <BarChart3 size={400} />
                </div>
                <div className="relative z-10 space-y-8 h-full flex flex-col justify-center">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                    <Zap className="fill-white size-8" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                      Báo cáo <br /> Thời gian thực.
                    </h3>
                    <p className="text-background/50 max-w-md text-lg font-medium">
                      Theo dõi sự biến động của từng đồng xu tức thì. Dữ liệu
                      đồng bộ 100% trên mọi nền tảng.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-fit rounded-full border-background/20 text-background hover:bg-background hover:text-foreground uppercase text-[10px] font-black px-10 h-14 tracking-widest"
                  >
                    Trải nghiệm ngay
                  </Button>
                </div>
              </motion.div>

              <div className="lg:col-span-4 grid gap-8">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="p-10 rounded-[3.5rem] bg-primary/10 border-2 border-primary/20 flex flex-col justify-between group hover:bg-primary hover:text-white transition-all duration-500"
                >
                  <History
                    className="size-12 mb-6 group-hover:scale-110 transition-transform"
                    strokeWidth={2.5}
                  />
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight mb-3 text-balance">
                      Nhật ký thay đổi
                    </h4>
                    <p className="text-muted-foreground group-hover:text-white/80 text-sm font-medium leading-relaxed">
                      Mọi sự hiệu chỉnh đều được lưu vết. Minh bạch tuyệt đối
                      cho quỹ nhóm và gia đình.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="p-10 rounded-[3.5rem] bg-muted flex flex-col justify-between group hover:shadow-2xl transition-all duration-500"
                >
                  <ShieldAlert
                    className="text-foreground size-12 mb-6 group-hover:text-primary transition-colors"
                    strokeWidth={2.5}
                  />
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight mb-3 text-balance">
                      Hạn mức thông minh
                    </h4>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                      Tự động cảnh báo khi bạn chi tiêu vượt ngưỡng ngân sách dự
                      kiến trong tháng.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 🛡️ SECURITY SECTION */}
        <section id="bảo mật" className="w-full py-32 px-6 container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="bg-foreground rounded-[5rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="flex-1 space-y-12 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px] bg-primary/10 px-5 py-2 rounded-full border border-primary/20 animate-pulse">
                <ShieldCheck size={16} /> Tiêu chuẩn bảo mật cao cấp
              </div>
              <h2 className="text-6xl md:text-9xl font-black tracking-[calc(-0.04em)] text-background leading-[0.8] uppercase italic">
                DỮ LIỆU <br /> BẤT KHẢ XÂM.
              </h2>
              <div className="grid gap-8">
                {[
                  "Mã hóa AES-256 đầu cuối",
                  "Xác thực đa lớp",
                  "Chứng chỉ SSL toàn cầu",
                ].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.5 }}
                    className="flex items-center justify-center lg:justify-start gap-5 text-background/90 font-black uppercase text-[13px] tracking-widest"
                  >
                    <CheckCircle2
                      className="text-primary size-7"
                      strokeWidth={3}
                    />{" "}
                    {text}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="w-72 h-72 md:w-[450px] md:h-[450px] bg-primary/10 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border border-primary/30 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
                <Fingerprint
                  size={200}
                  className="text-primary opacity-60"
                  strokeWidth={0.5}
                />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 🟢 FOOTER */}
      <footer className="w-full bg-card border-t pt-40 pb-16 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-20 mb-32">
            <div className="lg:col-span-2 space-y-12">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                  <TrendingUp className="text-white size-8" strokeWidth={3} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-black text-4xl tracking-tighter text-foreground uppercase">
                    HOMIE<span className="text-primary italic">.</span>
                  </span>
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase text-muted-foreground mt-1 text-balance">
                    Core Finance
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed text-xl tracking-tight italic text-balance">
                "Chúng tôi không chỉ xây dựng công cụ, chúng tôi xây dựng sự an
                tâm cho tương lai tài chính của bạn."
              </p>

              <div className="flex gap-5 pt-4">
                {[
                  { icon: ShieldCheck, label: "Verified" },
                  { icon: Lock, label: "Encrypted" },
                  { icon: Globe, label: "Global" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative p-4 bg-muted rounded-[1.5rem] border border-border/40 hover:border-primary/40 transition-all cursor-help"
                  >
                    <item.icon
                      size={26}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest whitespace-nowrap shadow-2xl">
                      {item.label} System
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Sản phẩm",
                links: [
                  "Quản lý ví",
                  "Quỹ nhóm",
                  "Phân tích AI",
                  "Báo cáo tháng",
                ],
              },
              {
                title: "Hỗ trợ",
                links: [
                  "Trung tâm trợ giúp",
                  "Liên hệ",
                  "Blog tài chính",
                  "Cộng đồng",
                ],
              },
              {
                title: "Pháp lý",
                links: [
                  "Điều khoản",
                  "Bảo mật",
                  "Quy định Cookie",
                  "Chính sách",
                ],
              },
            ].map((group) => (
              <div key={group.title} className="space-y-10">
                <h5 className="font-black uppercase tracking-[0.4em] text-xs text-foreground border-b border-border/40 pb-5">
                  {group.title}
                </h5>
                <ul className="space-y-5 text-[13px] font-bold text-muted-foreground uppercase tracking-tight">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="hover:text-primary transition-all flex items-center group"
                      >
                        {link}{" "}
                        <ArrowUpRight
                          size={14}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border/40 pt-12 flex flex-col md:flex-row items-center justify-between gap-10 text-balance">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
                HOMIE FINANCE GLOBAL © 2026. ALL RIGHTS RESERVED.
              </p>
              <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                CRAFTED WITH PASSION BY LE HAI — DESIGNED FOR THE ELITE.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-muted/50 px-8 py-4 rounded-[2rem] border border-border/50 shadow-inner">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                Hệ thống: Vận hành ổn định
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
