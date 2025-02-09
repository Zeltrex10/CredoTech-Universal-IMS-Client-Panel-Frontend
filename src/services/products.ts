import api from "./api";

export interface Product {
	id: string;
	name: string;
	sku: string;
	description?: string;
	price: number;
	categoryId: string;
	threshold?: number;
	quantity: number;
	createdAt: string;
	updatedAt: string;
}

export const productsApi = {
	getAll: async () => {
		const response = await api.get("/products");
		return response;
	},

	getById: async (id: string) => {
		const response = await api.get(`/products/${id}`);
		return response;
	},

	create: async (data: {
		name: string;
		sku: string;
		description?: string;
		price: number;
		categoryId: string;
		threshold?: number;
		quantity: number;
	}) => {
		const response = await api.post("/products", data);
		return response;
	},

	update: async (
		id: string,
		data: {
			name?: string;
			sku?: string;
			description?: string;
			price?: number;
			categoryId?: string;
			threshold?: number;
			quantity?: number;
		}
	) => {
		const response = await api.put(`/products/${id}`, data);
		return response;
	},

	delete: async (id: string) => {
		const response = await api.delete(`/products/${id}`);
		return response;
	},
};
