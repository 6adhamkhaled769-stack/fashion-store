import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

const VARIANTS = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 border border-[var(--color-primary)]',
  secondary:
    'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:opacity-90 border border-[var(--color-secondary)]',
  outline:
    'bg-transparent text-[var(--color-text)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]',
  ghost:
    'bg-transparent text-[var(--color-text)] border border-transparent hover:bg-[var(--color-surface)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:opacity-90 border border-[var(--color-danger)]',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-[52px] px-7 text-base gap-2',
}

/**
 * Button — يقبل `as` لعرضه كـ <Link> من react-router أو <a> عند الحاجة.
 * مثال: <Button as={Link} to="/products">تسوّق الآن</Button>
 */
export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      disabled={Tag === 'button' ? disabled || isLoading : undefined}
      aria-disabled={disabled || isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-[3px] font-medium tracking-wide transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </Tag>
  )
}
