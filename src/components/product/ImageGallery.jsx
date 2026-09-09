import { useState } from 'react'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { cn } from '@/utils/cn'

/**
 * ImageGallery — صورة رئيسية + شريط صور مصغّرة (thumbnails). يعيد
 * ضبط الصورة النشطة تلقائيًا عند تغيّر المنتج (مفتاح React بالخارج
 * كفيل بذلك، لكن نتحوّط هنا أيضًا بإعادة تعيين عند تغيّر عدد الصور).
 */
export default function ImageGallery({ images = [], alt }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images.length ? images : [null]
  const active = safeImages[Math.min(activeIndex, safeImages.length - 1)]

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {safeImages.length > 1 && (
        <div className="flex gap-2.5 sm:w-20 sm:flex-col">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`صورة ${i + 1}`}
              aria-current={i === activeIndex}
              className={cn(
                'shrink-0 overflow-hidden rounded-[var(--radius-sm)] border transition-colors',
                i === activeIndex
                  ? 'border-[var(--color-text)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-text)]/50'
              )}
            >
              <ImageWithFallback src={img} alt={`${alt} — صورة ${i + 1}`} className="size-16 sm:size-20" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1">
        <ImageWithFallback
          src={active}
          alt={alt}
          className="aspect-[4/5] w-full rounded-[var(--radius-md)]"
        />
      </div>
    </div>
  )
}
