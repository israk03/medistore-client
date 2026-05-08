"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate, Variants } from "framer-motion";

const STATS = [
  { value: 2, label: "Happy Customers", suffix: "M+", decimals: 0 },
  { value: 10, label: "Products Available", suffix: "K+", decimals: 0 },
  { value: 4.8, label: "Average Rating", suffix: "/5", decimals: 1 },
  { value: 500, label: "Trusted Sellers", suffix: "+", decimals: 0 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function CountUp({ end, decimals = 0 }: { end: number; decimals?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, end, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function StatsSection() {
  return (
    <section className="relative py-12 -mt-12 z-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-8 md:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {STATS.map(({ label, suffix, value, decimals }, i) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1 }
                }}
                className="flex flex-col items-center justify-center text-center p-4 first:pt-0 last:pb-0 md:py-0"
              >
                <div className="text-4xl sm:text-5xl font-black bg-linear-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter mb-2">
                  <CountUp end={value} decimals={decimals} />
                  <span className="text-2xl sm:text-3xl ml-0.5">{suffix}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-widest leading-none">
                    {label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}