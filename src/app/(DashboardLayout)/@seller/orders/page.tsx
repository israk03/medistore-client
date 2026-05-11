"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Filter,
  ChevronDown,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { sellerService } from "@/services/seller.service";
import {
  formatPrice,
  formatDate,
  getStatusColor,
  cn,
} from "@/lib/utils";

import { Order, OrderStatus } from "@/types/auth.types";
import { toast } from "sonner";

/* ---------------- STATUS FLOW ---------------- */

const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
} as const;

const STATUS_FILTERS = [
  { label: "All Orders", value: "ALL", icon: Package },
  { label: "Pending", value: "PLACED", icon: Clock },
  { label: "Processing", value: "PROCESSING", icon: MoreHorizontal },
  { label: "In Transit", value: "SHIPPED", icon: Truck },
  { label: "Completed", value: "DELIVERED", icon: CheckCircle2 },
  { label: "Cancelled", value: "CANCELLED", icon: Ban },
];

/* ---------------- COMPONENT ---------------- */

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // FIX #2 → allow Select compatibility
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */

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

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await sellerService.updateOrderStatus(
        orderId,
        newStatus
      );

      if (res?.success) {
        toast.success(`Order moved to ${newStatus}`);

        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Transition failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filtered = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "ALL" || o.status === statusFilter;

    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Order Ledger
          </h1>
          <p className="text-sm text-slate-400">
            Manage all medicine orders efficiently
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl pl-10"
            />
          </div>

          {/* FIX #2 */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "ALL")}
          >
            <SelectTrigger className="h-10 w-44 rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue />
              </div>
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

      {/* TABLE */}
      <div className="rounded-2xl border bg-white overflow-hidden">

        {/* HEADER ROW */}
        <div className="hidden lg:grid grid-cols-12 px-6 py-4 text-xs font-bold uppercase text-slate-400 bg-slate-50">
          <div className="col-span-3">Order</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-3">Items</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-slate-500 font-semibold">
              No orders found
            </p>
          </div>
        )}

        {/* ROWS */}
        <AnimatePresence>
          {!loading &&
            filtered.map((order) => {
              const nextStatuses =
                NEXT_STATUSES[order.status] ?? [];
              const isUpdating = updatingId === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-6 py-5 border-b hover:bg-slate-50"
                >
                  {/* ORDER */}
                  <div className="lg:col-span-3 font-mono font-bold">
                    #{order.id.slice(-8)}
                    <div className="text-xs text-slate-400">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div className="lg:col-span-2 text-sm">
                    {order.customer?.name ?? "Guest"}
                  </div>

                  {/* ITEMS */}
                  <div className="lg:col-span-3 text-xs text-slate-500">
                    {order.orderItems.slice(0, 2).map((i) => (
                      <div key={i.id}>
                        {i.medicine.name} × {i.quantity}
                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}
                  <div className="lg:col-span-1 font-bold text-indigo-600">
                    {formatPrice(order.totalAmount)}
                  </div>

                  {/* STATUS */}
                  <div className="lg:col-span-1">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* ACTION */}
                  <div className="lg:col-span-2 flex justify-end">
                    {nextStatuses.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="outline"
                            disabled={isUpdating}
                            className="h-8 text-xs"
                          >
                            {isUpdating ? "..." : "Update"}
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {nextStatuses.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() =>
                                handleStatusUpdate(order.id, status)
                              }
                            >
                              Mark as {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Final
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}