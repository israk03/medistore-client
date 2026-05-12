"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call for production-like feel
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-linear-to-br from-indigo-600 to-violet-700 rounded-[3rem] px-8 py-16 md:py-20 text-center overflow-hidden shadow-2xl shadow-indigo-200"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            {/* Icon Header */}
            <div className="inline-flex relative">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-4xl flex items-center justify-center mx-auto shadow-xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <motion.div 
                animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-1 -right-1 text-violet-200"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Stay Healthy, <span className="text-violet-200">Stay Updated.</span>
              </h2>
              <p className="text-indigo-100/80 text-lg font-medium">
                Get health tips, product alerts, and exclusive deals 
                delivered straight to your personal inbox.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div>
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white shadow-inner"
                  >
                    <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">Welcome to the family!</p>
                      <p className="text-indigo-100/70 text-sm">Check your inbox for a special welcome gift.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row gap-3 p-2 bg-black/10 backdrop-blur-md border border-white/10 rounded-4xl shadow-inner"
                  >
                    <Input
                      type="email"
                      placeholder="Your best email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-transparent border-none text-white placeholder:text-white/40 flex-1 h-14 px-6 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-2xl h-14 px-8 shrink-0 group shadow-lg transition-all active:scale-95 disabled:opacity-70"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span className="flex items-center">
                          Join Now
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </motion.form>
                )}
              </div>
            </div>

            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Join 50k+ Subscribers • Secure & Private
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}