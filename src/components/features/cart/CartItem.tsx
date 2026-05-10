"use client";

import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import { CartItem as CartItemType } from "@/types/auth.types";

const MEDICINE_EMOJIS: Record<string, string> = {
  "Pain Relief": "💊",
  "Vitamins": "🌿",
  "Vitamins & Supplements": "🌿",
  "Allergy & Cold": "🤧",
  "Digestive Health": "🫧",
  "Antibiotics": "🔬",
  "Skin Care": "✨",
  "Eye Care": "👁️",
  "First Aid": "🩹",
};

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export function CartItem({ item, className }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { medicine, quantity } = item;

  const emoji = MEDICINE_EMOJIS[medicine.category?.name] ?? "💊";
  const subtotal = medicine.price * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "group relative flex items-center gap-4 bg-white rounded-[1.5rem] p-4 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300",
        className
      )}
    >
      {/* 1. Visual Icon with Category Accent */}
      <div className="relative w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent" />
        <span className="relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>
      </div>

      {/* 2. Product Identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base truncate tracking-tight">
              {medicine.name}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {medicine.manufacturer}
            </p>
          </div>
        </div>

        {/* 3. Action Row: Quantity & Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-100">
            <button
              onClick={() => updateQuantity(medicine.id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all disabled:opacity-30"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            <span className="w-8 text-center text-sm font-bold text-slate-700">
              {quantity}
            </span>

            <button
              onClick={() => updateQuantity(medicine.id, Math.min(medicine.stock, quantity + 1))}
              disabled={quantity >= medicine.stock}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
            <p className="font-black text-indigo-600 text-base">
              {formatPrice(subtotal)}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Floating Remove Button (Industrial Style) */}
      <button
        onClick={() => removeFromCart(medicine.id)}
        className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-100 hover:shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}