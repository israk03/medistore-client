"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ShoppingBag,
  Calendar,
  ChevronRight,
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
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────
// Filters
// ─────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "All Orders", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();

        if (res?.success) {
          setOrders(res.data ?? []);
        }
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Order History
          </h1>

          <p className="text-sm font-medium text-slate-400 mt-1">
            {loading
              ? "Syncing orders..."
              : `Showing ${filteredOrders.length} orders`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-slate-300" />

          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as OrderStatus | "ALL")
            }
          >
            <SelectTrigger className="h-11 w-44 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-slate-700">
              <SelectValue placeholder="All Orders" />
            </SelectTrigger>

            <SelectContent className="bg-white rounded-xl border-slate-100 shadow-2xl">
              {STATUS_FILTERS.map((f) => (
                <SelectItem
                  key={f.value}
                  value={f.value}
                  className="font-bold focus:bg-slate-50"
                >
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-32 w-full rounded-3xl"
            />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        // EMPTY STATE
        <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-slate-200" />
          </div>

          <h2 className="text-xl font-black text-slate-900">
            No orders here yet
          </h2>

          <p className="text-slate-400 mt-2 mb-8 max-w-xs mx-auto">
            Looks like you haven't placed any medicine orders recently.
          </p>

          <Button
            asChild
            className="rounded-2xl bg-indigo-600 px-8 h-12 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            <Link href="/medicines">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        // ORDERS LIST
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="group relative w-full bg-white border border-slate-100 rounded-[2rem] p-6 text-left hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50/50 flex flex-col sm:flex-row sm:items-center gap-6 block"
                >
                  {/* LEFT */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-slate-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>

                      <Badge
                        className={cn(
                          "rounded-lg px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border-none",
                          getStatusColor(order.status)
                        )}
                      >
                        {order.status}
                      </Badge>
                    </div>

                    {/* ITEMS */}
                    <div className="flex flex-wrap gap-2">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-500"
                        >
                          <span className="text-indigo-600">
                            {item.quantity}x
                          </span>

                          {item.medicine?.name}
                        </div>
                      ))}

                      {order.orderItems.length > 2 && (
                        <div className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[11px] font-black">
                          +{order.orderItems.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* DATE */}
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />

                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:pl-8 sm:border-l border-slate-50">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        Amount
                      </p>

                      <p className="text-2xl font-black text-indigo-600">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}