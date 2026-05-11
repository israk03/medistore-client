// src/services/admin.service.ts

import axiosInstance from "@/proxy";
import type {
  ApiResponse,
  DashboardStats,
  Order,
  User,
} from "@/types/auth.types";

const ADMIN_ENDPOINTS = {
  STATS: "/admin/stats",
  USERS: "/admin/users",
  ORDERS: "/admin/orders",
};

const buildParams = (
  key: string,
  value?: string
): Record<string, string> => {
  if (!value || value === "ALL") return {};
  return { [key]: value };
};

export const adminService = {
  // =========================
  // Dashboard
  // =========================
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const { data } = await axiosInstance.get<
      ApiResponse<DashboardStats>
    >(ADMIN_ENDPOINTS.STATS);

    return data;
  },

  // =========================
  // Users
  // =========================
  async getUsers(
    role?: string
  ): Promise<ApiResponse<User[]>> {
    const { data } = await axiosInstance.get<
      ApiResponse<User[]>
    >(ADMIN_ENDPOINTS.USERS, {
      params: buildParams("role", role),
    });

    return data;
  },

  async updateUserStatus(
    id: string,
    isBanned: boolean
  ): Promise<ApiResponse<User>> {
    const { data } = await axiosInstance.patch<
      ApiResponse<User>
    >(`${ADMIN_ENDPOINTS.USERS}/${id}/status`, {
      isBanned,
    });

    return data;
  },

  // =========================
  // Orders
  // =========================
  async getOrders(
    status?: string
  ): Promise<ApiResponse<Order[]>> {
    const { data } = await axiosInstance.get<
      ApiResponse<Order[]>
    >(ADMIN_ENDPOINTS.ORDERS, {
      params: buildParams("status", status),
    });

    return data;
  },

  async getOrderById(
    id: string
  ): Promise<ApiResponse<Order>> {
    const { data } = await axiosInstance.get<
      ApiResponse<Order>
    >(`${ADMIN_ENDPOINTS.ORDERS}/${id}`);

    return data;
  },
};