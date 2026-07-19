import api from "./api";
import { Product, Order, User } from "../types";

export const adminProductAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/admin/products");
    return response.data.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    thumbnail?: string;
    images?: string[];
    category?: string;
    players?: string;
    playTime?: string;
    sku?: string;
    cardMaterial?: string;
    shippingInfo?: string;
    howToPlayUrl?: string;
  }): Promise<Product> => {
    const response = await api.post("/admin/products", data);
    return response.data.data;
  },

  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      thumbnail?: string;
      images?: string[];
      category?: string;
      players?: string;
      playTime?: string;
      sku?: string;
      cardMaterial?: string;
      shippingInfo?: string;
      howToPlayUrl?: string;
    }
  ): Promise<Product> => {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/admin/products/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.imageUrl;
  },
};

export const adminOrderAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get("/admin/orders");
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: string
  ): Promise<Order> => {
    const response = await api.patch(`/admin/orders/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};

export const adminUserAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/admin/users");
    return response.data.data;
  },

  getStats: async (): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
  }> => {
    const response = await api.get("/admin/users/stats");
    return response.data.data;
  },
};
