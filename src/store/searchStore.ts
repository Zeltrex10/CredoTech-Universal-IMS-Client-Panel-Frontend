import { create } from "zustand";
import { productsApi } from "../services/products";
import { categoriesApi } from "../services/categories";
import { transactionsApi } from "../services/transactions";

interface SearchResult {
	id: string;
	type: "product" | "category" | "transaction";
	title: string;
	description: string;
	url: string;
}

interface SearchStore {
	query: string;
	results: SearchResult[];
	isLoading: boolean;
	setQuery: (query: string) => void;
	search: () => Promise<void>;
	clearResults: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
	query: "",
	results: [],
	isLoading: false,
	setQuery: (query) => set({ query }),
	search: async () => {
		const { query } = get();
		if (!query) {
			set({ results: [] });
			return;
		}

		set({ isLoading: true });
		try {
			const [productsRes, categoriesRes, transactionsRes] = await Promise.all([
				productsApi.getAll(),
				categoriesApi.getAll(),
				transactionsApi.getAll(),
			]);

			const products = productsRes.data.products || [];
			const categories = categoriesRes.data.categories || [];
			const transactions = transactionsRes.data.transactions || [];

			const searchResults: SearchResult[] = [
				...products
					.filter((product: { name: string; }) =>
						product.name.toLowerCase().includes(query.toLowerCase())
					)
					.map((product: { _id: any; name: any; category: { name: any; }; quantity: any; }) => ({
						id: product._id,
						type: "product" as const,
						title: product.name,
						description: `${product.category?.name || "Uncategorized"} - ${
							product.quantity
						} in stock`,
						url: `/products/${product._id}`,
					})),
				...categories
					.filter((category: { name: string; }) =>
						category.name.toLowerCase().includes(query.toLowerCase())
					)
					.map((category: { _id: any; name: any; description: any; }) => ({
						id: category._id,
						type: "category" as const,
						title: category.name,
						description: `${category.description || "No description"}`,
						url: `/categories/${category._id}`,
					})),
				...transactions
					.filter((transaction: { product: { name: string; }; }) =>
						transaction.product?.name
							.toLowerCase()
							.includes(query.toLowerCase())
					)
					.map((transaction: { _id: any; product: { name: any; }; type: any; quantity: any; }) => ({
						id: transaction._id,
						type: "transaction" as const,
						title: transaction.product?.name || "Unknown Product",
						description: `${transaction.type} - ${transaction.quantity} units`,
						url: `/transactions/${transaction._id}`,
					})),
			];

			set({ results: searchResults, isLoading: false });
		} catch (error) {
			console.error("Error searching:", error);
			set({ results: [], isLoading: false });
		}
	},
	clearResults: () => set({ results: [] }),
}));
