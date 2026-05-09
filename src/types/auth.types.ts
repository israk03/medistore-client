export type Role = "CUSTOMER" | "SELLER" | "ADMIN";



export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "SELLER";
};

export type OrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBanned: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  _count?: { medicines: number };
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  manufacturer: string;
  sellerId: string;
  categoryId: string;
  category: { id: string; name: string };
  seller: { id: string; name: string };
  avgRating?: number;
  _count?: { reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  medicine: {
    id: string;
    name: string;
    imageUrl: string | null;
    manufacturer: string;
  };
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  customer?: { id: string; name: string; email: string };
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { id: string; name: string };
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface PaginatedMedicines {
  medicines: Medicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  users: { customers: number; sellers: number; total: number };
  medicines: number;
  orders: {
    total: number;
    byStatus: {
      placed: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
  };
  revenue: { total: number };
}