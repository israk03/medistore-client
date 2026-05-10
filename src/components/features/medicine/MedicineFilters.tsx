"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface FiltersState {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

interface MedicineFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

const DEFAULT_FILTERS: FiltersState = {
  search: "",
  categoryId: "ALL",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

export function MedicineFilters({ filters, onChange }: MedicineFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.success && res.data) setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const hasActiveFilters =
    filters.categoryId !== "ALL" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  return (
    <div className="w-full space-y-4">
      {/* Search + Toggle Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            placeholder="Search for medicines, health products..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-all"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-14 px-6 rounded-2xl border-slate-200 gap-2 font-bold transition-all active:scale-95",
            showFilters || hasActiveFilters 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
              : "bg-white hover:bg-slate-50"
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          )}
        </Button>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-100/20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Dropdown */}
              <FilterGroup label="Therapeutic Category">
                <Select
                  value={filters.categoryId}
                  onValueChange={(v) => onChange({ ...filters, categoryId: v ?? "ALL" })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:ring-indigo-600">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterGroup>

              {/* Min Price */}
              <FilterGroup label="Min Price (৳)">
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:ring-indigo-600"
                />
              </FilterGroup>

              {/* Max Price */}
              <FilterGroup label="Max Price (৳)">
                <Input
                  type="number"
                  placeholder="No Limit"
                  value={filters.maxPrice}
                  onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:ring-indigo-600"
                />
              </FilterGroup>

              {/* Sort Logic */}
              <FilterGroup label="Sort By">
                <Select
                  value={filters.sort}
                  onValueChange={(v) => onChange({ ...filters, sort: v ?? "newest" })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="newest">Latest Arrivals</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </FilterGroup>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-6 pt-4 border-t border-slate-50 flex justify-end"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(DEFAULT_FILTERS)}
                  className="text-slate-400 hover:text-rose-500 font-bold gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Sub-component for clean labels
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}