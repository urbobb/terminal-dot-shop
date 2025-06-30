export function formatPriceCompact(value, currency, locale = 'en-US') {
    // Ensure value is a number
    if (typeof value !== 'number') {
        console.error("Invalid input: 'value' must be a number.");
        return `${currency}N/A`;
    }

    // Use Intl.NumberFormat for basic formatting and decimal handling
    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1 // Default to 1 decimal place for compacted numbers
    });

    // Handle numbers less than 1000 directly
    if (value < 1000) {
        return `${currency}${formatter.format(value)}`;
    }

    // Handle thousands (K)
    if (value >= 1000 && value < 1000000) {
        const formattedValue = formatter.format(value / 1000);
        return `${currency}${formattedValue}K`;
    }

    // Handle millions (M)
    if (value >= 1000000) {
        const formattedValue = formatter.format(value / 1000000);
        return `${currency}${formattedValue}M`;
    }

    // Fallback for unexpected values
    return `${currency}${formatter.format(value)}`;
}
