"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { SpendingByCategory, MonthlyCostBar } from "@/components/charts/spending-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Understand your subscription spending patterns.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <PieChart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add some subscriptions to see your analytics.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "both" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Total Monthly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(monthlySpend)}</p>
              </CardContent>
            </Card>
            <Card className="animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Total Yearly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(yearlySpend)}</p>
              </CardContent>
            </Card>
            <Card className="animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Avg per Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(avgSubscriptionCost)}/mo</p>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card className="mb-6 border-indigo-100 bg-indigo-50/50 animate-slide-up" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
            <CardContent className="flex items-start gap-3 py-4">
              <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-900">Spending Insights</p>
                <ul className="text-sm text-indigo-700 space-y-1">
                  {topCategory && (
                    <li>
                      You&apos;re spending {topCategoryPercent}% of your subscriptions on{" "}
                      <span className="font-semibold">{topCategory[0]}</span>.
                    </li>
                  )}
                  <li>
                    Your subscriptions cost you{" "}
                    <span className="font-semibold">{formatCurrency(yearlySpend)}</span> per year.
                  </li>
                  {subscriptions.length > 3 && (
                    <li>
                      <TrendingUp className="inline h-3.5 w-3.5 mr-1" />
                      You have {subscriptions.length} active subscriptions. Consider reviewing if all are needed.
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

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
