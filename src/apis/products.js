import { api } from "./client";

export const ProductsApi = {
  getById: (id) => api.get(`/products/${id}`),
  list: () => api.get(`/products`),
  create: (dto) => api.post(`/products`, dto),
  update: (id, dto) => api.put(`/products/${id}`, dto),
  delete: (id) => api.del(`/products/${id}`)
};

export default ProductsApi;