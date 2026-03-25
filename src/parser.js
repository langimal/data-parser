/**
 * parser.js
 *
 * This module provides functions for parsing data from various formats (e.g., CSV, JSON).
 */

/**
 * Parses CSV data into an array of objects.
 *
 * @param {string} csvData - The CSV data to parse.
 * @param {string} delimiter - The delimiter used in the CSV data (default: ',').
 * @returns {Array<object>} - An array of objects representing the parsed data.
 * @throws {Error} - If the CSV data is invalid or empty.
 */
export function parseCSV(csvData, delimiter = ',') {
  if (!csvData) {
    throw new Error('CSV data is empty.');
  }

  const lines = csvData.trim().split('\n');
  if (lines.length === 0) {
    return []; // Handle empty CSV data as an empty array
  }

  const headers = lines[0].split(delimiter).map(header => header.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(value => value.trim());
    if (values.length !== headers.length) {
      console.warn(`Skipping line ${i + 1} due to inconsistent number of columns.`);
      continue;
    }

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }
    data.push(obj);
  }

  return data;
}

/**
 * Parses JSON data into a JavaScript object.
 *
 * @param {string} jsonData - The JSON data to parse.
 * @returns {object} - The parsed JSON object.
 * @throws {Error} - If the JSON data is invalid.
 */
export function parseJSON(jsonData) {
  if (!jsonData) {
    throw new Error('JSON data is empty.');
  }

  try {
    return JSON.parse(jsonData);
  } catch (error) {
    throw new Error(`Invalid JSON data: ${error.message}`);
  }
}

/**
 * Parses a string representing a number, handling different locales and formats.
 *
 * @param {string} numberString - The string representation of the number.
 * @param {string} locale - The locale to use for parsing (e.g., 'en-US', 'de-DE'). Defaults to system locale.
 * @returns {number} - The parsed number, or NaN if parsing fails.
 */
export function parseNumber(numberString, locale = undefined) {
    if (!numberString) {
        return NaN;
    }

    try {
        // Use Number constructor for basic parsing (handles integers and simple floats)
        const num = Number(numberString);
        if (!isNaN(num)) {
            return num; // Return directly if Number constructor succeeds
        }

    // if Number constructor fails, try Intl.NumberFormat
    const numberFormat = new Intl.NumberFormat(locale);
    const parts = numberFormat.formatToParts(12345.678);

    const decimalSeparator = parts.find(part => part.type === 'decimal').value;
    const groupSeparator = parts.find(part => part.type === 'group').value;

    const cleanedNumberString = numberString
        .replace(new RegExp(`[${groupSeparator}]`, 'g'), '') // Remove group separators
        .replace(decimalSeparator, '.'); // Replace decimal separator with '.'

    const parsedNumber = Number(cleanedNumberString);
    return isNaN(parsedNumber) ? NaN : parsedNumber;

    } catch (error) {
        // If Intl.NumberFormat fails or parsing fails, return NaN
        return NaN;
    }
}