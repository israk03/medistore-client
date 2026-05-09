"use client";
import { GoogleLoginButton } from "@/components/common/GoogleLoginButton";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Pill,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROLES = {
  ADMIN: "ADMIN",
  SELLER: "SELLER",
  CUSTOMER: "CUSTOMER",
} as const;

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const res = await authService.login(values);

      if (!res?.success) {
        toast.error(res?.message || "Login failed");
        return;
      }

      if (!res?.data) {
        toast.error("Invalid server response");
        return;
      }

      const { user, token } = res.data;

      login(user, token);

      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);

      const role = user.role;

      const redirectPath =
        role === ROLES.ADMIN
          ? "/admin/dashboard"
          : role === ROLES.SELLER
          ? "/seller/dashboard"
          : "/customer/dashboard";

      router.push(redirectPath);
    } catch (err: any) {
  toast.error(err?.message || "Login failed. Please try again.");
} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -ml-64 -mb-64" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div
          className={cn(
            "bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-8 md:p-10 border border-slate-100",
            isLoading && "pointer-events-none opacity-80"
          )}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Pill className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black">MediStore</span>
            </Link>

            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-slate-500">
              Sign in to continue
            </p>
          </div>

          {/* Demo creds */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-dashed text-xs">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
              Demo Accounts
            </div>
            <p>admin@medistore.com / admin123</p>
            <p>seller@medistore.com / seller123</p>
            <p>user@medistore.com / user123</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          placeholder="Email"
                          className="h-14 pl-12 rounded-2xl bg-slate-50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50"
                          {...field}
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-semibold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {/* Divider */}
<div className="flex items-center gap-3 my-6">
  <div className="h-px bg-slate-200 flex-1" />
  <span className="text-xs text-slate-400">OR</span>
  <div className="h-px bg-slate-200 flex-1" />
</div>

{/* Google Login */}
<GoogleLoginButton label="Continue with Google" />
            </form>
          </Form>

          <p className="text-center mt-6 text-sm text-slate-500">
            New here?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}