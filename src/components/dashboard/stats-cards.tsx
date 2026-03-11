"use client";

import React from "react";
import { Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const INRIcon = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden>
    ₹
  </span>
);

interface StatsCardsProps {
  monthlySpend: number;
  yearlySpend: number;
  activeCount: number;
  upcomingRenewals: number;
}

export function StatsCards({ monthlySpend, yearlySpend, activeCount, upcomingRenewals }: StatsCardsProps) {
  const cards = [
    {
      title: "Monthly Spend",
      value: formatCurrency(monthlySpend),
      icon: INRIcon,
      gradient: "from-indigo-500 to-blue-600",
      glowColor: "shadow-indigo-500/20",
      iconBg: "bg-indigo-500/15",
      glowClass: "glow-indigo",
    },
    {
      title: "Yearly Spend",
      value: formatCurrency(yearlySpend),
      icon: Calendar,
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "shadow-emerald-500/20",
      iconBg: "bg-emerald-500/15",
      glowClass: "glow-emerald",
    },
    {
      title: "Active Subscriptions",
      value: activeCount.toString(),
      icon: CreditCard,
      gradient: "from-violet-500 to-purple-600",
      glowColor: "shadow-violet-500/20",
      iconBg: "bg-violet-500/15",
      glowClass: "glow-violet",
    },
    {
      title: "Upcoming Renewals",
      value: upcomingRenewals.toString(),
      icon: AlertTriangle,
      gradient: "from-amber-500 to-orange-600",
      glowColor: "shadow-amber-500/20",
      iconBg: "bg-amber-500/15",
      highlight: upcomingRenewals > 0,
      glowClass: "glow-amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className={`glass-card ${card.glowClass} p-5 group animate-slide-up`}
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-400">
              {card.title}
            </span>
            <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.glowColor} group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${card.highlight ? "text-amber-400" : "text-white"}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
