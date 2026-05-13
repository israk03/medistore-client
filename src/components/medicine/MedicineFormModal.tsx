"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Package, DollarSign, Database, 
  Image as ImageIcon, Loader2,
  LayoutGrid, Tag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sellerService } from "@/services/seller.service";
import { categoryService } from "@/services/category.service";
import { Medicine, Category } from "@/types/auth.types";
import { toast } from "sonner";

interface MedicineFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMedicine: Medicine | null;
}

export default function MedicineFormModal({
  open,
  onClose,
  onSuccess,
  editMedicine,
}: MedicineFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      manufacturer: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      imageUrl: "",
    },
  });

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        const res = await categoryService.getAll();
        if (res.success) setCategories(res.data || []);
      };
      fetchCategories();

      if (editMedicine) {
        reset({
          name: editMedicine.name,
          manufacturer: editMedicine.manufacturer,
          description: editMedicine.description,
          price: editMedicine.price,
          stock: editMedicine.stock,
          categoryId: editMedicine.categoryId,
          imageUrl: editMedicine.imageUrl || "",
        });
      } else {
        reset({ name: "", manufacturer: "", description: "", price: 0, stock: 0, categoryId: "", imageUrl: "" });
      }
    }
  }, [open, editMedicine, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = { ...data, price: Number(data.price), stock: Number(data.stock) };
      const res = editMedicine 
        ? await sellerService.updateMedicine(editMedicine.id, payload)
        : await sellerService.addMedicine(payload);

      if (res.success) {
        toast.success(editMedicine ? "Product updated" : "Medicine added");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Process failed. Please verify your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          
          {/* Header */}
          <div className="px-10 pt-10 pb-6">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-violet-100 rounded-2xl">
                  <Package className="h-6 w-6 text-violet-600" />
                </div>
                <DialogTitle className="text-2xl font-black text-slate-900">
                  {editMedicine ? "Edit Medicine" : "Add Medicine"}
                </DialogTitle>
              </div>
              <p className="text-slate-500 font-medium">Keep your pharmacy inventory up to date.</p>
            </DialogHeader>
          </div>

          <div className="px-10 pb-10 space-y-5">
            {/* Row 1: Name & Manufacturer */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 ml-1">Medicine Name</Label>
                <Input {...register("name")} placeholder="e.g. Napa Extend" className="rounded-xl border-slate-200 h-12 focus:ring-violet-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 ml-1">Manufacturer</Label>
                <Input {...register("manufacturer")} placeholder="e.g. Square" className="rounded-xl border-slate-200 h-12 focus:ring-violet-500" />
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 ml-1">Description</Label>
              <Textarea
  {...register("description")}
  placeholder="Dosage and indications..."
  className="rounded-xl border-slate-200 min-h-25 resize-none focus:ring-violet-500"
/>
            </div>

            {/* Row 3: Price & Category (Fills the 'empty' space) */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 ml-1">Price (৳)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                  <Input type="number" {...register("price")} className="pl-9 rounded-xl border-slate-200 h-12 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 ml-1">Category</Label>
                <Select onValueChange={(val) => setValue("categoryId", val as string)} value={selectedCategoryId}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white font-medium">
                    <span className="font-medium">
        {categories.find((cat) => cat.id === watch("categoryId"))?.name || "Select a category"}
      </span>
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-2xl rounded-xl z-100 min-w-50">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="py-3 font-medium focus:bg-violet-50 focus:text-violet-700 cursor-pointer">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Stock & Image URL */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 ml-1">Current Stock</Label>
                <div className="relative">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="number" {...register("stock")} className="pl-11 rounded-xl border-slate-200 h-12 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 ml-1">Medicine Image Link</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input {...register("imageUrl")} placeholder="https://..." className="pl-11 rounded-xl border-slate-200 h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem]">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-lg shadow-xl shadow-violet-100 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                editMedicine ? "Save Changes" : "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}