import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import {
	LayoutDashboard,
	Package,
	Tag,
	ArrowLeftRight,
	BarChart3,
} from "lucide-react";

const navItems = [
	{
		name: "Dashboard",
		path: "/",
		icon: LayoutDashboard,
	},
	{
		name: "Products",
		path: "/products",
		icon: Package,
	},
	{
		name: "Categories",
		path: "/categories",
		icon: Tag,
	},
	{
		name: "Transactions",
		path: "/transactions",
		icon: ArrowLeftRight,
	},
	// {
	// 	name: "Reports",
	// 	path: "/reports",
	// 	icon: BarChart3,
	// },
];

export const BottomNav = () => {
	const location = useLocation();

	return (
		<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 z-50">
			<div className="max-w-md mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{navItems.map((item) => {
						const isActive = location.pathname === item.path;
						const Icon = item.icon;

						return (
							<Link
								key={item.path}
								to={item.path}
								className={cn(
									"flex flex-col items-center justify-center w-16 h-16 relative",
									"text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
									isActive && "text-primary-500 dark:text-primary-400"
								)}
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									className="flex flex-col items-center"
								>
									<Icon className="h-5 w-5" />
									<span className="text-xs mt-1">{item.name}</span>
									{isActive && (
										<motion.div
											layoutId="bottomNavIndicator"
											className="absolute -bottom-0.5 w-12 h-0.5 bg-primary-500 dark:bg-primary-400 rounded-full"
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 30,
											}}
										/>
									)}
								</motion.div>
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
};
