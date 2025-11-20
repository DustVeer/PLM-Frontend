import { api } from "./client";

export const StatusesApi = {
  list: () => api.get(`/statuses`),
  get: (id) => api.get(`/statuses/${id}`),
  getByActive: (active) => api.get(`/statuses/active`),
  create: (data) => api.post(`/statuses`, data),
  update: (id, data) => api.put(`/statuses/${id}`, data),
  delete: (id) => api.del(`/statuses/${id}`),
};

export default StatusesApi;