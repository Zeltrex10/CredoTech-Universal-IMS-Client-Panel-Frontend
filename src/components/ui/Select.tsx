import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className = "", children, ...props }, ref) => {
		return (
			<select
				ref={ref}
				className={`block w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:ring-neutral-300 ${className}`}
				{...props}
			>
				{children}
			</select>
		);
	}
);

Select.displayName = "Select";

export { Select };
