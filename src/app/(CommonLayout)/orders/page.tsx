"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag, ArrowRight, Package,
  Filter, ClipboardList,
} from "lucide-react";
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
import { formatPrice, formatDate, getStatusColor, cn } from "@/lib/utils";
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
        if (mounted && res?.success && res?.data) {
          setOrders(res.data);
        }
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

      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-16 z-20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#6B4FE0] to-[#2D9D78] shadow-lg">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  My Orders
                </h1>
                <p className="text-xs font-semibold text-slate-400">
                  {loading
                    ? "Loading..."
                    : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </motion.div>

            {/* Filter */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as OrderStatus | "ALL")}
              >
                <SelectTrigger className="h-11 w-48 rounded-xl border-slate-200 bg-white font-medium text-slate-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-32 rounded-2xl" />
    ))}
  </div>
)}

{!loading && filtered.length === 0 && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-24 text-center"
  >
    <Package className="h-12 w-12 text-slate-200" />
    <h3 className="mt-6 text-lg font-bold text-slate-900">No Orders Found</h3>
    <p className="mt-2 text-sm text-slate-400 max-w-xs">
      {statusFilter !== "ALL"
        ? `No ${statusFilter.toLowerCase()} orders yet.`
        : "You haven't placed any orders yet."}
    </p>
    <Button asChild className="mt-8 rounded-xl bg-[#6B4FE0] text-white px-8">
      <Link href="/shop">
        <ShoppingBag className="mr-2 h-4 w-4" />
        Browse Medicines
      </Link>
    </Button>
  </motion.div>
)}

{!loading && filtered.length > 0 && (
  <div className="space-y-4">
    {filtered.map((order, i) => (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >
        <Link href={`/orders/${order.id}`}>
          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-[#6B4FE0]/20 hover:shadow-lg">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-[#6B4FE0] opacity-0 transition-opacity group-hover:opacity-100 rounded-l-2xl" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <Badge className={cn("text-xs font-semibold", getStatusColor(order.status as OrderStatus))}>
                    {order.status}
                  </Badge>
                </div>
                {order.orderItems?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        <span className="text-[#6B4FE0] font-bold">{item.quantity}×</span>
                        <span className="truncate max-w-[120px]">{item.medicine?.name}</span>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="flex items-center rounded-xl bg-[#6B4FE0]/10 px-3 py-1 text-xs font-bold text-[#6B4FE0]">
                        +{order.orderItems.length - 3} more
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-slate-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0 gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-0.5">Total</p>
                  <p className="text-lg font-bold text-[#6B4FE0]">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-[#6B4FE0] group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}