import axiosInstance from "@/proxy";
import { ApiResponse, Medicine, PaginatedMedicines } from "@/types/auth.types";


export interface GetMedicinesParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const medicineService = {
  async getAll(params?: GetMedicinesParams) {
    const { data } = await axiosInstance.get<
      ApiResponse<PaginatedMedicines>
    >("/medicines", {
      params,
    });

    return data;
  },

  async getById(id: string) {
    const { data } = await axiosInstance.get<
      ApiResponse<Medicine>
    >(`/medicines/${id}`);

    return data;
  },
};