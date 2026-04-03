/**
 * Formatting Utilities for Allo Services CI
 * Handles prices, phone numbers, dates, and more
 */

/**
 * Format price in XOF (CFA Franc)
 */
export function formatPrice(amount: number, currency: string = "XOF"): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price without currency symbol
 */
export function formatPriceNumber(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price with currency code
 */
export function formatPriceWithCode(amount: number, currency: string = "XOF"): string {
  return `${formatPriceNumber(amount)} ${currency}`;
}

/**
 * Format Ivory Coast phone number
 * Input: 07XXXXXXXX or +22507XXXXXXXX
 * Output: +225 07 XX XX XX XX
 */
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Remove country code if present
  if (cleaned.startsWith("225")) {
    cleaned = cleaned.substring(3);
  }

  // Validate length (should be 10 digits for CI numbers)
  if (cleaned.length !== 10) {
    return phone; // Return original if not valid
  }

  // Format: +225 XX XX XX XX XX
  return `+225 ${cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}`;
}

/**
 * Format phone number for display (compact)
 */
export function formatPhoneNumberCompact(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("225")) {
    cleaned = cleaned.substring(3);
  }

  if (cleaned.length !== 10) {
    return phone;
  }

  // Format: XX XX XX XX XX
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
}

/**
 * Parse phone number to international format
 */
export function parsePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("225")) {
    cleaned = cleaned.substring(3);
  }

  if (cleaned.length !== 10) {
    throw new Error("Invalid phone number format");
  }

  return `+225${cleaned}`;
}

/**
 * Validate Ivory Coast phone number
 */
export function isValidCIPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");

  // Check with or without country code
  if (cleaned.length === 10) {
    // Valid prefixes for CI: 01, 02, 03, 04, 05, 07, 08
    const validPrefixes = ["01", "02", "03", "04", "05", "07", "08"];
    return validPrefixes.some((prefix) => cleaned.startsWith(prefix));
  }

  if (cleaned.length === 13 && cleaned.startsWith("225")) {
    const number = cleaned.substring(3);
    const validPrefixes = ["01", "02", "03", "04", "05", "07", "08"];
    return validPrefixes.some((prefix) => number.startsWith(prefix));
  }

  return false;
}

/**
 * Get operator from phone number
 */
export function getPhoneOperator(phone: string): string | null {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("225")) {
    cleaned = cleaned.substring(3);
  }

  if (cleaned.length < 2) return null;

  const prefix = cleaned.substring(0, 2);

  // Ivory Coast operator prefixes
  const operators: Record<string, string> = {
    "07": "Orange",
    "08": "MTN",
    "01": "Moov",
    "02": "Moov",
    "05": "Orange",
    "03": "MTN",
    "04": "Moov",
  };

  return operators[prefix] || null;
}

/**
 * Format date for display (French format)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Format date short (DD/MM/YYYY)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format relative time (e.g., "il y a 2 heures")
 */
export function formatRelativeTime(date: Date | string): string {
  return getRelativeTime(date);
}

/**
 * Get relative time string (alias for formatRelativeTime)
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

  if (diffMonths > 0) {
    return rtf.format(-diffMonths, "month");
  }
  if (diffWeeks > 0) {
    return rtf.format(-diffWeeks, "week");
  }
  if (diffDays > 0) {
    return rtf.format(-diffDays, "day");
  }
  if (diffHours > 0) {
    return rtf.format(-diffHours, "hour");
  }
  if (diffMinutes > 0) {
    return rtf.format(-diffMinutes, "minute");
  }

  return "À l'instant";
}

/**
 * Format rating with stars
 */
export function formatRating(rating: number, maxRating: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  let result = "★".repeat(fullStars);
  if (hasHalfStar) result += "½";
  result += "☆".repeat(emptyStars);

  return result;
}

/**
 * Format rating as number with one decimal
 */
export function formatRatingNumber(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format name (proper case)
 */
export function formatName(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Slugify text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format address for display
 */
export function formatAddress(address: string, city: string): string {
  return `${address}, ${city}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 o";

  const units = ["o", "Ko", "Mo", "Go"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Format duration in hours
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}
