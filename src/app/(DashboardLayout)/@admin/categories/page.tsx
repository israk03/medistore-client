"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Tag,
  Search,
  Layers,
  AlertCircle,
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
import { cn } from "@/lib/utils";
import { Category } from "@/types/auth.types";
import { toast } from "sonner";

/**
 * FIX:
 * Do NOT override `_count` shape incorrectly.
 * Just extend safely using exact backend shape.
 */
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
  const [deleteTarget, setDeleteTarget] =
    useState<CategoryWithCount | null>(null);
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
    return categories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
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
    <div className="space-y-8 max-w-4xl pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Category Registry
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm font-bold text-slate-400">
            <Layers className="h-4 w-4 text-indigo-500" />
            {loading
              ? "Analyzing structure..."
              : `${categories.length} Active Categories`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* CREATE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase">
              Create Category
            </h3>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Antibiotics"
                  className="pl-10 h-12"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>

              <Button
                onClick={handleAdd}
                disabled={!newName.trim() || adding}
                className="w-full h-12 bg-indigo-600"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-8 space-y-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="pl-10 h-12"
            />
          </div>

          {/* GRID */}
          <div className="bg-white rounded-2xl border border-slate-100">
            {loading ? (
              <div className="p-6 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Tag className="mx-auto h-10 w-10 text-slate-200" />
                <p className="text-sm font-bold text-slate-400 mt-2">
                  No categories found
                </p>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {filtered.map((cat) => (
                    <motion.div
                      key={cat.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-xl group"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-bold">{cat.name}</p>
                          <p className="text-xs text-slate-400">
                            {cat._count?.medicines ?? 0} medicines
                          </p>
                        </div>

                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="opacity-0 group-hover:opacity-100 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <b>{deleteTarget?.name}</b>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}