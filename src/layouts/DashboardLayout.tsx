import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { cn } from "../lib/utils";

export const DashboardLayout = () => {
	const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

	// Set initial sidebar state based on screen size
	useEffect(() => {
		const handleResize = () => {
			const isSmallScreen = window.innerWidth < 1024;
			if (isSmallScreen) {
				setIsSidebarMinimized(true);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleMinimize = () => {
		setIsSidebarMinimized((prev) => !prev);
	};

	return (
		<div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
			{/* Sidebar - hidden on mobile */}
			<div
				className={cn(
					"hidden lg:block relative",
					isSidebarMinimized ? "w-16" : "w-64",
					"transition-all duration-300 ease-in-out"
				)}
			>
				<Sidebar
					isMinimized={isSidebarMinimized}
					onToggleMinimize={toggleMinimize}
				/>
			</div>

			{/* Main content */}
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar />
				<main className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
					<Outlet />
				</main>
				<BottomNav />
			</div>
		</div>
	);
};
