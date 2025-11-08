// General utility functions
/**
 * Format a tutor's name for display
 */
export function formatTutorName(name) {
    return name.trim();
}
/**
 * Format currency for display
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}
/**
 * Generate a slug from a string
 */
export function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/**
 * Check if a string is empty or whitespace
 */
export function isEmpty(str) {
    return !str || str.trim().length === 0;
}
/**
 * Truncate text to specified length
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength).trim() + '...';
}
// Re-export password utilities
export * from './password';
//# sourceMappingURL=index.js.map