import { api } from "./client";

export const CategoriesApi = {
    getById: (id) => api.get(`/categories/${id}`),
    searchByName: ({ searchString = "", page = 1, pageSize = 20 }) => api.get(`/categories/search`, { params: { searchString, page, pageSize } })    
};

export default CategoriesApi;