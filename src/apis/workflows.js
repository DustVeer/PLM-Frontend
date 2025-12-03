import { api } from "./client";

export const WorkflowsApi = {
    list: () => api.get(`/workflows`),
    toggleActive: (id) => api.put(`/workflows/${id}/toggle-active`),
    get: (id) => api.get(`/workflows/${id}`),
    create: (data) => api.post(`/workflows`, data),
    update: (id, data) => api.put(`/workflows/${id}`, data),
    delete: (id) => api.del(`/workflows/${id}`),
}

export default WorkflowsApi;