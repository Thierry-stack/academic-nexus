/** Escape string for safe use inside MongoDB `$regex` with user input. */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
