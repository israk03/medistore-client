"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Users,
  Package,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { StatsCard } from "@/components/features/dashboard/StatsCard";

import { adminService } from "@/services/admin.service";

import { formatPrice, cn } from "@/lib/utils";

import { DashboardStats } from "@/types/auth.types";

import { useAuth } from "@/context/AuthContext";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: "easeOut" as const,
  },
};

const STATUS_CONFIG = {
  placed: {
    label: "Placed",
    icon: Package,
    color: "bg-blue-500",
    text: "text-blue-600",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "bg-amber-500",
    text: "text-amber-600",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-500",
    text: "text-purple-600",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-emerald-500",
    text: "text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-rose-500",
    text: "text-rose-600",
  },
};

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();

        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const deliveryRate = useMemo(() => {
    if (!stats || stats.orders.total === 0) return 0;

    return Math.round(
      (stats.orders.byStatus.delivered / stats.orders.total) * 100
    );
  }, [stats]);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-slate-400">
        <Activity className="mb-4 h-12 w-12 opacity-20" />

        <p className="font-bold">
          System metrics temporarily unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8 pb-12">

      {/* HERO BANNER */}
      <motion.div
        {...fadeUp}
        className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200"
      >
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-colors group-hover:bg-indigo-500/20" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">
                System Authority
              </h2>

              <p className="text-sm font-medium text-slate-400">
                Logged in as {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-2 pr-4 backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="h-4 w-4 fill-current" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              System Live
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <StatsCard
          title="Gross Volume"
          value={formatPrice(stats.revenue.total)}
          icon={TrendingUp}
          color="green"
          subtitle="Lifetime settled revenue"
        />

        <StatsCard
          title="Total Ecosystem"
          value={stats.users.total}
          icon={Users}
          color="purple"
          subtitle={`${stats.users.customers} Active Buyers`}
        />

        <StatsCard
          title="Verified Sellers"
          value={stats.users.sellers}
          icon={UserCheck}
          color="blue"
          subtitle="Merchant network size"
        />

        <StatsCard
          title="Medicine Vault"
          value={stats.medicines}
          icon={Package}
          color="amber"
          subtitle="Unique SKUs listed"
        />
      </div>

      {/* OPERATIONAL GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

        {/* ORDER PIPELINE */}
        <motion.div
          {...fadeUp}
          className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm lg:col-span-3"
        >
          <div className="mb-8 flex items-center justify-between">

            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
              Order Pipeline
            </h3>

            <Badge
              variant="outline"
              className="rounded-lg border-slate-100 font-bold"
            >
              {stats.orders.total} Total Requests
            </Badge>
          </div>

          <div className="space-y-6">

            {(
              Object.entries(STATUS_CONFIG) as Array<
                [
                  keyof typeof STATUS_CONFIG,
                  (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG]
                ]
              >
            ).map(([key, config]) => {
              const value = stats.orders.byStatus[key];

              const percentage =
                stats.orders.total > 0
                  ? Math.round(
                      (value / stats.orders.total) * 100
                    )
                  : 0;

              const Icon = config.icon;

              return (
                <div key={key} className="group">

                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={cn(
                          "rounded-xl bg-slate-50 p-2 text-slate-400 transition-transform group-hover:scale-110"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <span className="text-sm font-bold text-slate-600">
                        {config.label}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">
                        {value}
                      </span>

                      <span className="ml-2 text-[10px] font-bold text-slate-400">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "h-full rounded-full",
                        config.color
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* EFFICIENCY & MIX */}
        <motion.div
          {...fadeUp}
          className="space-y-6 lg:col-span-2"
        >

          {/* EFFICIENCY CARD */}
          <div className="rounded-4xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-100">

            <div className="mb-6 flex items-center justify-between">

              <h3 className="text-sm font-black uppercase tracking-widest text-indigo-200">
                Fulfillment Efficiency
              </h3>

              <Activity className="h-5 w-5 text-indigo-300" />
            </div>

            <div className="mb-2 flex items-baseline gap-2">

              <span className="text-5xl font-black">
                {deliveryRate}%
              </span>

              <span className="text-sm font-bold text-indigo-200">
                Success
              </span>
            </div>

            <div className="mb-4 h-3 overflow-hidden rounded-full bg-indigo-900/30">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${deliveryRate}%` }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="h-full rounded-full bg-white"
              />
            </div>

            <p className="text-xs font-medium leading-relaxed text-indigo-100">
              Based on the ratio of successfully delivered
              items against the total volume of processed
              orders.
            </p>
          </div>

          {/* PLATFORM MIX */}
          <div className="rounded-4xl border border-slate-100 bg-white p-8">

            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">
              Platform Mix
            </h3>

            <div className="space-y-4">

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-blue-500" />

                  <span className="text-sm font-bold text-slate-700">
                    Customers
                  </span>
                </div>

                <span className="font-black text-slate-900">
                  {stats.users.customers}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">
                  <UserX className="h-5 w-5 text-amber-500" />

                  <span className="text-sm font-bold text-slate-700">
                    Sellers
                  </span>
                </div>

                <span className="font-black text-slate-900">
                  {stats.users.sellers}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="max-w-6xl animate-pulse space-y-8">

      <Skeleton className="h-48 w-full rounded-[2.5rem]" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-3xl"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

        <Skeleton className="h-112.5 rounded-4xl lg:col-span-3" />

        <Skeleton className="h-112.5 rounded-4xl lg:col-span-2" />
      </div>
    </div>
  );
}