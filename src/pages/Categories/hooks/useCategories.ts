import { useState, useEffect } from "react";
import { categoriesApi } from "../../../services";

interface Category {
	id: string;
	name: string;
	description?: string;
}

export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCategories = async () => {
		try {
			const response = await categoriesApi.getAll();
			setCategories(response.data);
			setError(null);
		} catch (err) {
			setError("Failed to fetch categories");
			console.error("Error fetching categories:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const createCategory = async (data: {
		name: string;
		description?: string;
	}) => {
		try {
			await categoriesApi.create(data);
			await fetchCategories();
			return true;
		} catch (err) {
			console.error("Error creating category:", err);
			throw err;
		}
	};

	const updateCategory = async (
		id: string,
		data: { name: string; description?: string }
	) => {
		try {
			await categoriesApi.update(id, data);
			await fetchCategories();
			return true;
		} catch (err) {
			console.error("Error updating category:", err);
			throw err;
		}
	};

	const deleteCategory = async (id: string) => {
		try {
			await categoriesApi.delete(id);
			await fetchCategories();
			return true;
		} catch (err) {
			console.error("Error deleting category:", err);
			throw err;
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return {
		categories,
		isLoading,
		error,
		createCategory,
		updateCategory,
		deleteCategory,
		refetch: fetchCategories,
	};
};
