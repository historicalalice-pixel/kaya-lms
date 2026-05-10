/**
 * Tiny class-name joiner. Filters falsy values, joins with spaces.
 * Avoids pulling in a dependency for what is essentially a one-liner.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
