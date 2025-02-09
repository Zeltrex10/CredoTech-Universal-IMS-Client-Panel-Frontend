import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export const Navigation = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className="bg-white dark:bg-neutral-800 shadow-lg">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<Link to="/" className="text-xl font-bold text-blue-600">
						CredoTech
					</Link>

					<div className="flex items-center space-x-4">
						<Link
							to="/dashboard"
							className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400"
						>
							Dashboard
						</Link>
						<Link
							to="/products"
							className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400"
						>
							Products
						</Link>
						<Link
							to="/categories"
							className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400"
						>
							Categories
						</Link>
						<Link
							to="/transactions"
							className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400"
						>
							Transactions
						</Link>

						<button
							onClick={toggleTheme}
							className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<SunIcon className="h-5 w-5 text-yellow-500" />
							) : (
								<MoonIcon className="h-5 w-5 text-neutral-700" />
							)}
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};
