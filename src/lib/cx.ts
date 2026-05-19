/**
 * Minimal, dependency-free className joiner. Shared leaf utility.
 * Filters falsy values so conditional class composition stays type-safe.
 */
export type ClassValue = string | false | null | undefined;

export const cx = (...values: readonly ClassValue[]): string =>
  values.filter((v): v is string => typeof v === 'string' && v.length > 0).join(' ');
