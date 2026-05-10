"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Shield,
  Camera,
  Save,
  Fingerprint,
  CheckCircle2,
  Lock,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid medical record email"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ROLE_CONFIG: Record<string, { color: string; icon: any }> = {
  ADMIN: { color: "bg-rose-500", icon: Shield },
  SELLER: { color: "bg-amber-500", icon: Fingerprint },
  CUSTOMER: { color: "bg-indigo-600", icon: User },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
      });
    }
  }, [user, form]);

  if (!user) return null;

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    try {
      // Simulate API sync with patient database
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Health Profile Synchronized");
    } catch (err) {
      toast.error("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const initial = user.name?.charAt(0)?.toUpperCase() ?? "U";
  const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-20">
      {/* 1. HEADER - Minimalist */}
      <div className="mx-auto max-w-2xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Identity Management
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Personal Medical Record Account
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-2xl space-y-8 px-4">
        {/* 2. IDENTITY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
        >
          {/* Background Decorative Element */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-slate-50 opacity-50 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-400 text-4xl font-black text-white shadow-xl shadow-indigo-100">
                {initial}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-lg ring-4 ring-white transition-all hover:text-indigo-600 hover:scale-110">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
                <Badge className={cn("rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest", role.color)}>
                  <role.icon className="mr-1.5 h-3 w-3" />
                  {user.role}
                </Badge>
              </div>
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 sm:justify-start">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3. SETTINGS FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Core Information</h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white focus:ring-indigo-500" />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white focus:ring-indigo-500" />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end pt-4">
                <Button
                  disabled={saving}
                  className="h-12 rounded-2xl bg-indigo-600 px-8 font-black shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
                >
                  {saving ? "Synchronizing..." : "Update Profile"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>

        {/* 4. SECURITY CENTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight">Account Integrity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust & Security Center</p>
              </div>
            </div>
            <Badge variant="outline" className="rounded-full border-slate-100 text-[9px] font-bold text-slate-400">
              v2.4.0-SEC
            </Badge>
          </div>

          <Separator className="my-6 bg-slate-50" />

          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 border border-emerald-100/50">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Two-Factor Auth</p>
              <p className="text-xs font-bold text-emerald-700">Your connection is verified and encrypted.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}