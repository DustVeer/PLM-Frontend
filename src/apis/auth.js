import { api } from "./client";

export const AuthApi = {
  login: (dto) => api.post(`/auth/login`, dto),
};

export default AuthApi;