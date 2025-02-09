import { Outlet } from "react-router-dom";

export const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
				<div className="w-full max-w-md">
					<Outlet />
				</div>
			</main>
			<footer className="py-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
				© {new Date().getFullYear()} CredoTech. All rights reserved.
			</footer>
		</div>
	);
};
