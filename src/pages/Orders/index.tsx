import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../services";
import { Button } from "../../components/ui/Button";
import { format } from "date-fns";

interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	status: "pending" | "processing" | "completed" | "cancelled";
	total: number;
	items: {
		productId: string;
		name: string;
		quantity: number;
		price: number;
	}[];
	createdAt: string;
}

export const Orders: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const { data } = await api.get("/orders");
				setOrders(data);
			} catch (error) {
				toast.error("Failed to fetch orders");
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const getStatusColor = (status: Order["status"]) => {
		switch (status) {
			case "pending":
				return "bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-200";
			case "processing":
				return "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200";
			case "completed":
				return "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200";
			case "cancelled":
				return "bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-200";
			default:
				return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-200";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
						Orders
					</h1>
					<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
						Manage and track customer orders
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
				</div>
			) : orders.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-neutral-500 dark:text-neutral-400">
						No orders found
					</p>
				</div>
			) : (
				<div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
							<thead className="bg-neutral-50 dark:bg-neutral-800">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Order
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Total
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
								{orders.map((order) => (
									<tr
										key={order.id}
										className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
												{order.orderNumber}
											</div>
											<div className="text-sm text-neutral-500 dark:text-neutral-400">
												{order.items.length} items
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-neutral-900 dark:text-neutral-100">
												{order.customerName}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
													order.status
												)}`}
											>
												{order.status.charAt(0).toUpperCase() +
													order.status.slice(1)}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
											${order.total.toFixed(2)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
											{format(new Date(order.createdAt), "MMM d, yyyy")}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<Button variant="ghost" size="sm">
												View Details
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
