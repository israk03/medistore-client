"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Pill, Leaf, Eye, Heart, Brain,
  Baby, Wind, Smile, Activity, Shield,
  Thermometer, Droplets, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Pain Relief", icon: Pill },
  { name: "Vitamins", icon: Leaf },
  { name: "Eye Care", icon: Eye },
  { name: "Heart Care", icon: Heart },
  { name: "Mental Health", icon: Brain },
  { name: "Baby Care", icon: Baby },
  { name: "Respiratory", icon: Wind },
  { name: "Oral Care", icon: Smile },
  { name: "Diabetes", icon: Activity },
  { name: "Antibiotics", icon: Shield },
  { name: "Allergy", icon: Thermometer },
  { name: "Digestive", icon: Droplets },
];


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.05 
    }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: "easeOut" // Now TS knows this matches the Easing type
    } 
  },
};

export function CategoriesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Medical Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-slate-500 max-w-md font-medium">
              Find the right care with our organized medical categories.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/shop" 
              className="group flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All Categories 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* CATEGORY GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5"
        >
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <motion.div key={name} variants={itemVariants}>
              <Link href={`/shop?category=${name.toLowerCase()}`}>
                <div className="group relative bg-slate-50 hover:bg-white rounded-4xl p-6 text-center border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                  
                  {/* ICON CONTAINER */}
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:bg-linear-to-br group-hover:from-indigo-600 group-hover:to-violet-500 transition-all duration-500">
                    <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {name}
                  </h3>
                  
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore items
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}