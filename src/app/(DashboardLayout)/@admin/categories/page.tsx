"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Tag,
  Search,
  Layers,
  Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { categoryService } from "@/services/category.service";
import { Category } from "@/types/auth.types";
import { toast } from "sonner";

interface CategoryWithCount extends Category {
  _count?: {
    medicines: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (res.success && res.data) {
        setCategories(res.data as CategoryWithCount[]);
      }
    } catch {
      toast.error("Taxonomy sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await categoryService.create(newName.trim());
      if (res.success) {
        toast.success(`Category "${newName}" created`);
        setNewName("");
        await fetchCategories();
      }
    } catch {
      toast.error("Creation failed");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success("Category removed");
      setDeleteTarget(null);
      await fetchCategories();
    } catch {
      toast.error("Deletion failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-10 px-4">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Category Registry</h1>
        <div className="flex items-center gap-2 mt-1 text-sm font-bold text-slate-400">
          <Layers className="h-4 w-4 text-indigo-500" />
          {loading ? "Analyzing structure..." : `${categories.length} Active Categories`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CREATE SIDEBAR */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Create Category
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Antibiotics"
                  className="pl-10 h-12 rounded-xl border-slate-100 bg-slate-50 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <Button
                onClick={handleAdd}
                disabled={!newName.trim() || adding}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Create</>}
              </Button>
            </div>
          </div>
        </div>

        {/* LIST AREA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category registry..."
              className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm focus:ring-indigo-500 font-medium"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-3xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] py-20 text-center border border-slate-100">
              <Tag className="mx-auto h-12 w-12 text-slate-100 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((cat) => (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 bg-white border border-slate-100 rounded-3xl group hover:border-indigo-100 hover:shadow-md transition-all flex justify-between items-center"
                  >
                    <div>
                      <p className="font-black text-slate-900 text-sm leading-tight">{cat.name}</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1 tracking-tighter">
                        {cat._count?.medicines ?? 0} Medicines Linked
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-4xl border-none shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Purge Category</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium py-2">
              Are you sure you want to remove <b>{deleteTarget?.name}</b>? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold px-8"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}