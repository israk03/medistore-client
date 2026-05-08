"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Star, Heart, ShoppingCart, ArrowRight, Package, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import { Medicine } from "@/types";
import { useCart } from "@/context/CartContext";

// Static featured medicines for homepage display
const FEATURED: Medicine[] = [
  {
    id: "seed-paracetamol-500mg",
    name: "Paracetamol 500mg",
    description: "Effective relief for mild to moderate pain and fever.",
    price: 25,
    stock: 200,
    imageUrl: null,
    manufacturer: "Square Pharma",
    sellerId: "",
    categoryId: "",
    category: { id: "", name: "Pain Relief" },
    seller: { id: "", name: "Square Pharma" },
    avgRating: 4.8,
    _count: { reviews: 124 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-vitamin-c-1000mg",
    name: "Vitamin C 1000mg",
    description: "High-strength immunity booster with antioxidant support.",
    price: 180,
    stock: 300,
    imageUrl: null,
    manufacturer: "Renata Limited",
    sellerId: "",
    categoryId: "",
    category: { id: "", name: "Vitamins" },
    seller: { id: "", name: "Renata Limited" },
    avgRating: 4.9,
    _count: { reviews: 89 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-cetirizine-10mg",
    name: "Cetirizine 10mg",
    description: "Fast-acting antihistamine for allergy relief.",
    price: 35,
    stock: 180,
    imageUrl: null,
    manufacturer: "Square Pharma",
    sellerId: "",
    categoryId: "",
    category: { id: "", name: "Allergy & Cold" },
    seller: { id: "", name: "Square Pharma" },
    avgRating: 4.6,
    _count: { reviews: 67 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-omeprazole-20mg",
    name: "Omeprazole 20mg",
    description: "Proton pump inhibitor for acid reflux and heartburn.",
    price: 90,
    stock: 120,
    imageUrl: null,
    manufacturer: "Incepta Pharma",
    sellerId: "",
    categoryId: "",
    category: { id: "", name: "Digestive Health" },
    seller: { id: "", name: "Incepta Pharma" },
    avgRating: 4.7,
    _count: { reviews: 53 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MEDICINE_EMOJIS: Record<string, string> = {
  "Pain Relief": "💊",
  "Vitamins": "🌿",
  "Allergy & Cold": "🤧",
  "Digestive Health": "🫧",
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

function MedicineCard({ medicine }: { medicine: Medicine }) {
  const [wished, setWished] = useState(false);
  const { addToCart } = useCart(); // Assuming addToCart is available in your context

  const handleAddToCart = () => {
    addToCart(medicine); 
    toast.success(`${medicine.name} added to cart`, {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    });
  };

  const emoji = MEDICINE_EMOJIS[medicine.category.name] ?? "💊";

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500 overflow-hidden group"
    >
      {/* Visual Header */}
      <div className="relative h-48 bg-linear-to-br from-slate-50 to-indigo-50/50 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl select-none drop-shadow-xl"
        >
          {emoji}
        </motion.div>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={() => setWished(!wished)}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
          >
            <Heart className={cn("w-5 h-5 transition-colors", wished ? "fill-red-500 text-red-500" : "text-slate-400")} />
          </button>
        </div>

        <Badge className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-indigo-600 border-none shadow-sm font-bold text-[10px] uppercase tracking-wider px-3">
          {medicine.category.name}
        </Badge>
      </div>

      {/* Info Body */}
      <div className="p-6 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
            {medicine.manufacturer}
          </p>
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {medicine.name}
          </h3>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700">{medicine.avgRating?.toFixed(1)}</span>
            <span className="text-[10px] text-amber-600/70 font-medium">({medicine._count?.reviews})</span>
          </div>
          
          {medicine.stock < 20 ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
              <Package className="w-3 h-3" /> Low Stock
            </span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
              In Stock
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Price</span>
            <span className="text-xl font-black text-slate-900">
              {formatPrice(medicine.price)}
            </span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
            className="bg-linear-to-r from-indigo-600 to-violet-500 hover:opacity-90 rounded-2xl h-12 px-5 shadow-lg shadow-indigo-100 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span className="font-bold text-xs uppercase tracking-wide">Add</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedMedicines() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Verified Pharmacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Featured Medicines
            </h2>
            <p className="text-slate-500 font-medium max-w-md">
              Hand-picked authentic products from our most trusted sellers.
            </p>
          </div>

          <Link
            href="/shop"
            className="rounded-2xl border-slate-200 bg-white border hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all font-bold group inline-flex items-center px-4 py-2"
          >
            Explore All Shop
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* GRID */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {FEATURED.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}