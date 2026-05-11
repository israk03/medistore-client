"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  AlertCircle,
  Filter,
  MoreVertical,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { MedicineFormModal } from "@/components/features/medicine/MedicineFormModal";
import { sellerService } from "@/services/seller.service";
import { formatPrice } from "@/lib/utils";
import { Medicine } from "@/types/auth.types";
import { toast } from "sonner";
import Image from "next/image";

export default function SellerMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await sellerService.getMyMedicines();
      if (res.success && res.data) setMedicines(res.data);
    } catch {
      toast.error("Catalogue sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const query = search.toLowerCase();
      return (
        m.name?.toLowerCase().includes(query) ||
        m.manufacturer?.toLowerCase().includes(query)
      );
    });
  }, [medicines, search]);

  const handleEdit = (medicine: Medicine) => {
    setEditMedicine(medicine);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await sellerService.deleteMedicine(deleteTarget.id);
      toast.success("Medicine removed from ledger");
      setDeleteTarget(null);
      fetchMedicines();
    } catch (err: any) {
      toast.error("Operation failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      {/* 1. COMPACT HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Catalogue Manager</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="rounded-md border-slate-200 text-slate-500 font-bold">
              {medicines.length} Total SKUs
            </Badge>
            <Badge variant="outline" className="rounded-md border-rose-100 text-rose-500 font-bold bg-rose-50">
              {medicines.filter(m => m.stock < 10).length} Low Stock
            </Badge>
          </div>
        </div>

        <Button
          onClick={() => { setEditMedicine(null); setModalOpen(true); }}
          className="h-11 rounded-xl bg-indigo-600 font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Medicine
        </Button>
      </div>

      {/* 2. SEARCH & TOOLBAR */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Filter by name or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-indigo-500"
          />
        </div>
        <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 p-0 text-slate-400">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* 3. INVENTORY LIST */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2 px-2">
            <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Financials</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={4} className="p-2"><Skeleton className="h-20 w-full rounded-2xl" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-200 mb-4">
                      <Package className="h-8 w-8" />
                    </div>
                    <p className="font-bold text-slate-400">No matching medicines found</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((medicine) => (
                    <motion.tr
                      layout
                      key={medicine.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="rounded-l-2xl px-4 py-4 border-y border-l border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-50">
                            {medicine.imageUrl ? (
                              <Image src={medicine.imageUrl} alt={medicine.name} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <Layers className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{medicine.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{medicine.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-y border-slate-50 px-4 py-4">
                        <p className="text-sm font-black text-indigo-600">{formatPrice(medicine.price)}</p>
                        <p className="text-[10px] font-medium text-slate-400">Price per unit</p>
                      </td>
                      <td className="border-y border-slate-50 px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-xs font-black",
                            medicine.stock === 0 ? "text-rose-500" : medicine.stock < 10 ? "text-amber-500" : "text-emerald-500"
                          )}>
                            {medicine.stock === 0 ? "OUT OF STOCK" : `${medicine.stock} UNITS`}
                          </span>
                          <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                medicine.stock === 0 ? "bg-rose-500 w-0" : medicine.stock < 10 ? "bg-amber-500 w-1/3" : "bg-emerald-500 w-full"
                              )} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="rounded-r-2xl border-y border-r border-slate-50 px-4 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(medicine)}
                            className="h-9 w-9 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeleteTarget(medicine)}
                            className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODALS & DIALOGS */}
      <MedicineFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditMedicine(null); }}
        onSuccess={fetchMedicines}
        editMedicine={editMedicine}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader className="items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-black">Archive Medicine?</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              You are about to remove <span className="font-bold text-slate-900">{deleteTarget?.name}</span> from your live inventory. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:justify-center">
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setDeleteTarget(null)}>
              Keep Listing
            </Button>
            <Button 
              className="rounded-xl bg-rose-500 font-black hover:bg-rose-600" 
              onClick={handleDelete} 
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper for dynamic class joining
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}