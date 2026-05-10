"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  Activity,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/features/dashboard/StatsCard";

import { orderService } from "@/services/order.service";
import { useAuth } from "@/context/AuthContext";

import { formatPrice, formatDate, getStatusColor, cn } from "@/lib/utils";
import type { Order } from "@/types/auth.types";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = {
    total: orders.length,
    placed: orders.filter((o) => o.status === "PLACED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    totalSpent: orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const recentOrders = orders.slice(0, 5);
  const firstName = user?.name?.split(" ")?.[0] ?? "Patient";

  return (
    <div className="max-w-6xl space-y-10 pb-10">
      {/* 1. WELCOME HERO - Clinical Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 p-8 text-white shadow-2xl shadow-indigo-200"
      >
        {/* Abstract Background Decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 right-10 opacity-10">
          <Activity className="h-40 w-40" />
        </div>

        <div className="relative z-10 flex flex-col items-start md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-100">Patient Portal</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Welcome back, {firstName}
            </h2>
            <p className="mt-2 text-indigo-50 max-w-md font-medium">
              Your health management system is up to date. You currently have 
              <span className="mx-1 font-black text-white decoration-emerald-400 underline-offset-4">
                {stats.placed} active prescriptions/orders
              </span> in progress.
            </p>
          </div>

          <Button
            asChild
            className="mt-6 h-12 rounded-2xl bg-white px-6 text-indigo-600 font-bold hover:bg-indigo-50 shadow-xl md:mt-0"
          >
            <Link href="/shop">
              Refill Medicines
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* 2. ANALYTICS GRID */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Vitals & Activity</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-[2rem]" />)
          ) : (
            <>
              <StatsCard title="Total Volume" value={stats.total} icon={ShoppingBag} color="purple" subtitle="All requests" />
              <StatsCard title="In Transit" value={stats.placed} icon={Clock} color="amber" subtitle="Active status" />
              <StatsCard title="Fulfilled" value={stats.delivered} icon={CheckCircle2} color="green" subtitle="Completed" />
              <StatsCard title="Investment" value={formatPrice(stats.totalSpent)} icon={Package} color="blue" subtitle="Total spent" />
            </>
          )}
        </div>
      </section>

      {/* 3. RECENT ORDERS LEDGER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Transactions</h3>
          </div>
          <Link href="/orders" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">
            View Ledger
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
          {loading ? (
            <div className="space-y-4 p-8">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="mt-4 font-bold text-slate-400">No order history found</p>
              <Button asChild variant="link" className="mt-2 text-indigo-600 font-bold">
                <Link href="/shop">Initialize first purchase</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between px-8 py-6 transition-colors hover:bg-slate-50/80"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 font-black text-slate-400 text-[10px]">
                        ID
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {formatDate(order.createdAt)} • {order.orderItems.length} Preparations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <Badge className={cn("rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest", getStatusColor(order.status))}>
                        {order.status}
                      </Badge>
                      <span className="min-w-[80px] text-right font-black text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}