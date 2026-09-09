import { Minus, Plus } from 'lucide-react'

/**
 * QuantitySelector — عدّاد كمية بحدّ أقصى للمخزون المتاح.
 */
export default function QuantitySelector({ value, onChange, max = 10 }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">الكمية</p>
      <div className="inline-flex items-center rounded-[3px] border border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label="تقليل الكمية"
          className="inline-flex size-10 items-center justify-center text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] disabled:opacity-30"
        >
          <Minus className="size-4" strokeWidth={1.8} />
        </button>
        <span className="inline-flex w-10 items-center justify-center text-sm font-medium tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="زيادة الكمية"
          className="inline-flex size-10 items-center justify-center text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] disabled:opacity-30"
        >
          <Plus className="size-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
