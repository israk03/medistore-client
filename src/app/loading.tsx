"use client";

import { motion } from "framer-motion";
import { Pill, Activity, ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Brand Icon Animation Container */}
      <div className="relative mb-8">
        {/* Pulsing Background Rings */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-indigo-100"
        />
        
        {/* Rotating Spinner */}
        <div className="relative h-24 w-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
        
        {/* Centered Brand Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200"
          >
            <Pill className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </div>

      {/* Loading Context */}
      <div className="text-center space-y-4 max-w-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            MediStore Ledger
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span>Syncing Inventory</span>
          </div>
        </div>

        {/* Professional Progress Bar */}
        <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent"
          />
        </div>

        {/* Security Tagline */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-300" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Secure Encryption
          </span>
        </div>
      </div>
    </div>
  );
}