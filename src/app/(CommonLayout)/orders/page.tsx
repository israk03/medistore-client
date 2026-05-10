"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Package, Filter, Search, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { orderService } from "@/services/order.service";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

import type { Order, OrderStatus } from "@/types/auth.types";

const STATUS_FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All Orders", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (mounted && res?.success && res?.data) setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-16">
      {/* 1. DYNAMIC HEADER */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-100">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Order Ledger
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {loading ? "Verifying Records..." : `${orders.length} Authenticated Records`}
                </p>
              </div>
            </motion.div>

            {/* QUICK FILTER */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-xs font-bold text-slate-400 md:flex">
                <Filter className="h-3 w-3" />
                <span>Filter:</span>
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="h-11 w-48 rounded-2xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition-all focus:ring-indigo-500">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {STATUS_FILTERS.map((f) => (
                    <SelectItem key={f.value} value={f.value} className="font-medium">
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div key="loading" className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-[2rem]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white py-24 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                <Package className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-900">No Records Found</h3>
              <p className="mt-2 text-sm font-medium text-slate-400 max-w-[250px]">
                We couldn't find any {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} orders in your history.
              </p>
              <Button asChild className="mt-8 rounded-2xl bg-indigo-600 px-8 py-6 font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-4">
              {filtered.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/orders/${order.id}`}>
                    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50">
                      {/* Interactive Hover Accent */}
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-black tracking-tighter text-slate-900">
                              #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <Badge className={cn(
                              "rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-[0.1em]",
                              getStatusColor(order.status)
                            )}>
                              {order.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {order.orderItems.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tight"
                              >
                                <span className="text-indigo-600">{item.quantity}x</span>
                                <span className="truncate max-w-[120px]">{item.medicine?.name}</span>
                              </div>
                            ))}
                            {order.orderItems.length > 3 && (
                              <div className="flex items-center rounded-xl bg-indigo-50 px-3 py-1.5 text-[10px] font-black text-indigo-600">
                                +{order.orderItems.length - 3} MORE
                              </div>
                            )}
                          </div>
                          
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Transaction Date: {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Amount</p>
                            <p className="text-xl font-black text-indigo-600 tracking-tight">
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}