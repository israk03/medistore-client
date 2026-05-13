"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Pill,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/features/dashboard/StatsCard";

import { sellerService } from "@/services/seller.service";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { Medicine, Order } from "@/types/auth.types";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(" ")?.[0] ?? "Seller";

  useEffect(() => {
    let mounted = true;
    Promise.all([
      sellerService.getMyMedicines(),
      sellerService.getOrders(),
    ]).then(([medRes, ordRes]) => {
      if (!mounted) return;
      if (medRes.success && medRes.data) setMedicines(medRes.data);
      if (ordRes.success && ordRes.data) setOrders(ordRes.data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const stats = {
    totalMedicines: medicines.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => ["PLACED", "PENDING"].includes(o.status)).length,
    revenue: orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    lowStockCount: medicines.filter((m) => m.stock < 10).length,
  };

  const recentOrders = orders.slice(0, 5);
  const lowStockMedicines = medicines
    .filter((m) => m.stock < 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Store Overview
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Welcome back, {firstName}. Here is your pharmacy status for today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="pr-3 text-xs font-bold text-slate-600">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 2. PRIORITY BANNER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              Live Operations
            </Badge>
            <h2 className="text-2xl font-black">
              Action Required: {stats.pendingOrders} New Orders
            </h2>
            <p className="max-w-md text-sm font-medium text-slate-400 leading-relaxed">
              Dispatch pending prescriptions to maintain your store's reliability rating and customer satisfaction.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button asChild className="h-12 rounded-2xl bg-white font-black text-slate-900 hover:bg-slate-100">
              <Link href="/orders">
                Process Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/5 font-bold text-white hover:bg-white/10">
              <Link href="/medicines">Audit Inventory</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 3. CORE STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Catalogue size" value={stats.totalMedicines} icon={Pill} color="purple" subtitle="Active Listings" />
        <StatsCard title="Total Volume" value={stats.totalOrders} icon={ShoppingBag} color="blue" subtitle="Lifetime Sales" />
        <StatsCard title="Pending Fulfillment" value={stats.pendingOrders} icon={Package} color="amber" subtitle="Awaiting Action" />
        <StatsCard title="Gross Revenue" value={formatPrice(stats.revenue)} icon={TrendingUp} color="green" subtitle="Cleared Earnings" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
        {/* 4. RECENT ORDERS TABLE */}
        <div className="lg:col-span-4 rounded-[2rem] border border-slate-100 bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="font-black tracking-tight text-slate-900">Incoming Orders</h3>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-indigo-600">
              <Link href="/orders">View Ledger</Link>
            </Button>
          </div>

          <div className="px-4 pb-4">
            <div className="overflow-hidden rounded-2xl border border-slate-50">
              {loading ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="py-20 text-center">
                  <Package className="mx-auto h-12 w-12 text-slate-200" />
                  <p className="mt-2 text-sm font-bold text-slate-400">No active orders found.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Patient/Client</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="group cursor-pointer hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600 uppercase">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700">{order.customer?.name || "Guest"}</p>
                          <p className="text-[10px] font-medium text-slate-400">{formatDate(order.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn("rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-tighter", getStatusColor(order.status))}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* 5. CRITICAL STOCK ALERTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h3 className="font-black tracking-tight text-slate-900">Stock Alerts</h3>
              </div>
              <Badge className="bg-rose-100 text-rose-600 border-none font-black text-[10px]">
                {stats.lowStockCount} Items
              </Badge>
            </div>

            <div className="space-y-4">
              {lowStockMedicines.map((med) => (
                <div key={med.id} className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <div>
                      <p className="text-xs font-black text-slate-700 line-clamp-1">{med.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{med.category?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-black", med.stock === 0 ? "text-rose-600" : "text-amber-600")}>
                      {med.stock === 0 ? "EMPTY" : `${med.stock} UNIT`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="mt-6 w-full h-11 rounded-xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50">
              <Link href="/medicines">Restock All</Link>
            </Button>
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-[2rem] bg-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-4 w-4 text-indigo-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Live Health</span>
            </div>
            <p className="text-2xl font-black">98.4%</p>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Fulfillment Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}