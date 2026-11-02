/**
 * The stats bar. A null value shows as "X" with a Placeholder tag.
 * TODO(Victor): replace each null with the real number. It then counts up on scroll, and the tag disappears.
 */
export const stats: { label: string; value: number | null }[] = [
  { label: 'Businesses Served', value: null },
  { label: 'Leads Captured', value: null },
  { label: 'Google Reviews Generated', value: null },
]

export const statsCopy = {
  ariaLabel: 'Our numbers',
  placeholder: 'Placeholder',
}
