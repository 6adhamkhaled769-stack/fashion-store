import { cn } from '@/utils/cn'

/**
 * IconButton — زر دائري بسيط لأيقونات الهيدر (بحث/مفضلة/سلة/حساب)
 * مع إمكانية عرض badge عددي أعلى الأيقونة.
 */
export default function IconButton({
  as: Tag = 'button',
  icon: Icon,
  label,
  count,
  className,
  ...props
}) {
  return (
    <Tag
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex size-10 items-center justify-center rounded-full text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]',
        className
      )}
      {...props}
    >
      <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
      {typeof count === 'number' && count > 0 && (
        <span
          className="absolute -top-0.5 -end-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-secondary)] px-1 text-[10px] font-semibold text-[var(--color-secondary-foreground)]"
          aria-hidden="true"
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Tag>
  )
}
