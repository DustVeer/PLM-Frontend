import { api } from "./client";

export const UsersApi = {
  getById: (id) => api.get(`/users/${id}`),
  list: () => api.get(`/users`),
  create: (dto) => api.post(`/users`, dto),
};

export default UsersApi;