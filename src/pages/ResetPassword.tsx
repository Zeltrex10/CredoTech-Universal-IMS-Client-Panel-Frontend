import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { authService } from "../services/auth";

export const ResetPassword: React.FC = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	if (!token) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 text-center">
					<Package className="mx-auto h-12 w-12 text-primary-600" />
					<h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
						Invalid Reset Link
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						This password reset link is invalid or has expired.
					</p>
					<div className="mt-4">
						<Link
							to="/request-reset"
							className="text-primary-600 hover:text-primary-500 font-medium"
						>
							Request a new reset link
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			await authService.resetPassword(token, password);
			toast.success("Password has been reset successfully");
			navigate("/login", { replace: true });
		} catch (error) {
			toast.error("Failed to reset password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<Package className="mx-auto h-12 w-12 text-primary-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
						Reset your password
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Enter your new password below
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="password" className="sr-only">
								New Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800"
								placeholder="New Password"
							/>
						</div>
						<div>
							<label htmlFor="confirmPassword" className="sr-only">
								Confirm New Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800"
								placeholder="Confirm New Password"
							/>
						</div>
					</div>

					<Button type="submit" className="w-full" isLoading={isLoading}>
						Reset Password
					</Button>
				</form>
			</div>
		</div>
	);
};
