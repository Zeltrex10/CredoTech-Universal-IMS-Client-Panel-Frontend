import api from "./api";

export interface Category {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

export const categoriesApi = {
	getAll: async () => {
		const response = await api.get("/categories");
		return response;
	},

	getById: async (id: string) => {
		const response = await api.get(`/categories/${id}`);
		return response;
	},

	create: async (data: { name: string; description?: string }) => {
		const response = await api.post("/categories", data);
		return response;
	},

	update: async (id: string, data: { name: string; description?: string }) => {
		const response = await api.put(`/categories/${id}`, data);
		return response;
	},

	delete: async (id: string) => {
		const response = await api.delete(`/categories/${id}`);
		return response;
	},
};
