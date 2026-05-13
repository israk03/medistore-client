"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  XCircle,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ReceiptText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { orderService } from "@/services/order.service";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

import type { Order, OrderStatus } from "@/types/auth.types";
import { toast } from "sonner";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "PLACED", label: "Confirmed", icon: Package },
  { status: "PROCESSING", label: "Preparing", icon: Clock },
  { status: "SHIPPED", label: "In Transit", icon: Truck },
  { status: "DELIVERED", label: "Fulfilled", icon: CheckCircle2 },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await orderService.getById(id);
        if (mounted && res?.success && res?.data) setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order documentation");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => { mounted = false; };
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await orderService.cancel(order.id);
      if (res?.success && res?.data) {
        setOrder(res.data);
        toast.success("Order Voided Successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  const currentStepIndex = useMemo(() => {
    if (!order || order.status === "CANCELLED") return -1;
    return STATUS_STEPS.findIndex((s) => s.status === order.status);
  }, [order]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-slate-50/50">
        <div className="mx-auto max-w-3xl space-y-6 px-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-100 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!order) return null; // Handle not found redirect in useEffect/Guard

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-20">
      <div className="mx-auto max-w-3xl px-4">
        {/* BACK ACTION */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-indigo-600"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition-all group-hover:ring-indigo-200">
            <ArrowLeft className="h-3 w-3" />
          </div>
          Return to Ledger
        </motion.button>

        <div className="grid gap-6">
          {/* 1. STATUS TRACKER SECTION */}
          {!order.status.includes("CANCELLED") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
            >
              <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-0 top-4.5 h-0.5 w-full bg-slate-100" />
                <div 
                  className="absolute left-0 top-4.5 h-0.5 bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-4 border-white transition-all duration-500",
                        isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-400"
                      )}>
                        <Icon className={cn("h-4 w-4", isCurrent && "animate-pulse")} />
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        isActive ? "text-indigo-600" : "text-slate-400"
                      )}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2. ORDER CORE DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/40"
          >
            {/* INVOICE HEADER */}
            <div className="flex flex-col items-start justify-between border-b border-slate-50 bg-slate-50/50 p-8 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="font-mono text-xl font-black tracking-tighter text-slate-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </h1>
                  <Badge className={cn("rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest", getStatusColor(order.status))}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(order.createdAt)}</span>
                  <span className="flex items-center gap-1.5 text-emerald-600"><ShieldCheck className="h-3 w-3" /> Secure Transaction</span>
                </div>
              </div>

              {order.status === "PLACED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="mt-4 rounded-xl border-rose-100 font-bold text-rose-500 hover:bg-rose-50 sm:mt-0"
                >
                  {cancelling ? "Processing..." : "Void Order"}
                </Button>
              )}
            </div>

            {/* CONTENT BROWSER */}
            <div className="p-8 space-y-8">
              {/* ADDRESS PILL */}
              <div className="flex items-start gap-4 rounded-2xl bg-indigo-50/50 p-5 border border-indigo-100/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Dispatch Destination</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{order.shippingAddress}</p>
                </div>
              </div>

              {/* ITEMS LEDGER */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-slate-400" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Items</p>
                </div>
                
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 font-black text-slate-400 text-xs">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {item.medicine?.name ?? "Item Discontinued"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Unit Price: {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-900">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-50" />

              {/* TOTALS */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Statement Balance</p>
                  <p className="text-xs font-bold text-slate-400">Taxes and handling included</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}