"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Filter,
  Search,
  ChevronRight,
  ClipboardList
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/services/admin.service";
import { formatPrice, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Order } from "@/types/auth.types";

const STATUS_FILTERS = [
  { label: "All Transactions", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

type StatusFilter = typeof STATUS_FILTERS[number]["value"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await adminService.getOrders(statusFilter);
        if (res.success && res.data) setOrders(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => 
      o.id.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  return (
    <div className="space-y-8 max-w-7xl pb-10 px-4">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-indigo-600" />
            Order Ledger
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            {loading ? "Synchronizing registry..." : `${orders.length} transactions recorded`}
          </p>
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by ID, Name, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-xl border-none bg-slate-50 focus-visible:ring-indigo-500"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full md:w-56 h-12 rounded-xl font-bold border-slate-100 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white border-slate-200">
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value} className="font-bold text-xs">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="col-span-2">Order Ref</div>
          <div className="col-span-3">Customer Entity</div>
          <div className="col-span-2 text-center">Lifecycle</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Value</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-8"><Skeleton className="h-10 w-full rounded-xl" /></div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Package className="mx-auto h-12 w-12 text-slate-100 mb-4" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching records found</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-8 py-6 hover:bg-indigo-50/30 transition-colors group"
                >
                  {/* Order Ref */}
                  <div className="md:col-span-2">
                    <p className="font-mono font-bold text-indigo-600 text-xs tracking-tighter">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="md:col-span-3">
                    <p className="text-sm font-black text-slate-900 leading-tight">
                      {order.customer?.name ?? "Guest Account"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">
                      {order.customer?.email}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="md:col-span-2 flex justify-center">
                    <Badge className={cn(getStatusColor(order.status), "rounded-lg px-2.5 py-1 text-[9px] font-black uppercase border-none")}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* Timestamp */}
                  <div className="md:col-span-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-right">
                    <span className="font-black text-slate-900 text-sm">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  {/* Action Navigation */}
                  <div className="md:col-span-1 flex justify-end">
                    <button 
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                      title="Audit Order"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}