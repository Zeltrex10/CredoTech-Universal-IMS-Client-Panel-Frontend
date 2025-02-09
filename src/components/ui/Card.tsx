import React from "react";

interface CardProps {
	children: React.ReactNode;
	className?: string;
}

interface CardHeaderProps {
	children: React.ReactNode;
	className?: string;
}

interface CardTitleProps {
	children: React.ReactNode;
	className?: string;
}

interface CardDescriptionProps {
	children: React.ReactNode;
	className?: string;
}

interface CardContentProps {
	children: React.ReactNode;
	className?: string;
}

type CardComponent = React.ForwardRefExoticComponent<
	CardProps & React.RefAttributes<HTMLDivElement>
> & {
	Header: React.ForwardRefExoticComponent<
		CardHeaderProps & React.RefAttributes<HTMLDivElement>
	>;
	Title: React.ForwardRefExoticComponent<
		CardTitleProps & React.RefAttributes<HTMLParagraphElement>
	>;
	Description: React.ForwardRefExoticComponent<
		CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>
	>;
	Content: React.ForwardRefExoticComponent<
		CardContentProps & React.RefAttributes<HTMLDivElement>
	>;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className = "", children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm ${className}`}
				{...props}
			>
				{children}
			</div>
		);
	}
) as CardComponent;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className = "", children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={`flex flex-col space-y-1.5 p-6 ${className}`}
				{...props}
			>
				{children}
			</div>
		);
	}
);

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
	({ className = "", children, ...props }, ref) => {
		return (
			<h3
				ref={ref}
				className={`text-lg font-semibold leading-none tracking-tight ${className}`}
				{...props}
			>
				{children}
			</h3>
		);
	}
);

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	CardDescriptionProps
>(({ className = "", children, ...props }, ref) => {
	return (
		<p
			ref={ref}
			className={`text-sm text-neutral-500 dark:text-neutral-400 ${className}`}
			{...props}
		>
			{children}
		</p>
	);
});

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ className = "", children, ...props }, ref) => {
		return (
			<div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
				{children}
			</div>
		);
	}
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";

// Attach subcomponents to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
