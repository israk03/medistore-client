"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  User,
  Calendar,
  Send,
  Plus,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import { medicineService } from "@/services/medicine.service";
import { reviewService } from "@/services/review.service";

import { formatPrice, formatDate, cn } from "@/lib/utils";
import { Medicine, Review } from "@/types/auth.types";

import { toast } from "sonner";

function StarSelector({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  return (
    <div className="flex gap-2 p-3 bg-slate-50 rounded-2xl w-fit">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.button
          key={i}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(i + 1)}
        >
          <Star
            className={cn(
              "w-6 h-6",
              rating > i
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}

export default function MedicineDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  const router = useRouter();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const [medRes, revRes] = await Promise.all([
        medicineService.getById(id),
        reviewService.getMedicineReviews(id),
      ]);

      if (medRes.success && medRes.data) {
        setMedicine(medRes.data ?? null);
      }

      if (revRes.success && revRes.data) {
        setReviews(revRes.data.reviews ?? []);
        setAvgRating(revRes.data.avgRating ?? 0);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToCart = () => {
    if (!medicine) return;

    addToCart(medicine, quantity);

    toast.success(`${medicine.name} added to cart`);
  };

  const handleSubmitReview = async () => {
    if (!id) return;

    if (!isAuthenticated) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (rating === 0) {
      toast.error("Please select rating");
      return;
    }

    setSubmitting(true);

    try {
      await reviewService.addReview(id, {
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("Review submitted");

      setRating(0);
      setComment("");

      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <Skeleton className="h-[450px] rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-1/3" />
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="pt-32 text-center">
        Medicine not found
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div className="bg-white rounded-3xl border p-10 flex items-center justify-center relative">
            <div className="text-8xl">💊</div>

            <Badge className="absolute top-4 left-4">
              {medicine.category?.name}
            </Badge>
          </div>

          {/* INFO */}
          <div className="space-y-5">

            <h1 className="text-3xl font-bold">
              {medicine.name}
            </h1>

            <p className="text-slate-500">
              {medicine.manufacturer}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">
                ({reviews.length} reviews)
              </span>
            </div>

            {/* PRICE */}
            <div className="text-4xl font-bold text-indigo-600">
              {formatPrice(medicine.price)}
            </div>

            {/* PRODUCT INFO */}
            <div className="grid grid-cols-2 gap-3">

              <div className="p-3 bg-white border rounded-xl">
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-semibold text-sm">
                  {medicine.category?.name}
                </p>
              </div>

              <div className="p-3 bg-white border rounded-xl">
                <p className="text-xs text-slate-400">Stock</p>
                <p className="font-semibold text-sm">
                  {medicine.stock > 0
                    ? `${medicine.stock} available`
                    : "Out of stock"}
                </p>
              </div>

              <div className="p-3 bg-white border rounded-xl">
                <p className="text-xs text-slate-400">Seller</p>
                <p className="font-semibold text-sm">
                  {medicine.seller?.name || "N/A"}
                </p>
              </div>

              <div className="p-3 bg-white border rounded-xl">
                <p className="text-xs text-slate-400">Manufacturer</p>
                <p className="font-semibold text-sm">
                  {medicine.manufacturer}
                </p>
              </div>

            </div>

            {/* DESCRIPTION */}
            {medicine.description && (
              <p className="text-sm text-slate-600">
                {medicine.description}
              </p>
            )}

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="w-4 h-4" />
              </Button>

              <span>{quantity}</span>

              <Button onClick={() => setQuantity(q => q + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* ADD TO CART */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>

            <Separator />

            {/* REVIEWS */}
            <div className="space-y-4">

              <h2 className="font-bold text-lg">
                Reviews
              </h2>

              {isAuthenticated && user?.role === "CUSTOMER" && (
                <div className="space-y-3">

                  <StarSelector
                    rating={rating}
                    onChange={setRating}
                  />

                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write review..."
                  />

                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="bg-indigo-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>

                </div>
              )}

              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-white border rounded-xl"
                >
                  <p className="font-bold">
                    {r.customer.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {r.comment}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}