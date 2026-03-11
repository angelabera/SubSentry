"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { getDaysRemaining, getDaysBadgeVariant, formatCurrency, formatDate } from "@/lib/utils";

export interface SubscriptionData {
  _id: string;
  service_name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  renewal_date: string;
  category: string;
  notes?: string;
}

interface SubscriptionTableProps {
  subscriptions: SubscriptionData[];
  onEdit: (sub: SubscriptionData) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Entertainment: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
  Fitness: "bg-green-500/15 text-green-300 border border-green-500/20",
  Productivity: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
  Education: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  Shopping: "bg-pink-500/15 text-pink-300 border border-pink-500/20",
  Other: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
};

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">No subscriptions yet</p>
        <p className="text-sm mt-1">Add your first subscription to start tracking</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-sm text-slate-500">
            <th className="pb-3 font-medium">Service</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Price</th>
            <th className="pb-3 font-medium hidden sm:table-cell">Cycle</th>
            <th className="pb-3 font-medium hidden md:table-cell">Renewal Date</th>
            <th className="pb-3 font-medium">Days Left</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub, index) => {
            const daysLeft = getDaysRemaining(sub.renewal_date);
            const badgeVariant = getDaysBadgeVariant(daysLeft);

            return (
              <tr
                key={sub._id}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3.5">
                  <div className="font-medium text-slate-200">{sub.service_name}</div>
                  {sub.notes && (
                    <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                      {sub.notes}
                    </div>
                  )}
                </td>
                <td className="py-3.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      categoryColors[sub.category] || categoryColors.Other
                    }`}
                  >
                    {sub.category}
                  </span>
                </td>
                <td className="py-3.5 font-semibold text-white">{formatCurrency(sub.price)}</td>
                <td className="py-3.5 hidden sm:table-cell capitalize text-sm text-slate-400">
                  {sub.billing_cycle}
                </td>
                <td className="py-3.5 hidden md:table-cell text-sm text-slate-400">
                  {formatDate(sub.renewal_date)}
                </td>
                <td className="py-3.5">
                  <Badge variant={badgeVariant}>
                    {daysLeft < 0 ? "Expired" : daysLeft === 0 ? "Today" : `${daysLeft}d`}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/[0.06]">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#111827] border-white/10">
                      <DropdownMenuItem onClick={() => onEdit(sub)} className="text-slate-300 focus:bg-white/[0.06] focus:text-white">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(sub._id)}
                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
