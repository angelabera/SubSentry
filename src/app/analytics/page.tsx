"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { SpendingByCategory, MonthlyCostBar } from "@/components/charts/spending-charts";
import { TrendingUp, PieChart, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Subscription {
  _id: string;
  service_name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  renewal_date: string;
  category: string;
  notes?: string;
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchSubscriptions();
    }
  }, [user, authLoading, router, fetchSubscriptions]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const monthlySpend = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billing_cycle === "yearly" ? sub.price / 12 : sub.price);
  }, 0);

  const yearlySpend = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billing_cycle === "yearly" ? sub.price : sub.price * 12);
  }, 0);

  // Category breakdown
  const categoryBreakdown = subscriptions.reduce(
    (acc, sub) => {
      const monthly = sub.billing_cycle === "yearly" ? sub.price / 12 : sub.price;
      acc[sub.category] = (acc[sub.category] || 0) + monthly;
      return acc;
    },
    {} as Record<string, number>
  );

  const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
  const topCategoryPercent = topCategory
    ? ((topCategory[1] / monthlySpend) * 100).toFixed(0)
    : 0;

  const avgSubscriptionCost =
    subscriptions.length > 0 ? monthlySpend / subscriptions.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">
          Understand your subscription spending patterns.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <PieChart className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-300">No data yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Add some subscriptions to see your analytics.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "both" }}>
              <p className="text-sm text-slate-400 font-medium mb-1">Total Monthly</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(monthlySpend)}</p>
            </div>
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              <p className="text-sm text-slate-400 font-medium mb-1">Total Yearly</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(yearlySpend)}</p>
            </div>
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              <p className="text-sm text-slate-400 font-medium mb-1">Avg per Subscription</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(avgSubscriptionCost)}/mo</p>
            </div>
          </div>

          {/* Insights */}
          <div className="glass-card p-5 mb-6 animate-slide-up" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Spending Insights</p>
                <ul className="text-sm text-slate-400 space-y-1">
                  {topCategory && (
                    <li>
                      You&apos;re spending {topCategoryPercent}% of your subscriptions on{" "}
                      <span className="font-semibold text-indigo-300">{topCategory[0]}</span>.
                    </li>
                  )}
                  <li>
                    Your subscriptions cost you{" "}
                    <span className="font-semibold text-white">{formatCurrency(yearlySpend)}</span> per year.
                  </li>
                  {subscriptions.length > 3 && (
                    <li>
                      <TrendingUp className="inline h-3.5 w-3.5 mr-1 text-indigo-400" />
                      You have {subscriptions.length} active subscriptions. Consider reviewing if all are needed.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingByCategory subscriptions={subscriptions} />
            <MonthlyCostBar subscriptions={subscriptions} />
          </div>
        </>
      )}
    </div>
  );
}
