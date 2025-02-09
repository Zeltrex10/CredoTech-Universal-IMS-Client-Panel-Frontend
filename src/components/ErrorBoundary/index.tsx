import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	private handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	private handleGoHome = () => {
		window.location.href = "/";
	};

	public render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
					<div className="max-w-md w-full mx-auto p-8">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
								<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
							</div>
							<h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
								Oops! Something went wrong
							</h1>
							<p className="text-neutral-600 dark:text-neutral-400 mb-8">
								{this.state.error?.message || "An unexpected error occurred"}
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button onClick={this.handleRetry} className="gap-2">
									<RefreshCw className="w-4 h-4" />
									Try Again
								</Button>
								<Button
									onClick={this.handleGoHome}
									variant="outline"
									className="gap-2"
								>
									<Home className="w-4 h-4" />
									Go to Dashboard
								</Button>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
