/**
 * Central category definitions
 * Used by:
 * - Sellers
 * - Products
 * - Catalog pages
 * - Filters
 * - URLs
 *
 * IMPORTANT:
 * Values must match DB values exactly
 */

export const CATEGORIES = [
    { value: 'wood', label: 'Wood' },
    { value: 'home', label: 'Home' },
    { value: 'crochet-knitted', label: 'Crochet & Knitted' },
    { value: 'christmas', label: 'Christmas' },
    { value: 'art', label: 'Art' },
  ] as const;
  
  /**
   * Union type of allowed category values
   * e.g. "wood" | "home" | "crochet-knitted" | ...
   */
  export type CategoryValue = (typeof CATEGORIES)[number]['value'];
  
  /**
   * Get the display label from a stored value
   * Safe fallback if something unexpected appears
   */
  export function getCategoryLabel(value: string): string {
    return (
      CATEGORIES.find((c) => c.value === value)?.label ??
      value.replace('-', ' ')
    );
  }
  
  /**
   * Validate category values (useful in actions)
   */
  export function isValidCategory(value: string): value is CategoryValue {
    return CATEGORIES.some((c) => c.value === value);
  }
  
  