import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface UseApiResponse<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	execute: (...args: any[]) => Promise<T | null>;
	reset: () => void;
}

export function useApi<T>(
	apiFunction: (...args: any[]) => Promise<T>,
	options = {
		showSuccessToast: false,
		successMessage: "",
		showErrorToast: true,
	}
): UseApiResponse<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setLoading(false);
		setError(null);
	}, []);

	const execute = useCallback(
		async (...args: any[]): Promise<T | null> => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiFunction(...args);
				setData(response);

				if (options.showSuccessToast) {
					toast.success(options.successMessage || "Operation successful");
				}

				return response;
			} catch (err) {
				const error = err as AxiosError<{ message: string }>;
				const errorMessage =
					error.response?.data?.message ||
					error.message ||
					"An unexpected error occurred";

				setError(errorMessage);

				if (options.showErrorToast) {
					toast.error(errorMessage);
				}

				return null;
			} finally {
				setLoading(false);
			}
		},
		[apiFunction, options]
	);

	return { data, loading, error, execute, reset };
}

// Example usage:
// const { data, loading, error, execute } = useApi(authApi.login, {
//     showSuccessToast: true,
//     successMessage: 'Login successful!',
//     showErrorToast: true
// });
