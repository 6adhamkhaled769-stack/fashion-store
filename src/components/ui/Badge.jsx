import { cn } from '@/utils/cn'

const TONES = {
  accent: 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]',
  dark: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
  muted: 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
  danger: 'bg-[var(--color-danger)] text-white',
  success: 'bg-[var(--color-success)] text-white',
}

/**
 * Badge — وسم صغير (خصم %، جديد، نفدت الكمية...).
 * سيُستخدم بكثافة في كروت المنتجات ابتداءً من PHASE 4/5.
 */
export default function Badge({ tone = 'dark', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[3px] px-2 py-1 text-xs font-medium leading-none',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
