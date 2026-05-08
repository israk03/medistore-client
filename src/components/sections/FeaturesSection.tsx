"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Truck, Shield, Clock, BadgeCheck,
  Tag, Users, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery available in Dhaka. Get your medicines when you need them most.",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your data and payments are fully encrypted and protected with bank-grade security.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our licensed healthcare support team is available to assist you anytime, day or night.",
  },
  {
    icon: BadgeCheck,
    title: "Authentic Products",
    description: "Every medicine is verified for authenticity. We source directly from top manufacturers.",
  },
  {
    icon: Tag,
    title: "Best Prices",
    description: "Compare prices across multiple sellers and get the most competitive rates available.",
  },
  {
    icon: Users,
    title: "Trusted by Millions",
    description: "Over 2 million customers nationwide rely on MediStore for their daily health needs.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative">
      {/* Visual Background Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
              The MediStore Advantage
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Why thousands of patients <br className="hidden sm:block" /> 
              choose <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">our platform</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              We combine cutting-edge technology with pharmaceutical expertise to provide a safer, faster shopping experience.
            </p>
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500"
            >
              {/* Icon Container */}
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-indigo-50 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-xl mb-3 group-hover:text-indigo-600 transition-colors">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {description}
              </p>
              
              {/* Subtle learn more link */}
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2.5 group-hover:translate-x-0 duration-300">
                Learn more <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM CTA CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[3rem] bg-slate-900 p-8 md:p-12 overflow-hidden relative"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to prioritize your health?</h3>
              <p className="text-slate-400 font-medium">Join 2M+ users who trust us for their monthly supplies.</p>
            </div>
            
            <Link href="/register">
              <Button
                size="lg"
                className="bg-linear-to-r from-indigo-600 to-violet-500 hover:opacity-90 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-900/20"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}