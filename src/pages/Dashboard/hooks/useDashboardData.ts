import { useState, useEffect } from "react";
import { productsApi, transactionsApi } from "../../../services";

interface DashboardData {
	totalProducts: number;
	lowStockProducts: number;
	recentTransactions: any[];
	stockValue: number;
}

export const useDashboardData = () => {
	const [data, setData] = useState<DashboardData>({
		totalProducts: 0,
		lowStockProducts: 0,
		recentTransactions: [],
		stockValue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [productsResponse, transactionsResponse] = await Promise.all([
					productsApi.getAll(),
					transactionsApi.getAll(),
				]);

				const products = productsResponse.data;
				const transactions = transactionsResponse.data;

				// Calculate dashboard metrics
				const totalProducts = products.length;
				const lowStockProducts = products.filter(
					(product: any) => product.quantity <= product.threshold
				).length;
				const stockValue = products.reduce(
					(total: number, product: any) =>
						total + product.price * product.quantity,
					0
				);

				setData({
					totalProducts,
					lowStockProducts,
					recentTransactions: transactions.slice(0, 5),
					stockValue,
				});
			} catch (err) {
				setError("Failed to fetch dashboard data");
				console.error("Error fetching dashboard data:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	return { data, isLoading, error };
};
