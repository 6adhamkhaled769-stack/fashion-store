import { cn } from '@/utils/cn'

/**
 * SizeSelector — شرائح المقاسات المتاحة لمنتج معيّن.
 */
export default function SizeSelector({ sizes, selected, onSelect }) {
  if (!sizes?.length) return null

  return (
    <div>
      <p className="mb-2 text-sm font-medium">المقاس</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            aria-pressed={selected === size}
            className={cn(
              'inline-flex h-10 min-w-10 items-center justify-center rounded-[3px] border px-3 text-sm font-medium transition-colors',
              selected === size
                ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
                : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
