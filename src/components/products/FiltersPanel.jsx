import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { cn } from '@/utils/cn'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/**
 * FiltersPanel — فلترة السعر والمقاس. تُطبَّق فقط عند الضغط على
 * "تطبيق الفلاتر" (مش على كل حركة إدخال) لتقليل عدد الطلبات، وتُحدّث
 * ?minPrice / ?maxPrice / ?sizes في الرابط عبر onApply الممرَّر من
 * الصفحة الأم.
 */
export default function FiltersPanel({ initialMinPrice, initialMaxPrice, initialSizes, onApply }) {
  const { currency } = useStoreConfig()
  const [isOpen, setIsOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(initialMinPrice ?? '')
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ?? '')
  const [sizes, setSizes] = useState(initialSizes ?? [])

  const activeCount = (initialMinPrice ? 1 : 0) + (initialMaxPrice ? 1 : 0) + (initialSizes?.length ? 1 : 0)

  function toggleSize(size) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  function handleApply() {
    onApply({
      minPrice: minPrice === '' ? null : Number(minPrice),
      maxPrice: maxPrice === '' ? null : Number(maxPrice),
      sizes,
    })
    setIsOpen(false)
  }

  function handleClear() {
    setMinPrice('')
    setMaxPrice('')
    setSizes([])
    onApply({ minPrice: null, maxPrice: null, sizes: [] })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button variant="outline" size="md" onClick={() => setIsOpen((v) => !v)} className="gap-2">
        <SlidersHorizontal className="size-4" strokeWidth={1.6} />
        فلاتر
        {activeCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[10px] font-semibold text-[var(--color-secondary-foreground)]">
            {activeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* خلفية إغلاق عند الضغط برّه اللوحة */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />

          <div className="absolute start-0 top-full z-50 mt-2 w-[min(90vw,340px)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">فلترة النتائج</h3>
              <button onClick={() => setIsOpen(false)} aria-label="إغلاق" className="text-[var(--color-text-muted)]">
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-5">
              <p className="mb-2.5 text-sm font-medium">السعر ({currency})</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="من"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 w-full min-w-0 rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]"
                />
                <span className="text-[var(--color-text-muted)]">—</span>
                <input
                  type="number"
                  min="0"
                  placeholder="إلى"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 w-full min-w-0 rounded-[3px] border border-[var(--color-border)] bg-transparent px-3 text-sm outline-none focus-visible:border-[var(--color-secondary)]"
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2.5 text-sm font-medium">المقاس</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={sizes.includes(size)}
                    className={cn(
                      'inline-flex h-9 min-w-9 items-center justify-center rounded-[3px] border px-2.5 text-xs font-medium transition-colors',
                      sizes.includes(size)
                        ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
                        : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={handleApply} className="flex-1">
                تطبيق الفلاتر
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                مسح
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
