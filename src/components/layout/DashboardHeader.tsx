"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Search, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  "/customer/dashboard": "Patient Overview",
  "/seller/dashboard": "Vendor Analytics",
  "/admin/dashboard": "System Control",
  "/orders": "Purchase History",
  "/profile": "Account Settings",
  "/seller/medicines": "Inventory Manager",
  "/seller/orders": "Order Fulfilment",
  "/admin/users": "Identity Management",
  "/admin/orders": "Global Orders",
  "/admin/categories": "Pharmacology Catalog",
};

export function DashboardHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
    const matchedRoute = Object.keys(ROUTE_LABELS).find((route) => pathname.startsWith(route));
    if (matchedRoute) return ROUTE_LABELS[matchedRoute];
    const lastSegment = pathname.split("/").filter(Boolean).pop();
    return lastSegment?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";
  }, [pathname]);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-BD", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-100/60 bg-white/80 px-6 backdrop-blur-md"
    >
      {/* 1. Breadcrumb & Title Section */}
      <div className="flex items-center gap-4 pl-12 lg:pl-0">
        <div className="hidden flex-col sm:flex">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span>MediStore</span>
            <ChevronRight className="h-2.5 w-2.5" />
            <span className="text-indigo-500">Internal</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* 2. Utility & User Section */}
      <div className="flex items-center gap-3">
        {/* Date Display - Pill Style */}
        <div className="hidden items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 border border-slate-100 sm:flex">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">{today}</span>
        </div>

        {/* Search & Notifications */}
        <div className="flex items-center gap-2 pr-2">
          <button className="group flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          <button className="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50">
            <Bell className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
          </button>
        </div>

        {/* 3. Role-Aware Profile Section */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-900 leading-none mb-1">
                {user.name}
              </p>
              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest leading-none">
                Verified {user.role}
              </p>
            </div>
            
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl font-bold text-white shadow-lg",
              user.role === "ADMIN" ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-100" :
              user.role === "SELLER" ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-100" :
              "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-100"
            )}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}