"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Truck, Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Authentic" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: Star, label: "Trusted Pharmacy" },
];

const STATS = [
  { value: "10K+", label: "Medicines" },
  { value: "500+", label: "Sellers" },
  { value: "4.8★", label: "Rating" },
  { value: "24/7", label: "Support" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-50 pt-20">
      
      {/* BACKGROUND DECORATIONS - Matching Footer/Navbar patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-violet-100/50 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">

          {/* LIVE STATUS BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full px-5 py-3 mt-10 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide">
              2M+ TRUSTED CUSTOMERS NATIONWIDE
            </span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </motion.div>

          {/* MAIN HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Your Health,{" "}
              <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                Delivered
              </span>
              <br className="hidden sm:block" />
              {" "}to Your Door
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              Browse thousands of authentic medicines from certified sellers. 
              Fast delivery, genuine products, and 24/7 care support.
            </p>
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-linear-to-r from-indigo-600 to-violet-500 hover:opacity-90 text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-indigo-200 transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-7 text-lg rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all duration-300 shadow-sm"
              >
                Become a Seller
              </Button>
            </Link>
          </motion.div>

          {/* STATS GRID - Using Navbar Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-2xl font-black text-indigo-600 tracking-tight">{value}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* TRUST BADGES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 pt-6 border-t border-slate-200/60"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shadow-inner">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 tracking-tight">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}