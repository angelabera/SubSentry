"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/lib/utils";

const subscriptionSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  price: z.number().positive("Price must be positive"),
  billing_cycle: z.enum(["monthly", "yearly"]),
  renewal_date: z.string().min(1, "Renewal date is required"),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  defaultValues?: Partial<SubscriptionFormData>;
  isEditing?: boolean;
}

export function SubscriptionForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}: SubscriptionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      service_name: "",
      price: 0,
      billing_cycle: "monthly",
      renewal_date: "",
      category: "",
      notes: "",
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    if (open && defaultValues) {
      reset({
        service_name: "",
        price: 0,
        billing_cycle: "monthly",
        renewal_date: "",
        category: "",
        notes: "",
        ...defaultValues,
      });
    } else if (open && !defaultValues) {
      reset({
        service_name: "",
        price: 0,
        billing_cycle: "monthly",
        renewal_date: "",
        category: "",
        notes: "",
      });
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = async (data: SubscriptionFormData) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditing ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEditing
              ? "Update your subscription details."
              : "Add a new subscription to track."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service_name" className="text-slate-300">Service Name</Label>
            <Input
              id="service_name"
              placeholder="e.g., Netflix, Spotify"
              {...register("service_name")}
              className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500"
            />
            {errors.service_name && (
              <p className="text-xs text-red-500">{errors.service_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-300">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="9.99"
                {...register("price", { valueAsNumber: true })}
                className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500"
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Controller
                control={control}
                name="billing_cycle"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-slate-200">
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="renewal_date" className="text-slate-300">Renewal Date</Label>
              <Input
                id="renewal_date"
                type="date"
                {...register("renewal_date")}
                className="bg-white/[0.06] border-white/10 text-white [color-scheme:dark]"
              />
              {errors.renewal_date && (
                <p className="text-xs text-red-500">{errors.renewal_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-slate-200">
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-300">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              {...register("notes")}
              className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Button>
            <button type="submit" className="neon-btn text-sm cursor-pointer" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Subscription"
                : "Save Subscription"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
