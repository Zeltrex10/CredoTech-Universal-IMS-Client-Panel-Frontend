import React from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface DateRangePickerProps {
	value?: DateRange;
	onChange?: (range: DateRange | undefined) => void;
	className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
	value,
	onChange,
	className = "",
}) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const popoverRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				!buttonRef.current?.contains(event.target as Node) &&
				!popoverRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formatDateRange = (range?: DateRange) => {
		if (!range?.from) {
			return "Select date range";
		}

		if (!range.to) {
			return format(range.from, "PPP");
		}

		return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
	};

	return (
		<div className={`relative inline-block ${className}`}>
			<button
				ref={buttonRef}
				type="button"
				className="inline-flex items-center justify-between w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:ring-neutral-300"
				onClick={() => setIsOpen(!isOpen)}
			>
				{formatDateRange(value)}
				<svg
					className="ml-2 h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clipRule="evenodd"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					ref={popoverRef}
					className="absolute z-50 mt-2 rounded-md border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
				>
					<DayPicker
						mode="range"
						defaultMonth={value?.from}
						selected={value}
						onSelect={onChange}
						numberOfMonths={2}
					/>
				</div>
			)}
		</div>
	);
};

export { DateRangePicker };
