import { helper } from '@ember/component/helper';

/**
 * Compacts a number into a more readable format with suffixes like 'K' (thousands) or 'M' (millions).
 *
 * @param {number[]} positional - The positional arguments passed to the helper.
 * @param {number} positional[0] - The number to format.
 * @param {object} named - The named arguments passed to the helper.
 * @param {string} named.currency - The ISO currency code (e.g., 'EUR', 'USD').
 * @returns {string} The formatted number string with currency symbol.
 */

function formatCompactNumber([number], { currency = 'EUR' }) {
  if (typeof number !== 'number' || isNaN(number)) {
    return '';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  if (Math.abs(number) >= 1000000) {
    const value = number / 1000000;
    // Use Intl.NumberFormat to format the base number and then append 'M'
    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: value < 10 ? 1 : 0,
    }).format(value);
    const currencySymbol = formatter.formatToParts(0).find(p => p.type === 'currency').value;
    return `${formattedValue}M ${currencySymbol}`;
  }

  if (Math.abs(number) >= 1000) {
     const value = number / 1000;
    // Use Intl.NumberFormat to format the base number and then append 'K'
    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: value < 10 ? 1 : 0,
    }).format(value);
    const currencySymbol = formatter.formatToParts(0).find(p => p.type === 'currency').value;
    return `${formattedValue}K ${currencySymbol}`;
  }

  return formatter.format(number);
}

export default helper(formatCompactNumber);
