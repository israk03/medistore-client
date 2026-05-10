"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import { Medicine } from "@/types/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const [wished, setWished] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const MEDICINE_EMOJIS: Record<string, string> = {
    "First Aid": "🩹",
    "Pain Relief": "💊",
    "Vitamins": "🌿",
    "Allergy & Cold": "🤧",
    "Digestive Health": "🫧",
  };

  const emoji = useMemo(
    () => MEDICINE_EMOJIS[medicine.category?.name ?? ""] ?? "💊",
    [medicine.category?.name]
  );

  return (
    <motion.div
      onClick={() => router.push(`/shop/${medicine.id}`)}   // ✅ IMPORTANT FIX
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="cursor-pointer bg-white rounded-[2rem] border border-slate-100 overflow-hidden group"
    >
      {/* Header */}
      <div className="relative h-48 bg-slate-50 flex items-center justify-center">

        <button
          onClick={(e) => {
            e.stopPropagation();
            setWished(!wished);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              wished ? "fill-rose-500 text-rose-500" : "text-slate-400"
            )}
          />
        </button>

        <Badge className="absolute top-4 left-4 bg-white">
          {medicine.category?.name}
        </Badge>

        <span className="text-7xl">{emoji}</span>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="font-bold text-lg">{medicine.name}</h3>
        <p className="text-sm text-slate-500">{medicine.manufacturer}</p>

        <div className="mt-3 font-bold">
          {formatPrice(medicine.price)}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(medicine);
            toast.success("Added to cart");
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}