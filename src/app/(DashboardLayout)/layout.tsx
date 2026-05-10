"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

type DashboardLayoutProps = {
  admin: React.ReactNode;
  seller: React.ReactNode;
  customer: React.ReactNode;
};

export default function DashboardLayout({
  admin,
  seller,
  customer,
}: DashboardLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [isAuthenticated, user, loading, router]);

  // 1. MediStore Professional Loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulse */}
          <div className="absolute h-16 w-16 rounded-full border-4 border-indigo-50 animate-ping" />
          {/* Main Spinner */}
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin relative z-10" />
        </div>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Securing Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const slot =
    user.role === "ADMIN"
      ? admin
      : user.role === "SELLER"
      ? seller
      : customer;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Pinned */}
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        {/* 2. Content Area with Fade-in Animation */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={user.role} // Re-animate if role somehow changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              {slot}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}