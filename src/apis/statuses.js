import { api } from "./client";

export const StatusesApi = {
  list: () => api.get(`/statuses`)
};

export default StatusesApi;