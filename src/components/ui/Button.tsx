import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950",
	{
		variants: {
			variant: {
				default:
					"bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 dark:text-neutral-50",
				destructive:
					"bg-error-600 text-white hover:bg-error-700 dark:bg-error-700 dark:hover:bg-error-600 dark:text-neutral-50",
				success:
					"bg-success-600 text-white hover:bg-success-700 dark:bg-success-700 dark:hover:bg-success-600 dark:text-neutral-50",
				warning:
					"bg-warning-600 text-white hover:bg-warning-700 dark:bg-warning-700 dark:hover:bg-warning-600 dark:text-neutral-50",
				outline:
					"border border-neutral-300 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200",
				secondary:
					"bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600",
				ghost:
					"hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
				link: "text-primary-600 underline-offset-4 hover:underline dark:text-primary-400",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-8 px-3 text-xs",
				lg: "h-12 px-8 text-base",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, isLoading, children, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isLoading}
				{...props}
			>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{children}
			</button>
		);
	}
);
