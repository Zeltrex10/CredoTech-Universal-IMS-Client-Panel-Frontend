import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productsApi, categoriesApi } from "../../services";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchResult {
	id: string;
	title: string;
	description: string;
	type: "product" | "category";
	url: string;
}

export const Search: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const searchRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const debouncedQuery = useDebounce(query, 300);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const search = async () => {
			if (!debouncedQuery) {
				setResults([]);
				return;
			}

			setIsLoading(true);
			try {
				const [{ data: products }, { data: categories }] = await Promise.all([
					productsApi.getAll(),
					categoriesApi.getAll(),
				]);

				const productResults = products
					.filter((product: any) =>
						product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
					)
					.map((product: any) => ({
						id: product.id,
						title: product.name,
						description: `SKU: ${product.sku}`,
						type: "product" as const,
						url: `/products/${product.id}`,
					}));

				const categoryResults = categories
					.filter((category: any) =>
						category.name.toLowerCase().includes(debouncedQuery.toLowerCase())
					)
					.map((category: any) => ({
						id: category.id,
						title: category.name,
						description: category.description || "",
						type: "category" as const,
						url: `/categories/${category.id}`,
					}));

				setResults([...productResults, ...categoryResults]);
			} catch (error) {
				console.error("Error searching:", error);
			} finally {
				setIsLoading(false);
			}
		};

		search();
	}, [debouncedQuery]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < results.length - 1 ? prev + 1 : prev
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && results[selectedIndex]) {
					navigate(results[selectedIndex].url);
					setIsOpen(false);
					setQuery("");
				}
				break;
			case "Escape":
				setIsOpen(false);
				break;
		}
	};

	return (
		<div className="relative" ref={searchRef}>
			<div className="relative">
				<input
					type="text"
					placeholder="Search..."
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				/>
				<SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
			</div>

			{isOpen && (query || isLoading) && (
				<div className="absolute mt-2 w-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 max-h-96 overflow-y-auto">
					{isLoading ? (
						<div className="p-4 text-center text-neutral-500">Loading...</div>
					) : results.length > 0 ? (
						<ul className="py-2">
							{results.map((result, index) => (
								<li
									key={result.id}
									className={`px-4 py-2 cursor-pointer ${
										index === selectedIndex
											? "bg-neutral-100 dark:bg-neutral-700"
											: "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
									}`}
									onClick={() => {
										navigate(result.url);
										setIsOpen(false);
										setQuery("");
									}}
								>
									<div className="flex items-center">
										<div>
											<div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
												{result.title}
											</div>
											<div className="text-sm text-neutral-500 dark:text-neutral-400">
												{result.description}
											</div>
										</div>
										<div className="ml-auto">
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													result.type === "product"
														? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200"
														: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-200"
												}`}
											>
												{result.type}
											</span>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : query ? (
						<div className="p-4 text-center text-neutral-500">
							No results found
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};
