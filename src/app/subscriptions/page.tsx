"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { SubscriptionTable, SubscriptionData } from "@/components/subscription/subscription-table";
import { SubscriptionForm } from "@/components/subscription/subscription-form";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function SubscriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionData | null>(null);
  const [search, setSearch] = useState("");

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

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const filtered = subscriptions.filter(
    (sub) =>
      sub.service_name.toLowerCase().includes(search.toLowerCase()) ||
      sub.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage all your subscriptions in one place.
          </p>
        </div>
        <button onClick={() => setFormOpen(true)} className="neon-btn flex items-center justify-center gap-2 text-sm cursor-pointer">
          <Plus className="h-4 w-4" /> Add Subscription
        </button>
      </div>

      <div className="glass-card p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-semibold text-white text-base">
            All Subscriptions ({subscriptions.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50"
            />
          </div>
        </div>
        <SubscriptionTable
          subscriptions={filtered}
          onEdit={(sub) => setEditingSub(sub)}
          onDelete={handleDelete}
        />
      </div>

      <SubscriptionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

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
