import api from "./api";

export type TransactionType = "stock-in" | "stock-out";

export interface Transaction {
	id: string;
	type: TransactionType;
	productId: string;
	quantity: number;
	price: number;
	date: string;
	createdAt: string;
	updatedAt: string;
}

export const transactionsApi = {
	getAll: async () => {
		const response = await api.get("/transactions");
		return response;
	},

	create: async (data: {
		type: TransactionType;
		productId: string;
		quantity: number;
		price: number;
		date?: string;
	}) => {
		const response = await api.post("/transactions", data);
		return response;
	},

	deleteAll: async () => {
		const response = await api.delete("/transactions");
		return response;
	},
};
