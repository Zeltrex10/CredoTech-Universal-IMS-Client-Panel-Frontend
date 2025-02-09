export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-UG", {
		style: "currency",
		currency: "UGX",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};
