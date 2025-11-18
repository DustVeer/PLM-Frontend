import { api } from "./client";

export const UsersApi = {
  getById: (id) => api.get(`/users/${id}`),
  list: () => api.get(`/users`),
  create: (dto) => api.post(`/users`, dto),
  update: (id, dto) => api.put(`/users/${id}`, dto),
  updatePassword: (id, dto) => api.put(`/users/${id}/password`, dto),
};

export default UsersApi;