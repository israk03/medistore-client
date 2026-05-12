"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Securing Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}