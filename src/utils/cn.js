import { clsx } from 'clsx'

/**
 * دمج classNames بشكل آمن، مع تجاهل القيم الفارغة/false/undefined.
 * مثال: cn('px-4', isActive && 'bg-primary', className)
 */
export function cn(...inputs) {
  return clsx(inputs)
}
