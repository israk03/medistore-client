"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import {
  MapPin,
  Package,
  CheckCircle2,
  ArrowLeft,
  Tag,
  Truck,
  ShoppingBag,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import { orderService } from "@/services/order.service";

import { formatPrice } from "@/lib/utils";

import { toast } from "sonner";

// ── Schema ─────────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name is required"),

  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+8801|01)[3-9]\d{8}$/,
      "Enter a valid Bangladeshi phone number"
    ),

  address: z
    .string()
    .trim()
    .min(10, "Please enter a detailed address"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ── Success Screen ────────────────────────────────────────────────────────

function OrderSuccess({ orderId }: { orderId: string }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
      }}
      className="text-center py-16 space-y-6 max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-slate-900">
          Order Placed Successfully!
        </h2>

        <p className="text-slate-500 text-sm">
          Your order has been placed successfully.
          You&apos;ll receive your medicines soon.
        </p>

        <div className="inline-flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 mt-2">
          <Package className="w-4 h-4 text-[#6B4FE0]" />

          <span className="text-sm font-mono font-semibold text-slate-700">
            #{orderId.slice(-8).toUpperCase()}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3"
      >
        <Button
          onClick={() => router.push("/orders")}
          className="bg-[#6B4FE0] hover:bg-[#5a3fcb] text-white rounded-xl"
        >
          <Package className="mr-2 w-4 h-4" />
          Track My Order
        </Button>

        <Button
          asChild
          variant="outline"
          className="rounded-xl border-slate-200"
        >
          <Link href="/shop">
            <ShoppingBag className="mr-2 w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────

const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 60;

// ── Page ──────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const { user } = useAuth();

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const isCartEmpty = items.length === 0;

  const isFreeShipping = totalPrice >= SHIPPING_THRESHOLD;

  const shippingCost = isCartEmpty
    ? 0
    : isFreeShipping
    ? 0
    : SHIPPING_COST;

  const grandTotal = totalPrice + shippingCost;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),

    defaultValues: {
      fullName: user?.name ?? "",
      phone: "",
      address: "",
      city: "",
      note: "",
    },
  });

  // ── Empty Cart ──────────────────────────────────────────────────────────

  if (isCartEmpty && !placedOrderId) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center space-y-4">
          <div className="text-6xl">🛒</div>

          <h2 className="text-xl font-semibold text-slate-700">
            Your cart is empty
          </h2>

          <p className="text-sm text-slate-400">
            Add some medicines before checkout.
          </p>

          <Button
            asChild
            className="bg-[#6B4FE0] hover:bg-[#5a3fcb] text-white rounded-xl"
          >
            <Link href="/shop">
              Browse Medicines
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────

  const onSubmit = async (values: CheckoutFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const shippingAddress = `
${values.fullName},
${values.phone},
${values.address},
${values.city}
${values.note ? `— Note: ${values.note}` : ""}
      `.trim();

      const orderItems = items.map((item) => ({
        medicineId: item.medicine.id,
        quantity: item.quantity,
      }));

      const res = await orderService.create({
        shippingAddress,
        items: orderItems,
      });

      if (res.success && res.data) {
        setPlacedOrderId(res.data.id);

        clearCart();

        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order");
      }
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-[#6B4FE0] transition-colors"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Checkout
              </h1>

              <p className="text-sm text-slate-400">
                Cash on Delivery
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Screen */}
        <AnimatePresence>
          {placedOrderId && (
            <OrderSuccess orderId={placedOrderId} />
          )}
        </AnimatePresence>

        {/* Checkout Form */}
        {!placedOrderId && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#6B4FE0]/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#6B4FE0]" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Shipping Details
                    </h2>

                    <p className="text-xs text-slate-400">
                      Where should we deliver?
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Full Name
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Your full name"
                              className="h-11 rounded-xl border-slate-200 focus-visible:ring-[#6B4FE0]"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="01XXXXXXXXX"
                              className="h-11 rounded-xl border-slate-200 focus-visible:ring-[#6B4FE0]"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            City
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Dhaka"
                              className="h-11 rounded-xl border-slate-200 focus-visible:ring-[#6B4FE0]"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Delivery Address
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              placeholder="House/Flat number, Road, Area..."
                              rows={3}
                              className="rounded-xl border-slate-200 focus-visible:ring-[#6B4FE0] resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Note */}
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Order Note{" "}
                            <span className="text-slate-400 font-normal">
                              (optional)
                            </span>
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              placeholder="Any special delivery instructions..."
                              rows={2}
                              className="rounded-xl border-slate-200 focus-visible:ring-[#6B4FE0] resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* COD */}
                    <div className="flex items-start gap-3 bg-[#6B4FE0]/5 border border-[#6B4FE0]/15 rounded-xl p-4">
                      <Tag className="w-5 h-5 text-[#6B4FE0] flex-shrink-0 mt-0.5" />

                      <div>
                        <p className="text-sm font-semibold text-[#6B4FE0]">
                          Cash on Delivery
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5">
                          Pay in cash when your order arrives.
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || items.length === 0
                      }
                      className="w-full h-12 bg-[#6B4FE0] hover:bg-[#5a3fcb] text-white rounded-xl font-semibold text-base shadow-md shadow-[#6B4FE0]/20"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                          Placing Order...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />

                          Place Order —{" "}
                          {formatPrice(grandTotal)}
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>

            {/* Right */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 sticky top-24"
              >
                <h2 className="font-bold text-slate-900">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.medicine.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg flex-shrink-0">
                          💊
                        </span>

                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 line-clamp-1">
                            {item.medicine.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold text-slate-700 flex-shrink-0 ml-2">
                        {formatPrice(
                          Number(
                            (
                              item.medicine.price *
                              item.quantity
                            ).toFixed(2)
                          )
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>

                    <span>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Shipping
                    </span>

                    <span
                      className={
                        isFreeShipping
                          ? "text-green-600 font-medium"
                          : ""
                      }
                    >
                      {isFreeShipping
                        ? "FREE"
                        : formatPrice(shippingCost)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total</span>

                    <span className="text-[#6B4FE0]">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}