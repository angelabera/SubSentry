"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="animate-slide-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">Upcoming Renewals</CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming renewals in the next 14 days
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  {sub.daysLeft <= 3 && (
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{sub.service_name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(sub.renewal_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{formatCurrency(sub.price)}</span>
                  <Badge variant={getDaysBadgeVariant(sub.daysLeft)}>
                    {sub.daysLeft === 0 ? "Today" : `${sub.daysLeft}d`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
