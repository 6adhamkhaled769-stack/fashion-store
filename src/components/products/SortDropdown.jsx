import { ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'bestselling', label: 'الأكثر مبيعًا' },
  { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
]

/**
 * SortDropdown — قائمة ترتيب بسيطة (native <select> لأفضل تجربة على
 * الموبايل)، تُحدّث ?sort= في الرابط عبر onChange الممرَّر من الأب.
 */
export default function SortDropdown({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <ArrowUpDown className="size-4 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.6} />
      <span className="hidden sm:inline">ترتيب حسب:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-sm outline-none focus-visible:border-[var(--color-secondary)]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
