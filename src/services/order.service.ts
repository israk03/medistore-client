import axiosInstance from "@/proxy";
import { ApiResponse, Order } from "@/types/auth.types";

export interface OrderItemInput {
  medicineId: string;
  quantity: number;
}

export interface CreateOrderInput {
  shippingAddress: string;
  items: OrderItemInput[];
}

const create = async (data: CreateOrderInput): Promise<ApiResponse<Order>> => {
  const res = await axiosInstance.post<ApiResponse<Order>>(
    "/orders",
    data
  );

  return res.data;
};

const getMyOrders = async (): Promise<ApiResponse<Order[]>> => {
  const res = await axiosInstance.get<ApiResponse<Order[]>>("/orders");

  return res.data;
};

const getById = async (id: string): Promise<ApiResponse<Order>> => {
  const res = await axiosInstance.get<ApiResponse<Order>>(
    `/orders/${id}`
  );

  return res.data;
};

const cancel = async (id: string): Promise<ApiResponse<Order>> => {
  const res = await axiosInstance.patch<ApiResponse<Order>>(
    `/orders/${id}/cancel`
  );

  return res.data;
};

export const orderService = {
  create,
  getMyOrders,
  getById,
  cancel,
};