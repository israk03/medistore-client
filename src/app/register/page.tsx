"use client";
import { GoogleLoginButton } from "@/components/common/GoogleLoginButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Pill,
  Mail,
  Lock,
  User,
  ShoppingBag,
  Store,
  Info,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// =========================
// Validation Schema
// =========================

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Full name must be at least 3 characters"),

    email: z
      .string()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "Password must contain letters and numbers"
      ),

    confirmPassword: z.string(),

    role: z.enum(["CUSTOMER", "SELLER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

declare global {
  interface Window {
    google: any;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
  const checkGoogleLoaded = setInterval(() => {
    if (window.google) {
      setGoogleLoaded(true);

      window.google.accounts.id.initialize({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      });

      clearInterval(checkGoogleLoaded);
    }
  }, 500);

  return () => clearInterval(checkGoogleLoaded);
}, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });

  const selectedRole = form.watch("role");

  // =========================
  // Submit Handler
  // =========================

  const onSubmit = async (values: RegisterFormValues) => {
  if (isLoading) return;

  setIsLoading(true);

  try {
    const res = await authService.register({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    // ✅ safety check (IMPORTANT)
    if (!res?.success || !res.data) {
      toast.error(res?.message || "Registration failed.");
      return;
    }

    const { user, token } = res.data;

    // ✅ FIX: use token (NOT accessToken)
    login(user, token);

    toast.success(`Welcome, ${user.name.split(" ")[0]}`);

    const destination =
  user.role === "SELLER"
    ? "/dashboard"
    : "/dashboard";

    router.push(destination);
  } catch (err: any) {
    toast.error(err?.message || "Registration failed.");
  } finally {
    setIsLoading(false);
  }
};



  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />

      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-8 md:p-10 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Pill className="text-white w-5 h-5" />
              </div>

              <span className="text-2xl font-black text-slate-900">
                MediStore
              </span>
            </Link>

            <h1 className="text-2xl font-bold text-slate-900">
              Join the Marketplace
            </h1>

            <p className="text-slate-500 mt-2">
              Start your journey with us today.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex gap-3">
                      {/* CUSTOMER */}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange("CUSTOMER")
                        }
                        className={cn(
                          "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                          field.value === "CUSTOMER"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-600"
                            : "border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <ShoppingBag className="w-6 h-6" />

                        <span className="text-xs font-bold uppercase">
                          Customer
                        </span>
                      </button>

                      {/* SELLER */}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange("SELLER")
                        }
                        className={cn(
                          "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                          field.value === "SELLER"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-600"
                            : "border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <Store className="w-6 h-6" />

                        <span className="text-xs font-bold uppercase">
                          Seller
                        </span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              {/* Seller Info */}
              <AnimatePresence>
                {selectedRole === "SELLER" && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl flex items-start gap-3 shadow-lg shadow-indigo-100">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />

                      <p className="text-[13px] font-medium leading-snug">
                        Instant Registration: No
                        documents needed right now!
                        Start setting up your shop
                        immediately. Verification
                        mail will be sent after
                        signup.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />

                        <Input
                          placeholder="Full Name"
                          className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage className="text-xs ml-2" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />

                        <Input
                          placeholder="Email Address"
                          type="email"
                          className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage className="text-xs ml-2" />
                  </FormItem>
                )}
              />

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                          <Input
                            placeholder="Password"
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600"
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage className="text-xs ml-2" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="Confirm"
                            type={
                              showConfirm
                                ? "text"
                                : "password"
                            }
                            className="h-14 px-6 pr-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600"
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirm(
                                !showConfirm
                              )
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                          >
                            {showConfirm ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage className="text-xs ml-2" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading
                  ? "Creating Account..."
                  : "Join MediStore"}
              </Button>
              {/* Divider */}
<div className="flex items-center gap-3 my-6">
  <div className="h-px bg-slate-200 flex-1" />
  <span className="text-xs text-slate-400">OR</span>
  <div className="h-px bg-slate-200 flex-1" />
</div>

<GoogleLoginButton label="Sign up with Google" />


            </form>
          </Form>

          {/* Footer */}
          <p className="text-center mt-8 text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}