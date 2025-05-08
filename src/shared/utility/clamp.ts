/**
 * Constrains a number within a minimum and maximum range
 *
 * @param {number} min - The minimum allowed value
 * @param {number} value - The value to clamp
 * @param {number} max - The maximum allowed value
 * @returns {number} The clamped value between min and max
 * @example
 * clamp(0, -5, 10); // returns 0
 * clamp(0, 15, 10); // returns 10
 * clamp(0, 5, 10); // returns 5
 */
export const clamp = (min: number, value: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};
