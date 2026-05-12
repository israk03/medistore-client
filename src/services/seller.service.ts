import axiosInstance from "@/proxy";
import { ApiResponse, Medicine, Order, OrderStatus } from "@/types/auth.types";

const BASE = "/seller";

interface MedicineInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  manufacturer: string;
  categoryId: string;
}

type MedicineUpdateInput = Partial<MedicineInput>;


export const sellerService = {
  getMyMedicines: async () => {
    const res = await axiosInstance.get<ApiResponse<Medicine[]>>(
      `${BASE}/medicines`
    );
    return res.data;
  },

  addMedicine: async (data: MedicineInput) => {
    const res = await axiosInstance.post<ApiResponse<Medicine>>(
      `${BASE}/medicines`,
      data
    );
    return res.data;
  },

  updateMedicine: async (id: string, data: MedicineUpdateInput) => {
    const res = await axiosInstance.put<ApiResponse<Medicine>>(
      `${BASE}/medicines/${id}`,
      data
    );
    return res.data;
  },

  deleteMedicine: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(
      `${BASE}/medicines/${id}`
    );
    return res.data;
  },

  getOrders: async () => {
    const res = await axiosInstance.get<ApiResponse<Order[]>>(
      `${BASE}/orders`
    );
    return res.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const res = await axiosInstance.patch<ApiResponse<Order>>(
      `${BASE}/orders/${id}/status`,
      { status }
    );
    return res.data;
  },
};