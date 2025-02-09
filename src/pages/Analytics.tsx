import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { DateRangePicker } from "../components/ui/DateRangePicker";
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
	ChartData,
	ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { DateRange } from "react-day-picker";

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

// Chart options
const chartOptions: ChartOptions = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Data Analysis",
		},
	},
};

export default function Analytics() {
	const [dateRange, setDateRange] = useState<DateRange>();
	const [chartType, setChartType] = useState("line");
	const [dataType, setDataType] = useState("daily");

	// Sample data - replace with actual data fetching
	const data: ChartData = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "Dataset 1",
				data: [65, 59, 80, 81, 56, 55, 40],
				borderColor: "rgb(75, 192, 192)",
				backgroundColor: "rgba(75, 192, 192, 0.5)",
			},
			{
				label: "Dataset 2",
				data: [28, 48, 40, 19, 86, 27, 90],
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
		],
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Analytics</h1>
				<div className="flex gap-4">
					<Select
						value={chartType}
						onChange={(e) => setChartType(e.target.value)}
						className="w-32"
					>
						<option value="line">Line Chart</option>
						<option value="bar">Bar Chart</option>
					</Select>
					<Select
						value={dataType}
						onChange={(e) => setDataType(e.target.value)}
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
						<Card.Title>Total Data Points</Card.Title>
						<Card.Description>Overview of all data points</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="text-4xl font-bold">1,234</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header>
						<Card.Title>Average Value</Card.Title>
						<Card.Description>Average across all data</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="text-4xl font-bold">45.6</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header>
						<Card.Title>Growth Rate</Card.Title>
						<Card.Description>Month over month growth</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="text-4xl font-bold text-green-500">+12.3%</div>
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
							<Line options={chartOptions} data={data} />
						) : (
							<Bar options={chartOptions} data={data} />
						)}
					</div>
				</Card.Content>
			</Card>
		</div>
	);
}
