import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { authService } from "../services/auth";

export const RequestReset: React.FC = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await authService.requestPasswordReset(email);
			setIsSubmitted(true);
			toast.success("Password reset instructions have been sent to your email");
		} catch (error) {
			toast.error("Failed to request password reset");
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 text-center">
					<Package className="mx-auto h-12 w-12 text-primary-600" />
					<h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
						Check your email
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						We've sent password reset instructions to {email}
					</p>
					<div className="mt-4">
						<Link
							to="/login"
							className="text-primary-600 hover:text-primary-500 font-medium"
						>
							Return to login
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<Package className="mx-auto h-12 w-12 text-primary-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
						Reset your password
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Enter your email address and we'll send you instructions to reset
						your password
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800"
							placeholder="Email address"
						/>
					</div>

					<div>
						<Button type="submit" className="w-full" isLoading={isLoading}>
							Send Reset Instructions
						</Button>
					</div>

					<div className="text-center">
						<Link
							to="/login"
							className="text-sm text-primary-600 hover:text-primary-500"
						>
							Return to login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
