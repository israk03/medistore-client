"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Filter, ChevronDown, Search,
  CheckCircle2, MapPin, Clock, User, ShoppingBag
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { sellerService } from "@/services/seller.service";
import { formatPrice, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/auth.types";
import { toast } from "sonner";

const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
} as const;

const STATUS_FILTERS = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending", value: "PLACED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "In Transit", value: "SHIPPED" },
  { label: "Completed", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await sellerService.getOrders();
      if (res?.success) setOrders(res.data ?? []);
    } catch {
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await sellerService.updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        toast.success(`Order moved to ${newStatus}`);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Transition failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10 px-4">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pt-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Ledger</h1>
          <p className="text-base text-slate-500 font-medium mt-1">Real-time fulfillment tracking.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl pl-12 border-slate-200 bg-white focus:ring-indigo-500 shadow-sm text-base"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
            <SelectTrigger className="h-14 w-52 rounded-2xl border-slate-200 bg-white shadow-sm font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-500" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-2xl rounded-2xl">
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value} className="focus:bg-indigo-50 font-bold py-3 px-4">{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ledger List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-[2rem]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black text-xl">No orders found in this category</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((order) => {
              const nextStatuses = NEXT_STATUSES[order.status] ?? [];
              return (
                <motion.div
                  key={order.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* 1. Customer & ID Block */}
                    <div className="lg:col-span-3 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 pr-0 lg:pr-8">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {formatDate(order.createdAt)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-inner">
                          {order.customer?.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900">{order.customer?.name || "Guest"}</p>
                          <p className="text-xs font-bold text-slate-400 truncate">{order.customer?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Shipping - LARGE TEXT */}
                    <div className="lg:col-span-4 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-500">
                        <MapPin className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Shipping Address</span>
                      </div>
                      <p className="text-base font-bold text-slate-700 leading-relaxed lg:pr-6">
                        {order.shippingAddress || "Standard Store Pickup"}
                      </p>
                    </div>

                    {/* 3. Purchase - HIGH VISIBILITY */}
                    <div className="lg:col-span-3 space-y-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Order Summary</span>
                      </div>
                      <div className="space-y-1.5">
                        {order.orderItems.map((i) => (
                          <div key={i.id} className="flex items-center justify-between text-sm">
                            <span className="font-bold text-slate-800">
                              <span className="text-indigo-600 mr-2">{i.quantity}x</span> 
                              {i.medicine.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-2xl font-black text-slate-900 pt-1">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {/* 4. Action & Status */}
                    <div className="lg:col-span-2 flex flex-col items-center lg:items-end gap-4">
                      <Badge className={cn(getStatusColor(order.status), "rounded-xl px-5 py-2 text-[10px] font-black uppercase border-none shadow-sm w-full lg:w-auto text-center justify-center")}>
                        {order.status}
                      </Badge>
                      
                      {nextStatuses.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button 
                              variant="outline" 
                              className="h-14 w-full lg:w-36 rounded-2xl text-[11px] font-black uppercase border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                              Update Status
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white rounded-2xl border-slate-200 shadow-2xl min-w-[200px] p-2 z-[100]">
                            {nextStatuses.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                className="text-[11px] font-black uppercase py-4 px-5 rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer mb-1 last:mb-0"
                                onClick={() => handleStatusUpdate(order.id, status)}
                              >
                                Move to {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="h-14 w-full lg:w-36 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-[11px] font-black uppercase">Complete</span>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}