"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Pill, LayoutGrid, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicineCard } from "@/components/features/medicine/MedicineCard";
import { MedicineFilters } from "@/components/features/medicine/MedicineFilters";
import { medicineService } from "@/services/medicine.service";
import { Medicine } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface FiltersState {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

const DEFAULT_FILTERS: FiltersState = {
  search: "",
  categoryId: "ALL",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

const LIMIT = 12;

// Match the card's rounded-auth aesthetic
function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-4xl border border-slate-100 overflow-hidden p-5 space-y-4">
      <Skeleton className="h-40 w-full rounded-2xl bg-slate-50" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 bg-slate-50" />
        <Skeleton className="h-3 w-1/2 bg-slate-50" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-1/4 bg-slate-50" />
        <Skeleton className="h-10 w-1/3 rounded-xl bg-slate-50" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const buildParams = useCallback(() => {
    const params: Record<string, any> = { page, limit: LIMIT };
    if (filters.search) params.search = filters.search;
    if (filters.categoryId !== "ALL") params.categoryId = filters.categoryId;
    if (filters.minPrice) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
    return params;
  }, [filters, page]);

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await medicineService.getAll(buildParams());

      if (res.success && res.data) {
        let list = [...res.data.medicines];
        if (filters.sort === "price_asc") list.sort((a, b) => a.price - b.price);
        else if (filters.sort === "price_desc") list.sort((a, b) => b.price - a.price);

        setMedicines(list);
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total);
      }
    } catch {
      setError("Unable to connect to the pharmacy database.");
    } finally {
      setLoading(false);
    }
  }, [buildParams, filters.sort]);

  useEffect(() => {
    const delay = filters.search ? 400 : 0;
    const timer = setTimeout(() => fetchMedicines(), delay);
    return () => clearTimeout(timer);
  }, [fetchMedicines, filters.search]);

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Premium Header */}
      <div className="relative bg-white border-b border-slate-100 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                <ShoppingBag className="w-4 h-4" />
                <span>Pharmacy Store</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                All Medicines
              </h1>
              <p className="text-slate-500 font-medium">
                {loading ? "Scanning inventory..." : `Found ${total} verified products`}
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
               <div className="bg-slate-100 p-1 rounded-xl flex">
                  <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-lg h-8 w-8 p-0">
                    <LayoutGrid className="w-4 h-4 text-indigo-600" />
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Filters Panel */}
        <MedicineFilters filters={filters} onChange={handleFilterChange} />

        {/* Error State */}
        <div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">{error}</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={fetchMedicines} 
                className="hover:bg-rose-100 text-rose-700 font-bold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </motion.div>
          )}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <MedicineCardSkeleton key={i} />
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200"
          >
            <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
               <Pill className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No results found</h3>
            <p className="text-slate-500 mt-2 mb-6">Try adjusting your filters or search term.</p>
            <Button 
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="bg-indigo-600 rounded-xl px-8"
            >
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {medicines.map((m, i) => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </div>
        )}

        {/* Pagination: Refined Design */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-12">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl h-12 px-6 border-slate-200"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
               <span className="text-sm font-bold text-slate-900 bg-white border border-slate-100 w-10 h-10 flex items-center justify-center rounded-xl shadow-sm">
                {page}
               </span>
               <span className="text-sm font-medium text-slate-400">of {totalPages}</span>
            </div>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl h-12 px-6 border-slate-200"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}