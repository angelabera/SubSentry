"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import {
  Shield,
  ArrowRight,
  CreditCard,
  BarChart3,
  Bell,
  Zap,
  Eye,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: CreditCard,
    title: "Track Everything",
    desc: "All your subscriptions, one dashboard. Netflix, Spotify, gym — you name it.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Vibe Check Your Spending",
    desc: "Charts that actually make sense. See where your money's leaking in seconds.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Bell,
    title: "Renewal Alerts",
    desc: "Get pinged before auto-renewals hit. Cancel what you don't need, keep what you love.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: TrendingDown,
    title: "Cut the Waste",
    desc: "Spot duplicate and unused subs instantly. Save $$$ on autopilot.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const TICKER_ITEMS = [
  "Netflix", "Spotify", "YouTube Premium", "iCloud+", "ChatGPT Plus",
  "Disney+", "Adobe CC", "Notion", "Figma", "GitHub Pro",
  "Gym", "HBO Max", "Hulu", "Crunchyroll", "Xbox Game Pass",
];

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <div
      className={`glow-blob animate-pulse-glow ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function TickerBar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative overflow-hidden py-4 border-y border-white/5">
      <div className="flex gap-8 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-medium text-white/20 tracking-wide uppercase">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050a18]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="landing-dark min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg" />
        <FloatingOrb className="w-[500px] h-[500px] bg-indigo-600 top-[-10%] left-[-5%]" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-purple-600 top-[20%] right-[-8%]" delay={2} />
        <FloatingOrb className="w-[350px] h-[350px] bg-blue-600 bottom-[5%] left-[30%]" delay={4} />
      </div>

      <div className="relative z-10">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-20 pb-12 text-center">
          <div
            className="transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
            }}
          >
            {/* Logo mark */}
            <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] animate-float">
              <Shield className="h-10 w-10 text-white" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                SubSentry
              </span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl max-w-2xl mx-auto text-slate-400 leading-relaxed">
              Stop losing money to forgotten subscriptions.{" "}
              <span className="text-indigo-300 font-medium">Track, analyze, and dominate</span> your recurring payments — all in one sleek dashboard.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="neon-btn flex items-center justify-center gap-2 text-base cursor-pointer">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="outline-btn flex items-center justify-center gap-2 text-base cursor-pointer">
                  <Eye className="h-4 w-4" /> Sign In
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Ticker ── */}
        <TickerBar />

        {/* ── Stats ── */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: "Free to use" },
              { value: "24/7", label: "Renewal alerts" },
              { value: "30s", label: "Setup time" },
              { value: "∞", label: "Subscriptions" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="transition-all duration-500"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${300 + i * 100}ms`,
                }}
              >
                <div className="stat-number text-3xl sm:text-4xl font-extrabold">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-white">Everything you need.</span>{" "}
              <span className="text-indigo-400">Nothing you don&apos;t.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card p-6 sm:p-8 group cursor-default"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: `${400 + i * 120}ms`,
                }}
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10" />
            <div className="relative z-10">
              <Zap className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to take control?
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                Join SubSentry and stop letting subscriptions drain your wallet. Free forever, no cap.
              </p>
              <Link href="/register">
                <button className="neon-btn inline-flex items-center gap-2 text-base cursor-pointer">
                  Start Now <ChevronRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/5 py-8 text-center">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} SubSentry. Built different.
          </p>
        </footer>
      </div>
    </div>
  );
}
