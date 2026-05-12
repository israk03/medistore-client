"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Package, User, Store, MapPin, 
  Clock, CreditCard, ShieldCheck, AlertCircle 
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { formatPrice, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Order } from "@/types/auth.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await adminService.getOrderById(id as string);
        if (res.success) setOrder(res.data as Order);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (!order) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <AlertCircle className="h-12 w-12 text-slate-200" />
      <p className="text-slate-500 font-bold">Order record not found</p>
      <Button onClick={() => router.back()} variant="outline">Go Back</Button>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Registry
        </button>
        <Badge className={cn(getStatusColor(order.status), "px-4 py-1.5 rounded-full border-none text-[10px] font-black uppercase")}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Order Items) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Package className="h-5 w-5 text-indigo-500" />
              Manifest Detail
            </h2>
            
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-indigo-600">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.medicine?.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Unit Price: {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 text-sm">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-400">Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-black text-slate-900">Total Settlement</span>
                <span className="font-black text-indigo-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Entities & Logistics) */}
        <div className="space-y-6">
          {/* Seller / Pharmacy Card */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-lg shadow-indigo-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
              <Store className="h-3 w-3" /> Fulfilling Entity
            </h3>
            <p className="text-lg font-black leading-tight">
              {/* Note: Ensure your 'Order' type includes the medicine's seller details */}
              {order.orderItems?.[0]?.medicine?.seller?.name || "Verified Pharmacy"}
            </p>
            <p className="text-xs font-medium opacity-80 mt-1">
              {order.orderItems?.[0]?.medicine?.seller?.email || "contact@provider.com"}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-300" />
              <span className="text-[10px] font-bold uppercase tracking-wide">License Verified</span>
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <User className="h-3 w-3" /> Requester Profile
            </h3>
            <p className="font-black text-slate-900">{order.customer?.name}</p>
            <p className="text-xs font-bold text-slate-400 mb-4">{order.customer?.email}</p>
            
            <Separator className="mb-4" />
            
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Delivery Destination
            </h3>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>
          </div>

          {/* Order Metadata */}
          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Log Date</p>
                  <p className="text-xs font-bold">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Payment ID</p>
                  <p className="text-xs font-mono font-bold">TXN-{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl space-y-8 pb-20 animate-pulse">
      <div className="h-6 w-32 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[500px] bg-slate-100 rounded-[2.5rem]" />
        <div className="space-y-6">
          <div className="h-48 bg-slate-100 rounded-[2.5rem]" />
          <div className="h-64 bg-slate-100 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}