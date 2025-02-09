import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
		errorInfo: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error, errorInfo: null };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
		this.setState({
			error,
			errorInfo,
		});
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
					<div className="max-w-xl w-full mx-4 p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
						<h1 className="text-2xl font-bold text-red-600 mb-4">
							Something went wrong
						</h1>
						<div className="mb-4 text-neutral-700 dark:text-neutral-300">
							{this.state.error && (
								<pre className="text-sm overflow-auto p-4 bg-neutral-100 dark:bg-neutral-900 rounded">
									{this.state.error.toString()}
								</pre>
							)}
						</div>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						>
							Reload Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
