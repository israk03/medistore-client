// src/services/auth.service.ts
import axiosInstance from "@/proxy";
import { AuthResponse, RegisterPayload } from "@/types/auth.types";

// Helper — extracts the real error message from AxiosError
const getErrorMessage = (err: any): string => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong"
  );
};

export const authService = {
  login: async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/login",
        payload
      );
      return response.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err));
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const res = await axiosInstance.post<AuthResponse>(
        "/auth/register",
        payload
      );
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err));
    }
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    try {
      const res = await axiosInstance.post<AuthResponse>(
        "/auth/google",
        { credential }
      );
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err));
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err));
    }
  },
    // UPDATE PROFILE
  updateProfile: async (data: {
    name?: string;
    email?: string;
  }) => {
    try {
      const res = await axiosInstance.patch(
        "/auth/profile",
        data
      );

      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err));
    }
  },
};