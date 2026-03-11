"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingRenewals } from "@/components/dashboard/upcoming-renewals";
import { SpendingByCategory } from "@/components/charts/spending-charts";
import { SubscriptionTable, SubscriptionData } from "@/components/subscription/subscription-table";
import { SubscriptionForm } from "@/components/subscription/subscription-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { getDaysRemaining, formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionData | null>(null);

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

  const handleCreate = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchSubscriptions();
  };

  const handleEdit = async (data: Record<string, unknown>) => {
    if (!editingSub) return;
    const res = await fetch(`/api/subscriptions/${editingSub._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingSub(null);
      fetchSubscriptions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (res.ok) fetchSubscriptions();
  };

  const openEdit = (sub: SubscriptionData) => {
    setEditingSub(sub);
  };

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

  const upcomingRenewals = subscriptions.filter(
    (sub) => {
      const days = getDaysRemaining(sub.renewal_date);
      return days >= 0 && days <= 7;
    }
  ).length;

  const mostExpensive = subscriptions.length > 0
    ? [...subscriptions].sort((a, b) => {
        const aMonthly = a.billing_cycle === "yearly" ? a.price / 12 : a.price;
        const bMonthly = b.billing_cycle === "yearly" ? b.price / 12 : b.price;
        return bMonthly - aMonthly;
      })[0]
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {user?.name}! Here&apos;s your subscription overview.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards
        monthlySpend={monthlySpend}
        yearlySpend={yearlySpend}
        activeCount={subscriptions.length}
        upcomingRenewals={upcomingRenewals}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left - Table */}
        <div className="lg:col-span-2">
          <Card className="animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionTable
                subscriptions={subscriptions.slice(0, 5)}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right - Upcoming & Insights */}
        <div className="space-y-6">
          <UpcomingRenewals subscriptions={subscriptions} />

          {mostExpensive && (
            <Card className="animate-slide-up" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Quick Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your most expensive subscription is{" "}
                  <span className="font-semibold text-foreground">{mostExpensive.service_name}</span>{" "}
                  at{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(
                      mostExpensive.billing_cycle === "yearly"
                        ? mostExpensive.price / 12
                        : mostExpensive.price
                    )}
                    /mo
                  </span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Spending Chart */}
      {subscriptions.length > 0 && (
        <div className="mt-6">
          <SpendingByCategory subscriptions={subscriptions} />
        </div>
      )}

      {/* Add Form */}
      <SubscriptionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      {/* Edit Form */}
      <SubscriptionForm
        open={!!editingSub}
        onOpenChange={(open) => !open && setEditingSub(null)}
        onSubmit={handleEdit}
        defaultValues={
          editingSub
            ? {
                service_name: editingSub.service_name,
                price: editingSub.price,
                billing_cycle: editingSub.billing_cycle,
                renewal_date: new Date(editingSub.renewal_date)
                  .toISOString()
                  .split("T")[0],
                category: editingSub.category,
                notes: editingSub.notes || "",
              }
            : undefined
        }
        isEditing
      />
    </div>
  );
}
