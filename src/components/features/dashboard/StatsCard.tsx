"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ElementType;
  color?: "purple" | "green" | "amber" | "red" | "blue";
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const COLOR_MAP = {
  purple: {
    bg: "bg-indigo-50/50",
    icon: "text-indigo-600",
    accent: "bg-indigo-600",
    glow: "shadow-indigo-100",
  },
  green: {
    bg: "bg-emerald-50/50",
    icon: "text-emerald-600",
    accent: "bg-emerald-600",
    glow: "shadow-emerald-100",
  },
  amber: {
    bg: "bg-amber-50/50",
    icon: "text-amber-600",
    accent: "bg-amber-600",
    glow: "shadow-amber-100",
  },
  red: {
    bg: "bg-rose-50/50",
    icon: "text-rose-600",
    accent: "bg-rose-600",
    glow: "shadow-rose-100",
  },
  blue: {
    bg: "bg-blue-50/50",
    icon: "text-blue-600",
    accent: "bg-blue-600",
    glow: "shadow-blue-100",
  },
} as const;

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "purple",
  trend,
  className,
}: StatsCardProps) {
  const colors = COLOR_MAP[color];
  const isPositiveTrend = trend ? trend.value >= 0 : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50",
        className
      )}
    >
      {/* Background Glow Accent */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20",
        colors.accent
      )} />

      {/* HEADER: Icon and Title */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {value}
          </h2>
        </div>

        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[1.25rem] shadow-sm transition-transform group-hover:rotate-6",
          colors.bg,
          colors.glow
        )}>
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
      </div>

      {/* SUBTITLE OR TREND */}
      <div className="mt-6 flex items-center justify-between">
        {subtitle && (
          <p className="text-xs font-bold text-slate-400">
            {subtitle}
          </p>
        )}

        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide uppercase",
            isPositiveTrend 
              ? "bg-emerald-50 text-emerald-600" 
              : "bg-rose-50 text-rose-600"
          )}>
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* FOOTER LABEL (If trend exists) */}
      {trend && (
        <p className="mt-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
          {trend.label}
        </p>
      )}
    </motion.div>
  );
}