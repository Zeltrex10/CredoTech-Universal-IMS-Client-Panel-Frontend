import { useState, useEffect } from "react";
import { productsApi } from "../../../services";

interface Product {
	id: string;
	name: string;
	sku: string;
	description?: string;
	price: number;
	quantity: number;
	threshold: number;
	categoryId: string;
}

export const useInventory = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = async () => {
		try {
			const response = await productsApi.getAll();
			setProducts(response.data);
			setError(null);
		} catch (err) {
			setError("Failed to fetch products");
			console.error("Error fetching products:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const createProduct = async (data: {
		name: string;
		sku: string;
		description?: string;
		price: number;
		quantity: number;
		threshold?: number;
		categoryId: string;
	}) => {
		try {
			await productsApi.create(data);
			await fetchProducts();
			return true;
		} catch (err) {
			console.error("Error creating product:", err);
			throw err;
		}
	};

	const updateProduct = async (
		id: string,
		data: {
			name?: string;
			sku?: string;
			description?: string;
			price?: number;
			quantity?: number;
			threshold?: number;
			categoryId?: string;
		}
	) => {
		try {
			await productsApi.update(id, data);
			await fetchProducts();
			return true;
		} catch (err) {
			console.error("Error updating product:", err);
			throw err;
		}
	};

	const deleteProduct = async (id: string) => {
		try {
			await productsApi.delete(id);
			await fetchProducts();
			return true;
		} catch (err) {
			console.error("Error deleting product:", err);
			throw err;
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return {
		products,
		isLoading,
		error,
		createProduct,
		updateProduct,
		deleteProduct,
		refetch: fetchProducts,
	};
};
