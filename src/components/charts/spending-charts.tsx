"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#94a3b8"];

interface Subscription {
  price: number;
  billing_cycle: string;
  category: string;
  service_name?: string;
}

interface SpendingChartsProps {
  subscriptions: Subscription[];
}

export function SpendingByCategory({ subscriptions }: SpendingChartsProps) {
  const categoryData = subscriptions.reduce((acc, sub) => {
    const monthlyPrice = sub.billing_cycle === "yearly" ? sub.price / 12 : sub.price;
    const existing = acc.find((item) => item.name === sub.category);
    if (existing) {
      existing.value += monthlyPrice;
    } else {
      acc.push({ name: sub.category, value: monthlyPrice });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  categoryData.sort((a, b) => b.value - a.value);

  if (categoryData.length === 0) {
    return (
      <div className="glass-card glow-violet p-6">
        <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
        <div className="flex items-center justify-center h-[300px] text-slate-500">
          No data available
        </div>
      </div>
    );
  }

  const total = categoryData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card glow-violet p-6 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
      <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "0.75rem",
                background: "rgba(15, 23, 55, 0.95)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "#e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "13px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {categoryData.map((cat, i) => {
            const percentage = ((cat.value / total) * 100).toFixed(0);
            return (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-slate-400">{cat.name}</span>
                </div>
                <span className="font-medium text-slate-200">
                  {formatCurrency(cat.value)}/mo ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
    </div>
  );
}

export function MonthlyCostBar({ subscriptions }: SpendingChartsProps) {
  const barData = subscriptions
    .map((sub) => ({
      name: sub.service_name || "Unknown",
      monthly: sub.billing_cycle === "yearly" ? sub.price / 12 : sub.price,
      yearly: sub.billing_cycle === "yearly" ? sub.price : sub.price * 12,
    }))
    .sort((a, b) => b.monthly - a.monthly);

  if (barData.length === 0) {
    return (
      <div className="glass-card glow-indigo p-6">
        <h3 className="font-semibold text-white mb-4">Monthly Subscription Cost</h3>
        <div className="flex items-center justify-center h-[300px] text-slate-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glow-indigo p-6 animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
      <h3 className="font-semibold text-white mb-4">Monthly Subscription Cost</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${v}`}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "0.75rem",
                background: "rgba(15, 23, 55, 0.95)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "#e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
            <Bar
              dataKey="monthly"
              fill="#818cf8"
              radius={[6, 6, 0, 0]}
              name="Monthly Cost"
            />
          </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
