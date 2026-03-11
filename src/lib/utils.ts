import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysRemaining(renewalDate: string | Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(renewalDate);
  renewal.setHours(0, 0, 0, 0);
  const diffTime = renewal.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysColor(days: number): string {
  if (days < 0) return "text-gray-400";
  if (days <= 3) return "text-red-500";
  if (days <= 7) return "text-orange-500";
  return "text-green-500";
}

export function getDaysBadgeVariant(days: number): "destructive" | "warning" | "success" | "secondary" {
  if (days < 0) return "secondary";
  if (days <= 3) return "destructive";
  if (days <= 7) return "warning";
  return "success";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const CATEGORIES = [
  "Entertainment",
  "Fitness",
  "Productivity",
  "Education",
  "Shopping",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
