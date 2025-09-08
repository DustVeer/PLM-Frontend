import { api } from "./client";

export const ProductsApi = {
  getById: (id) => api.get(`/products/${id}`),
  list: () => api.get(`/products`),
  create: (dto) => api.post(`/products`, dto),
};
