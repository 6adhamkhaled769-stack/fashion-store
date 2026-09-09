import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStoreConfig } from '@/context/StoreConfigContext'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import HangerIcon from '@/components/ui/HangerIcon'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

/**
 * HeroProductStage — الجزء التفاعلي من الـ Hero: منتج معلّق على
 * شمّاعة، ألوان/أصناف تتبدّل بالأسهم، مقاسات قابلة للاختيار (بصريًا
 * الآن، ستُفعَّل فعليًا في PHASE 6)، وسعر يتحدّث مع كل تبديل.
 *
 * الألوان الفعلية للخامة (swatchHex) هي ما يقود لون خلفية قسم الـ
 * Hero بالكامل من المكوّن الأب (Hero.jsx)، فيتزامن التبديل هنا مع
 * تغيّر الخلفية.
 */
export default function HeroProductStage({ variant, nextVariant, onPrev, onNext }) {
  const { currency } = useStoreConfig()
  const [selectedSize, setSelectedSize] = useState(variant.sizes[0])

  function handlePrev() {
    onPrev()
    setSelectedSize(null)
  }
  function handleNext() {
    onNext()
    setSelectedSize(null)
  }

  return (
    <div className="relative">
      {/* المنتج المعلّق */}
      <div className="relative mx-auto max-w-sm">
        <HangerIcon className="mx-auto size-7 text-[var(--color-text)]/70" />

        <div key={variant.id} className="animate-[fadeIn_0.5s_ease-out]">
          <ImageWithFallback
            src={variant.image}
            alt={variant.name}
            className="aspect-[4/5] w-full rounded-[var(--radius-md)]"
          />
        </div>

        {/* ظل عائم */}
        <div
          className="mx-auto -mt-4 h-6 w-3/4 rounded-full bg-[var(--color-text)]/15 blur-md"
          aria-hidden="true"
        />
      </div>

      {/* لوحة السعر والمقاسات */}
      <div className="mt-6 flex flex-col items-center gap-4 text-center">
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">{variant.colorLabel} — {variant.name}</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-xl font-semibold text-[var(--color-text)]">
              {formatPrice(variant.price, currency)}
            </span>
            {variant.oldPrice && (
              <span className="text-sm text-[var(--color-text-muted)] line-through">
                {formatPrice(variant.oldPrice, currency)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {variant.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                selectedSize === size
                  ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
                  : 'border-[var(--color-text)]/25 text-[var(--color-text)] hover:border-[var(--color-text)]'
              )}
            >
              {size}
            </button>
          ))}
        </div>

        <Button as={Link} to={`/products/${variant.slug}`} variant="outline" size="sm">
          عرض المنتج
        </Button>
      </div>

      {/* أسهم التنقل */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="المنتج السابق"
        className="absolute start-0 top-[38%] inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-bg)]/80 text-[var(--color-text)] shadow-sm backdrop-blur transition-colors hover:bg-[var(--color-bg)]"
      >
        <ChevronRight className="size-5" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        onClick={handleNext}
        aria-label="المنتج التالي"
        className="absolute end-0 top-[38%] inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-bg)]/80 text-[var(--color-text)] shadow-sm backdrop-blur transition-colors hover:bg-[var(--color-bg)]"
      >
        <ChevronLeft className="size-5" strokeWidth={1.6} />
      </button>

      {/* معاينة المنتج التالي */}
      {nextVariant && (
        <button
          type="button"
          onClick={handleNext}
          aria-label={`عرض ${nextVariant.name}`}
          className="absolute -bottom-4 start-0 hidden items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-bg)]/85 p-2 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 sm:flex"
        >
          <ImageWithFallback
            src={nextVariant.image}
            alt={nextVariant.name}
            className="size-12 rounded-[var(--radius-sm)]"
          />
          <span className="pe-2 text-xs text-[var(--color-text-muted)]">التالي</span>
        </button>
      )}
    </div>
  )
}
