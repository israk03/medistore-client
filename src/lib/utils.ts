import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderStatus } from "@/types/auth.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? Number(price) : price;
  if (isNaN(num)) return "৳0.00";
  return `৳${num.toFixed(2)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    PLACED: "bg-blue-100 text-blue-700 border-blue-200",
    PROCESSING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}