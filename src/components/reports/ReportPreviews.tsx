import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/Table";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#64748b"];

interface PreviewProps {
	data: any;
}

export const InventoryReportPreview: React.FC<PreviewProps> = ({ data }) => {
	return (
		<div className="space-y-6">
			{/* Stock Level Summary */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<h3 className="text-lg font-medium mb-4">Current Stock Levels</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data.stockLevels}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label
								>
									{data.stockLevels.map((entry: any, index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-medium mb-4">Stock Value Distribution</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={data.stockValue}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="category" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="value" fill="#0ea5e9" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Inventory Table */}
			<div>
				<h3 className="text-lg font-medium mb-4">Inventory Details</h3>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>In Stock</TableHead>
								<TableHead>Value</TableHead>
								<TableHead>Last Updated</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.items.map((item: any) => (
								<TableRow key={item.id}>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.category}</TableCell>
									<TableCell>{item.quantity}</TableCell>
									<TableCell>{item.value}</TableCell>
									<TableCell>{item.lastUpdated}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export const SalesReportPreview: React.FC<PreviewProps> = ({ data }) => {
	return (
		<div className="space-y-6">
			{/* Sales Trends */}
			<div>
				<h3 className="text-lg font-medium mb-4">Sales Trend</h3>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data.salesTrend}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="value"
								stroke="#0ea5e9"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Sales Table */}
			<div>
				<h3 className="text-lg font-medium mb-4">Sales Details</h3>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Product</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Revenue</TableHead>
								<TableHead>Profit</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.sales.map((sale: any) => (
								<TableRow key={sale.id}>
									<TableCell>{sale.date}</TableCell>
									<TableCell>{sale.product}</TableCell>
									<TableCell>{sale.quantity}</TableCell>
									<TableCell>{sale.revenue}</TableCell>
									<TableCell>{sale.profit}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export const CostAnalysisPreview: React.FC<PreviewProps> = ({ data }) => {
	return (
		<div className="space-y-6">
			{/* Cost Distribution */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<h3 className="text-lg font-medium mb-4">Cost Distribution</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data.costDistribution}
									dataKey="value"
									nameKey="category"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label
								>
									{data.costDistribution.map((entry: any, index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-medium mb-4">Cost Trends</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data.costTrends}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="value"
									stroke="#0ea5e9"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Cost Details */}
			<div>
				<h3 className="text-lg font-medium mb-4">Cost Details</h3>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Category</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Percentage</TableHead>
								<TableHead>Change</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.costDetails.map((cost: any) => (
								<TableRow key={cost.category}>
									<TableCell>{cost.category}</TableCell>
									<TableCell>{cost.amount}</TableCell>
									<TableCell>{cost.percentage}%</TableCell>
									<TableCell
										className={
											cost.change > 0
												? "text-success-500"
												: cost.change < 0
												? "text-error-500"
												: "text-neutral-500"
										}
									>
										{cost.change > 0 ? "+" : ""}
										{cost.change}%
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export const AuditTrailPreview: React.FC<PreviewProps> = ({ data }) => {
	return (
		<div className="space-y-6">
			{/* Activity Timeline */}
			<div>
				<h3 className="text-lg font-medium mb-4">Activity Timeline</h3>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Timestamp</TableHead>
								<TableHead>User</TableHead>
								<TableHead>Action</TableHead>
								<TableHead>Details</TableHead>
								<TableHead>IP Address</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.activities.map((activity: any) => (
								<TableRow key={activity.id}>
									<TableCell>{activity.timestamp}</TableCell>
									<TableCell>{activity.user}</TableCell>
									<TableCell>{activity.action}</TableCell>
									<TableCell>{activity.details}</TableCell>
									<TableCell>{activity.ipAddress}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Activity Summary */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<h3 className="text-lg font-medium mb-4">Activity by Type</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data.activityByType}
									dataKey="value"
									nameKey="type"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label
								>
									{data.activityByType.map((entry: any, index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-medium mb-4">Activity by User</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={data.activityByUser}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="user" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="activities" fill="#0ea5e9" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
};
