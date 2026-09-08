import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * ImageWithFallback — غلاف موحّد لأي <img> في المشروع (منتجات، تصنيفات،
 * هيرو...). عند فشل تحميل الصورة (رابط معطوب/محذوف) يعرض placeholder
 * أنيقًا بدل صورة مكسورة، حتى تبقى الواجهة احترافية دائمًا مهما كان
 * مصدر الصور (Supabase Storage لاحقًا أو رابط خارجي).
 */
export default function ImageWithFallback({ src, alt = '', className, imgClassName, ...props }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-text-muted)]',
          className
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="size-6" strokeWidth={1.4} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden bg-[var(--color-surface)]', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', imgClassName)}
        {...props}
      />
    </div>
  )
}
