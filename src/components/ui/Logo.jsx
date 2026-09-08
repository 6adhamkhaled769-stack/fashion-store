import { useState } from 'react'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { cn } from '@/utils/cn'

/**
 * Logo — يعرض صورة شعار المتجر إن وُجدت (logoUrl من إعدادات المتجر)،
 * وإلا يعرض اسم المتجر كشعار نصّي بخط العناوين. مع fallback آمن
 * في حال فشل تحميل صورة الشعار (لا صور مكسورة أبدًا).
 */
export default function Logo({ className, tone = 'dark' }) {
  const { name, logoUrl } = useStoreConfig()
  const [imgFailed, setImgFailed] = useState(false)

  if (logoUrl && !imgFailed) {
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setImgFailed(true)}
        className={cn('h-9 w-auto object-contain', className)}
      />
    )
  }

  return (
    <span
      className={cn(
        'font-[var(--font-heading)] text-2xl font-semibold tracking-tight',
        tone === 'light' ? 'text-[var(--color-primary-foreground)]' : 'text-[var(--color-text)]',
        className
      )}
    >
      {name}
    </span>
  )
}
