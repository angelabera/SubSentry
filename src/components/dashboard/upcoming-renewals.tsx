"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { getDaysRemaining, getDaysBadgeVariant, formatCurrency, formatDate } from "@/lib/utils";

interface Subscription {
  _id: string;
  service_name: string;
  price: number;
  renewal_date: string;
  category: string;
  billing_cycle: string;
}

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
}

export function UpcomingRenewals({ subscriptions }: UpcomingRenewalsProps) {
  const upcoming = subscriptions
    .map((sub) => ({
      ...sub,
      daysLeft: getDaysRemaining(sub.renewal_date),
    }))
    .filter((sub) => sub.daysLeft >= 0 && sub.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <div className="glass-card glow-cyan p-6 animate-slide-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold text-white text-sm">Upcoming Renewals</h3>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          No upcoming renewals in the next 14 days
        </p>
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-3">
                {sub.daysLeft <= 3 && (
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 animate-pulse" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-200">{sub.service_name}</p>
                  <p className="text-xs text-slate-500">{formatDate(sub.renewal_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{formatCurrency(sub.price)}</span>
                <Badge variant={getDaysBadgeVariant(sub.daysLeft)}>
                  {sub.daysLeft === 0 ? "Today" : `${sub.daysLeft}d`}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
