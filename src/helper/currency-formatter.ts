export const formatCurrencyValue = (value: string) => {
	const formattedValue = parseFloat(value.replace(/[$.]/g, "")).toFixed(0);
	return isNaN(parseFloat(formattedValue)) ? "NaN" : formattedValue;
};

export const formatToIndonesianCurrency = (value: string) => {
	const parseInput = formatCurrencyValue(value);
	if (value === "") return "";
	else {
		if (parseInput !== "NaN") {
			const amount = parseFloat(parseInput).toLocaleString("id-ID");
			return amount;
		} else {
			return "";
		}
	}
};
