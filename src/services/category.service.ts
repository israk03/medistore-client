import axiosInstance from "@/proxy";
import type { ApiResponse, Category } from "@/types/auth.types";

export const categoryService = {
  async getAll() {
    const { data } = await axiosInstance.get<
      ApiResponse<Category[]>
    >("/categories");

    return data;
  },

  async create(name: string) {
    const { data } = await axiosInstance.post<
      ApiResponse<Category>
    >("/categories", {
      name,
    });

    return data;
  },

  async delete(id: string) {
    const { data } = await axiosInstance.delete<
      ApiResponse<null>
    >(`/categories/${id}`);

    return data;
  },
};