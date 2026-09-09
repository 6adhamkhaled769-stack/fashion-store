import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

/**
 * CategoryTabs — شريط تصنيفات أفقي قابل للتمرير على الموبايل، يعكس
 * الصنف النشط من رابط الصفحة (?category=slug) عبر روابط حقيقية
 * (وليس أزرار JS فقط) حتى تبقى قابلة للمشاركة والفهرسة (SEO).
 */
export default function CategoryTabs({ categories, activeSlug }) {
  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:flex-wrap">
      <Link
        to="/products"
        className={cn(
          'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          !activeSlug
            ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
            : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
        )}
      >
        الكل
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          to={`/products?category=${cat.slug}`}
          className={cn(
            'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            activeSlug === cat.slug
              ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
              : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
