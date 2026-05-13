"use client";

import {  motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  ArrowRight,
  Tag,
  Truck,
  Shield,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/features/cart/CartItem";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn, formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 60;

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const isCartEmpty = items.length === 0;
  const isFreeShipping = totalPrice >= SHIPPING_THRESHOLD;
  const shippingCost = isCartEmpty ? 0 : isFreeShipping ? 0 : SHIPPING_COST;
  const grandTotal = totalPrice + shippingCost;
  const remainingForFreeShipping = Math.max(SHIPPING_THRESHOLD - totalPrice, 0);
  const shippingProgress = Math.min((totalPrice / SHIPPING_THRESHOLD) * 100, 100);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50/50">
      {/* 1. Header Section */}
      <div className=" border-b border-slate-100/80 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Prescription Cart</h1>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <span>{totalItems} items</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>Verified Pharmacy</span>
                </div>
              </div>
            </motion.div>
            
            {!isCartEmpty && (
              <button 
                onClick={clearCart}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-[0.2em]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {isCartEmpty ? (
          /* Empty State - Minimalist */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-5xl mb-8">
              🩺
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-500 max-w-sm mb-10 font-medium">
              You haven&apos;t added any medical supplies yet. Start browsing our verified catalog.
            </p>
            <Button asChild className="bg-indigo-600 h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100">
              <Link href="/shop">Explore Medicines</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* 2. Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shipping Progress Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-4xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isFreeShipping ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">
                        {isFreeShipping ? "Free Delivery Unlocked!" : "Shipping Progress"}
                      </h3>
                      <p className="text-xs font-bold text-slate-400">
                        {isFreeShipping 
                          ? "Your order qualifies for complimentary delivery" 
                          : `Spend ${formatPrice(remainingForFreeShipping)} more for free shipping`}
                      </p>
                    </div>
                  </div>
                  {!isFreeShipping && (
                    <span className="text-sm font-black text-amber-600">{Math.round(shippingProgress)}%</span>
                  )}
                </div>
                
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      isFreeShipping ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "bg-amber-400"
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.medicine.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-8 space-y-6"
              >
                <h2 className="text-xl font-black text-slate-900">Order Summary</h2>

                <div className="space-y-4 font-bold">
                  <div className="flex justify-between text-slate-400 text-sm tracking-tight">
                    <span>Subtotal</span>
                    <span className="text-slate-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm tracking-tight">
                    <span>Shipping Fee</span>
                    <span className={cn(isFreeShipping ? "text-emerald-500" : "text-slate-900")}>
                      {isFreeShipping ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  <Separator className="bg-slate-100" />
                  
                  <div className="flex justify-between items-end py-2">
                    <span className="text-slate-900 font-black">Total Amount</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust & Policy */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-emerald-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Cash on Delivery Available
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-200/50 pt-3">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Verified Safe Checkout
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-black text-lg shadow-xl shadow-indigo-100 group"
                >
                  Confirm Order
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Link 
                  href="/shop" 
                  className="flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}