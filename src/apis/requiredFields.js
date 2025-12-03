import { api } from "./client";

export const RequiredFieldsApi = {
  list: () => api.get(`/requiredfields`),
};

export default RequiredFieldsApi;