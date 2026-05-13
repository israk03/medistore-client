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
  Layers,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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


import { sellerService } from "@/services/seller.service";
import { formatPrice, cn } from "@/lib/utils";
import { Medicine } from "@/types/auth.types";
import MedicineFormModal from "@/components/medicine/MedicineFormModal";

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
      toast.error("Catalogue synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return medicines.filter((m) => 
      m.name?.toLowerCase().includes(query) ||
      m.manufacturer?.toLowerCase().includes(query)
    );
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
    } catch {
      toast.error("Operation failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10 px-4">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Catalogue Manager</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="rounded-lg border-slate-200 text-slate-500 font-bold px-3 py-1">
              {medicines.length} Total SKUs
            </Badge>
            <Badge className="rounded-lg border-none text-rose-600 font-bold bg-rose-50 px-3 py-1">
              {medicines.filter(m => m.stock < 10).length} Low Stock Alert
            </Badge>
          </div>
        </div>

        <Button
          onClick={() => { setEditMedicine(null); setModalOpen(true); }}
          className="h-12 rounded-2xl bg-indigo-600 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all gap-2 px-6"
        >
          <Plus className="w-5 h-5" />
          Add New Medicine
        </Button>
      </div>

      {/* 2. SEARCH TOOLBAR */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by product name or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 rounded-[1.25rem] border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-600"
          />
        </div>
        <Button variant="outline" className="h-14 w-14 rounded-[1.25rem] border-slate-100 bg-white p-0 text-slate-400 hover:text-indigo-600">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white/50 p-2 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto px-2">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4 text-center">Unit Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="p-2"><Skeleton className="h-24 w-full rounded-3xl" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-4xl bg-slate-50 text-slate-200 mb-6">
                      <Package className="h-10 w-10" />
                    </div>
                    <p className="font-black text-slate-300 uppercase tracking-widest text-xs">No records found in catalogue</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((medicine: Medicine) => (
                    <motion.tr
                      layout
                      key={medicine.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white hover:shadow-md hover:shadow-indigo-500/5 transition-all cursor-default"
                    >
                      <td className="rounded-l-4xl px-6 py-5 border-y border-l border-slate-50">
                        <div className="flex items-center gap-5">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                            {medicine.imageUrl ? (
                              <Image src={medicine.imageUrl} alt={medicine.name} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-200">
                                <Layers className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900 leading-tight">{medicine.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mt-1">{medicine.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-y border-slate-50 px-6 py-5 text-center">
                        <p className="text-base font-black text-slate-900">{formatPrice(medicine.price)}</p>
                        <p className="text-[9px] font-black uppercase text-slate-400 mt-0.5">NET VALUE</p>
                      </td>
                      <td className="border-y border-slate-50 px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md w-fit",
                            medicine.stock === 0 ? "bg-rose-50 text-rose-600" : medicine.stock < 10 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            {medicine.stock === 0 ? "Depleted" : `${medicine.stock} Units Available`}
                          </span>
                          <div className="h-1.5 w-28 rounded-full bg-slate-50 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: medicine.stock === 0 ? "0%" : medicine.stock < 10 ? "30%" : "100%" }}
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                medicine.stock === 0 ? "bg-rose-500" : medicine.stock < 10 ? "bg-amber-500" : "bg-emerald-500"
                              )} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="rounded-r-4xl border-y border-r border-slate-50 px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(medicine)}
                            className="h-10 w-10 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeleteTarget(medicine)}
                            className="h-10 w-10 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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

      {/* 4. MODALS */}
      <MedicineFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditMedicine(null); }}
        onSuccess={fetchMedicines}
        editMedicine={editMedicine}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-[2.5rem] border-none p-10">
          <DialogHeader className="items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-500 mb-6">
              <AlertCircle className="h-10 w-10" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900">De-register Medicine?</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium pt-2">
              You are removing <span className="font-bold text-slate-900 italic">"{deleteTarget?.name}"</span>. 
              This will hide the listing from all customers instantly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-3 sm:justify-center">
            <Button variant="ghost" className="rounded-xl font-bold px-8" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button 
              className="rounded-xl bg-rose-600 font-black px-8 hover:bg-rose-700 shadow-lg shadow-rose-100" 
              onClick={handleDelete} 
              disabled={deleting}
            >
              {deleting ? "Processing..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}