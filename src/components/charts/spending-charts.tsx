"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];

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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  const total = categoryData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
      <CardHeader>
        <CardTitle className="text-base">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
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
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(240, 5.9%, 90%)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
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
                  <span>{cat.name}</span>
                </div>
                <span className="font-medium">
                  {formatCurrency(cat.value)}/mo ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Subscription Cost</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
      <CardHeader>
        <CardTitle className="text-base">Monthly Subscription Cost</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 5.9%, 90%)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(240, 5.9%, 90%)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey="monthly"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              name="Monthly Cost"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
