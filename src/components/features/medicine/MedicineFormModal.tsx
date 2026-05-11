"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Save, ImageIcon, AlertCircle, Beaker, Factory, Tag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { categoryService } from "@/services/category.service";
import { sellerService } from "@/services/seller.service";
import { Category, Medicine } from "@/types/auth.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const medicineSchema = z.object({
  name: z.string().min(2, "Name is required for the ledger"),
  description: z.string().min(10, "Provide clinical or usage details"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  manufacturer: z.string().min(2, "Manufacturer identity required"),
  categoryId: z.string().min(1, "Select a valid category"),
  imageUrl: z.string().url("Must be a valid secure image URL").optional().or(z.literal("")),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMedicine?: Medicine | null;
}

export function MedicineFormModal({
  open,
  onClose,
  onSuccess,
  editMedicine,
}: MedicineFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const isEditing = !!editMedicine;

  const form = useForm<z.infer<typeof medicineSchema>>({
  resolver: zodResolver(medicineSchema)as any,
  defaultValues: {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    manufacturer: "",
    categoryId: "",
    imageUrl: "",
  },
});

  const watchImageUrl = form.watch("imageUrl");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await categoryService.getAll();
        if (mounted && res.success) setCategories(res.data || []);
      } catch (err) {
        toast.error("Catalogue sync failed");
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (editMedicine) {
      form.reset({
        name: editMedicine.name,
        description: editMedicine.description,
        price: editMedicine.price,
        stock: editMedicine.stock,
        manufacturer: editMedicine.manufacturer,
        categoryId: editMedicine.categoryId,
        imageUrl: editMedicine.imageUrl ?? "",
      });
    } else {
      form.reset({ name: "", description: "", price: 0, stock: 0, manufacturer: "", categoryId: "", imageUrl: "" });
    }
  }, [editMedicine, form]);

  const onSubmit: SubmitHandler<z.infer<typeof medicineSchema>> = async (values) => {
    setSaving(true);
    try {
      const payload = { ...values, imageUrl: values.imageUrl || undefined };
      if (isEditing && editMedicine) {
        await sellerService.updateMedicine(editMedicine.id, payload);
        toast.success("Inventory Updated");
      } else {
        await sellerService.addMedicine(payload);
        toast.success("New Stock Registered");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] p-0 border-none shadow-2xl">
        {/* Visual Identity Header */}
        <div className="flex items-center justify-between bg-slate-900 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              {isEditing ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight">
                {isEditing ? "Modify Stock" : "Register Product"}
              </DialogTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory Ledger System</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-8 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* 1. BASIC IDENTITY */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Beaker className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">General Information</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-500">Medicine Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Nexum 20mg" {...field} className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white h-11 font-medium" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="manufacturer" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-500">Manufacturer / Lab</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Factory className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input {...field} className="pl-10 rounded-xl border-slate-100 bg-slate-50 h-11 font-medium" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-500">Clinical Description</FormLabel>
                    <FormControl><Textarea rows={3} className="rounded-xl border-slate-100 bg-slate-50 resize-none" {...field} /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>

              <Separator className="bg-slate-50" />

              {/* 2. CATEGORY & IMAGE */}
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <Tag className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Classification</span>
                    </div>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {loadingCategories ? <SelectItem value="loading" disabled>Syncing...</SelectItem> : 
                          categories.map((cat) => <SelectItem key={cat.id} value={cat.id} className="rounded-lg">{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Product Media</span>
                    </div>
                    <FormControl><Input placeholder="https://..." {...field} className="h-11 rounded-xl border-slate-100 bg-slate-50" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>

              {/* 3. INVENTORY & PRICING */}
              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price (৳)</FormLabel>
                      <FormControl><Input type="number" {...field} className="h-12 border-white/10 bg-white/5 text-lg font-black text-emerald-400 focus:ring-emerald-500 rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Quantity</FormLabel>
                      <FormControl><Input type="number" {...field} className="h-12 border-white/10 bg-white/5 text-lg font-black text-indigo-400 focus:ring-indigo-500 rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onClose} className="h-12 flex-1 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">
                  Dismiss
                </Button>
                <Button type="submit" disabled={saving} className="h-12 flex-1 rounded-2xl bg-indigo-600 font-black shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95">
                  {saving ? "Syncing..." : isEditing ? "Update Entry" : "Commit to Inventory"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}