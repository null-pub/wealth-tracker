/**
 * Returns a color string representing the probability level
 *
 * @param {number} [probability] - A probability value between 0 and 1
 * @returns {string} A CSS color based on the probability thresholds:
 *   - >= 0.5: 'green'
 *   - >= 0.25: 'orange'
 *   - < 0.25: 'rgb(244, 67, 54)'
 *   - undefined or zero: 'inherit'
 *
 * @example
 * getProbablityColor(0.6); // 'green'
 */
export const getProbablityColor = (probability?: number) => {
  if (!probability) {
    return "inherit";
  }
  if (probability >= 0.5) {
    return "green";
  }
  if (probability >= 0.25) {
    return "orange";
  }
  return "rgb(244, 67, 54)";
};
