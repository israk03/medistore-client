import axiosInstance from "@/proxy";
import type { ApiResponse, Review } from "@/types/auth.types";

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  avgRating: number;
}

interface AddReviewPayload {
  rating: number;
  comment?: string;
}

export const reviewService = {
  async getMedicineReviews(medicineId: string) {
    const { data } = await axiosInstance.get<
      ApiResponse<ReviewsResponse>
    >(`/reviews/medicine/${medicineId}`);

    return data;
  },

  async addReview(
    medicineId: string,
    payload: AddReviewPayload
  ) {
    const { data } = await axiosInstance.post<
      ApiResponse<Review>
    >(`/reviews/medicine/${medicineId}`, payload);

    return data;
  },

  async removeReview(id: string) {
    const { data } = await axiosInstance.delete<
      ApiResponse<null>
    >(`/reviews/${id}`);

    return data;
  },
};