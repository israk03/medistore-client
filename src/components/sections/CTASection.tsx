"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Store, Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative rounded-[3.5rem] overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 shadow-2xl shadow-indigo-200/50"
        >
          {/* Complex Background Decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-125 h-125 rounded-full bg-white/10 blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-100 h-100 rounded-full bg-violet-400/20 blur-[80px]" />
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-10 mask-[radial-gradient(ellipse_at_center,white,transparent)] bg-[grid-white_20px]" />
          </div>

          <div className="relative z-10 px-6 py-16 md:py-24 text-center max-w-4xl mx-auto space-y-8">
            {/* Floating Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white text-xs font-bold uppercase tracking-[0.2em]"
            >
              <Rocket className="w-4 h-4 text-violet-300" />
              Empowering Local Pharmacies
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Start Selling Your <br className="hidden md:block" /> 
              Medicines <span className="text-violet-200">Today.</span>
            </h2>

            <p className="text-indigo-100/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Join 500+ verified pharmacies on MediStore. Reach millions of customers 
              and scale your healthcare business with our digital tools.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm font-bold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 0% Listing Fees
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Instant Payouts
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 24/7 Seller Support
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 px-10 py-8 text-lg rounded-2xl font-black shadow-2xl shadow-indigo-900/40 group transition-all duration-300 active:scale-95 inline-flex items-center justify-center"
              >
                Become a Seller
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link
                href="/shop"
                className="w-full sm:w-auto border border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-10 py-8 text-lg rounded-2xl font-bold transition-all inline-flex items-center justify-center"
              >
                Browse the Marketplace
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}