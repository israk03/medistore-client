"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Filter,
  Search,
  MapPin,
  Calendar,
  CreditCard,
  User,
  ExternalLink,
  ClipboardList,
  AlertCircle
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const handleViewDetail = async (order: Order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    try {
      const res = await adminService.getOrderById(order.id);
      if (res.success && res.data) setSelectedOrder(res.data);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-10">
      
      {/* 1. AUDIT HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Ledger</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            {loading ? "Synchronizing..." : `${orders.length} transactions in registry`}
          </p>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
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
          <SelectTrigger className="w-full md:w-56 h-12 rounded-xl font-bold border-slate-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value} className="font-bold text-xs">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. ORDER TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="col-span-2">Order Reference</div>
          <div className="col-span-3">Customer Entity</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2 text-center">Lifecycle Status</div>
          <div className="col-span-2 text-right">Total Value</div>
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
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching records</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((order) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={order.id}
                  className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-8 py-6 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="col-span-2">
                    <span className="font-black text-slate-900 text-sm tracking-tighter">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{order.customer?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{order.customer?.email}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-[11px] font-medium text-slate-500">
                    {formatDate(order.createdAt)}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <Badge variant="outline" className={cn(
                      "rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter border-2",
                      getStatusColor(order.status)
                    )}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-sm font-black text-indigo-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleViewDetail(order)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* 4. DETAIL OVERLAY */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 text-white">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight">Order Audit</DialogTitle>
              </div>
              <DialogDescription className="text-slate-400 font-medium">
                Internal reference: {selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            {detailLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            ) : selectedOrder ? (
              <>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <User className="h-3 w-3" /> Customer Profile
                    </h4>
                    <p className="font-bold text-slate-900">{selectedOrder.customer?.name}</p>
                    <p className="text-xs text-slate-500">{selectedOrder.customer?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Shipping Logistics
                    </h4>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Package className="h-3 w-3" /> Line Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-xs font-black text-slate-900">{item.medicine.name}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4 bg-slate-200" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">Total Settlement</span>
                    <span className="text-lg font-black text-indigo-600">
                      {formatPrice(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-[11px] font-bold">
                    This order is currently in <span className="underline">{selectedOrder.status}</span> state. 
                    Modification of status should only be handled via the Logistics Service.
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}