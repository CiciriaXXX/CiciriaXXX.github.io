// Minimal className combiner used for conditional Tailwind class strings.
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
