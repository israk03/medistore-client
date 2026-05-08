"use client";

import { motion, Variants } from "framer-motion";
import { Star, Quote, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Fatima Akter",
    initials: "FA",
    rating: 5,
    location: "Dhaka",
    text: "MediStore has been a lifesaver! I get my monthly medicines delivered right to my door. The quality is always top-notch and the prices are unbeatable.",
  },
  {
    name: "Md. Rafiqul Islam",
    initials: "RI",
    rating: 5,
    location: "Chittagong",
    text: "Excellent service! I ordered late at night and the medicines were at my doorstep by morning. The app is easy to use and customer service is very helpful.",
  },
  {
    name: "Nasrin Begum",
    initials: "NB",
    rating: 4,
    location: "Sylhet",
    text: "As someone with chronic conditions, I need reliable medicine supply. MediStore never lets me down. Authentic products, fair prices, and fast delivery.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
              Customer Feedback
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">2M+ Patients</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Real experiences from people who rely on us for their health.
          </p>
        </div>

        {/* TESTIMONIAL GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {TESTIMONIALS.map(({ name, initials, rating, location, text }, i) => (
            <motion.div
              key={name}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="relative group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-8 right-8">
                <Quote className="w-10 h-10 text-indigo-50 opacity-10 group-hover:text-indigo-100 group-hover:opacity-100 transition-all duration-500" />
              </div>

              {/* RATING STARS */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      j < rating 
                        ? "fill-amber-400 text-amber-400 group-hover:scale-110" 
                        : "text-slate-200"
                    )}
                    style={{ transitionDelay: `${j * 50}ms` }}
                  />
                ))}
              </div>

              {/* TESTIMONIAL TEXT */}
              <blockquote className="text-slate-600 leading-relaxed font-medium italic mb-8 relative z-10">
                "{text}"
              </blockquote>

              {/* AUTHOR INFO */}
              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">
                  {initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    {location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}