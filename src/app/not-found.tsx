import Link from "next/link";
import { ShoppingBag, LayoutDashboard, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Visual Indicator */}
      <div className="relative mb-10">
        <div className="h-32 w-32 bg-indigo-50 rounded-[3rem] flex items-center justify-center rotate-12">
          <Search className="h-14 w-14 text-indigo-600 -rotate-12" />
        </div>
        <div className="absolute -top-2 -right-2 h-10 w-10 bg-white border-4 border-white shadow-lg rounded-2xl flex items-center justify-center animate-bounce">
          <AlertCircle className="h-5 w-5 text-rose-500" />
        </div>
      </div>

      {/* Hero Text */}
      <h1 className="text-[10rem] font-black leading-none tracking-tighter text-slate-100 absolute -z-10 select-none">
        404
      </h1>
      
      <div className="space-y-4 mb-10 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Lost in the Pharmacy?
        </h2>
        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved. 
          Check the URL or return to the main dashboard.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
  <Link href="/shop">
    <Button 
      className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-95"
    >
      {/* ShoppingBag fits the "Shop" intent perfectly */}
      <ShoppingBag className="h-4 w-4" />
      Back to shop
    </Button>
  </Link>
  
  <Link href="/dashboard">
    <Button 
      variant="outline"
      className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2 transition-all active:scale-95"
    >
      {/* LayoutDashboard or LayoutGrid is standard for internal tools */}
      <LayoutDashboard className="h-4 w-4" />
      Dashboard
    </Button>
  </Link>
</div>

    </div>
  );
}