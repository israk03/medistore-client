"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Filter,
  ChevronDown,
  Search,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Manage fulfillment and track delivery routes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl pl-10 border-slate-200 bg-white focus:ring-indigo-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
            <SelectTrigger className="h-11 w-48 rounded-xl border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl rounded-xl">
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value} className="focus:bg-slate-50 font-semibold">{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 border-b border-slate-200">
          <div className="col-span-2">Order / Date</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-4 text-center">Delivery Address</div>
          <div className="col-span-2">Items</div>
          <div className="col-span-2 text-right">Status & Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-lg">No active orders</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((order) => {
                const nextStatuses = NEXT_STATUSES[order.status] ?? [];
                return (
                  <motion.div
                    key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8 items-start hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Order Reference */}
                    <div className="lg:col-span-2">
                      <div className="font-mono font-bold text-indigo-600 text-sm tracking-tighter">
                        #{order.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="lg:col-span-2">
                      <p className="text-sm font-black text-slate-900 leading-tight">
                        {order.customer?.name ?? "Guest User"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 truncate">{order.customer?.email}</p>
                    </div>

                    {/* Delivery Address - Centralized and Boxed */}
                    <div className="lg:col-span-4">
                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 flex gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                        <div>
                           <p className="text-[12px] font-bold text-slate-700 leading-relaxed">
                            {order.shippingAddress || "Standard Pickup"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Items - Secondary but clear */}
                    <div className="lg:col-span-2">
                      <div className="space-y-1.5 pt-1">
                        {order.orderItems.map((i) => (
                          <div key={i.id} className="text-[11px] text-slate-500 font-medium">
                            <span className="text-slate-900 font-black mr-1">{i.quantity}x</span> 
                            {i.medicine.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action & Status */}
                    <div className="lg:col-span-2 flex flex-col items-end gap-3">
                      <div className="flex flex-col items-end">
                        <Badge className={cn(getStatusColor(order.status), "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase border-none mb-1")}>
                          {order.status}
                        </Badge>
                        <span className="font-black text-slate-900 text-sm">{formatPrice(order.totalAmount)}</span>
                      </div>

                      {nextStatuses.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="outline" className="h-10 w-full lg:w-32 rounded-xl text-xs font-bold border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
                              {updatingId === order.id ? "Updating..." : "Update Status"}
                              <ChevronDown className="ml-2 h-3 w-3" />
                            </Button>
                          }/>
                          <DropdownMenuContent align="end" className="bg-white rounded-xl border-slate-200 shadow-2xl min-w-[160px] p-1.5">
                            {nextStatuses.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                className="text-xs font-bold py-2.5 px-3 rounded-lg focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer mb-1 last:mb-0"
                                onClick={() => handleStatusUpdate(order.id, status)}
                              >
                                Move to {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                          Processed
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}