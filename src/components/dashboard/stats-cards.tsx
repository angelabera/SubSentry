"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, AlertTriangle } from "lucide-react";

const INRIcon = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden>
    ₹
  </span>
);
import { formatCurrency } from "@/lib/utils";

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
      gradient: "from-indigo-500 to-indigo-600",
      bgGlow: "bg-indigo-500/10",
    },
    {
      title: "Yearly Spend",
      value: formatCurrency(yearlySpend),
      icon: Calendar,
      gradient: "from-emerald-500 to-emerald-600",
      bgGlow: "bg-emerald-500/10",
    },
    {
      title: "Active Subscriptions",
      value: activeCount.toString(),
      icon: CreditCard,
      gradient: "from-violet-500 to-violet-600",
      bgGlow: "bg-violet-500/10",
    },
    {
      title: "Upcoming Renewals",
      value: upcomingRenewals.toString(),
      icon: AlertTriangle,
      gradient: "from-amber-500 to-amber-600",
      bgGlow: "bg-amber-500/10",
      highlight: upcomingRenewals > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card
          key={card.title}
          className="relative overflow-hidden animate-slide-up group"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
        >
          <div className={`absolute inset-0 ${card.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-2xl font-bold ${card.highlight ? "text-amber-600" : ""}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
