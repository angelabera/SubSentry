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
  Entertainment: "bg-purple-100 text-purple-700",
  Fitness: "bg-green-100 text-green-700",
  Productivity: "bg-blue-100 text-blue-700",
  Education: "bg-yellow-100 text-yellow-700",
  Shopping: "bg-pink-100 text-pink-700",
  Other: "bg-gray-100 text-gray-700",
};

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No subscriptions yet</p>
        <p className="text-sm mt-1">Add your first subscription to start tracking</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-muted-foreground">
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
                className="border-b last:border-0 hover:bg-accent/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3.5">
                  <div className="font-medium">{sub.service_name}</div>
                  {sub.notes && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
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
                <td className="py-3.5 font-semibold">{formatCurrency(sub.price)}</td>
                <td className="py-3.5 hidden sm:table-cell capitalize text-sm text-muted-foreground">
                  {sub.billing_cycle}
                </td>
                <td className="py-3.5 hidden md:table-cell text-sm text-muted-foreground">
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(sub)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(sub._id)}
                        className="text-red-600"
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
