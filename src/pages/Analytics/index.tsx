import { useState, useMemo, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { productsApi, transactionsApi } from "../../services";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface Transaction {
	id: string;
	date: string;
	price: number;
	quantity: number;
}

interface Product {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

interface GroupedData {
	total: number;
	count: number;
}

interface ChartDataset {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}

interface ChartData {
	labels: string[];
	datasets: ChartDataset[];
}

export default function Analytics() {
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [chartType, setChartType] = useState<"line" | "bar">("line");
	const [dataType, setDataType] = useState<"daily" | "weekly" | "monthly">(
		"daily"
	);

	// Fetch data using React Query
	const { data: productsData, isLoading: isLoadingProducts } = useQuery<{
		data: Product[];
	}>({
		queryKey: ["products"],
		queryFn: () => productsApi.getAll(),
	});

	const { data: transactionsData, isLoading: isLoadingTransactions } =
		useQuery<{ data: Transaction[] }>({
			queryKey: ["transactions"],
			queryFn: () => transactionsApi.getAll(),
		});

	// Memoize chart options
	const chartOptions = useMemo<ChartOptions<"line" | "bar">>(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top" as const,
				},
				title: {
					display: true,
					text: "Data Analysis",
				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
				},
				y: {
					beginAtZero: true,
					grid: {
						color: "rgba(0, 0, 0, 0.1)",
					},
				},
			},
		}),
		[]
	);

	// Memoize data transformations
	const chartData = useMemo<ChartData>(() => {
		if (!transactionsData?.data) {
			return {
				labels: [],
				datasets: [],
			};
		}

		// Transform data based on dateRange and dataType
		const filteredTransactions = transactionsData.data.filter(
			(t: Transaction) => {
				if (!dateRange?.from) return true;
				const date = new Date(t.date);
				return (
					date >= dateRange.from && (!dateRange.to || date <= dateRange.to)
				);
			}
		);

		// Group by time period
		const groupedData = filteredTransactions.reduce<
			Record<string, GroupedData>
		>((acc, t: Transaction) => {
			const date = new Date(t.date);
			const key =
				dataType === "daily"
					? date.toISOString().split("T")[0]
					: dataType === "weekly"
					? `Week ${Math.ceil(date.getDate() / 7)}`
					: `${date.toLocaleString("default", {
							month: "short",
					  })} ${date.getFullYear()}`;

			if (!acc[key]) {
				acc[key] = { total: 0, count: 0 };
			}
			acc[key].total += t.price * t.quantity;
			acc[key].count += 1;
			return acc;
		}, {});

		const labels = Object.keys(groupedData);
		const values = Object.values(groupedData);

		return {
			labels,
			datasets: [
				{
					label: "Revenue",
					data: values.map((v: GroupedData) => v.total),
					borderColor: "rgb(75, 192, 192)",
					backgroundColor: "rgba(75, 192, 192, 0.5)",
				},
				{
					label: "Transaction Count",
					data: values.map((v: GroupedData) => v.count),
					borderColor: "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)",
				},
			],
		};
	}, [transactionsData, dateRange, dataType]);

	// Memoize change handlers
	const handleChartTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setChartType(e.target.value as "line" | "bar");
		},
		[]
	);

	const handleDataTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setDataType(e.target.value as "daily" | "weekly" | "monthly");
		},
		[]
	);

	if (isLoadingProducts || isLoadingTransactions) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Analytics</h1>
				<div className="flex gap-4">
					<Select
						value={chartType}
						onChange={handleChartTypeChange}
						className="w-32"
					>
						<option value="line">Line Chart</option>
						<option value="bar">Bar Chart</option>
					</Select>
					<Select
						value={dataType}
						onChange={handleDataTypeChange}
						className="w-32"
					>
						<option value="daily">Daily</option>
						<option value="weekly">Weekly</option>
						<option value="monthly">Monthly</option>
					</Select>
					<DateRangePicker
						value={dateRange}
						onChange={setDateRange}
						className="w-72"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<Card.Header>
						<Card.Title>Total Revenue</Card.Title>
						<Card.Description>
							Overall revenue from all transactions
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="text-4xl font-bold">
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(
								chartData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0
							)}
						</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header>
						<Card.Title>Transaction Count</Card.Title>
						<Card.Description>Total number of transactions</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="text-4xl font-bold">
							{chartData.datasets[1]?.data.reduce((a, b) => a + b, 0) || 0}
						</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header>
						<Card.Title>Average Transaction</Card.Title>
						<Card.Description>Average value per transaction</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="text-4xl font-bold">
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(
								(chartData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0) /
									(chartData.datasets[1]?.data.reduce((a, b) => a + b, 0) || 1)
							)}
						</div>
					</Card.Content>
				</Card>
			</div>

			<Card>
				<Card.Header>
					<Card.Title>Data Visualization</Card.Title>
					<Card.Description>
						Visual representation of your data
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div className="h-[400px] w-full">
						{chartType === "line" ? (
							<Line options={chartOptions} data={chartData} />
						) : (
							<Bar options={chartOptions} data={chartData} />
						)}
					</div>
				</Card.Content>
			</Card>
		</div>
	);
}
