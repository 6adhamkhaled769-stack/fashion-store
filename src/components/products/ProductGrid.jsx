import { PackageSearch } from 'lucide-react'
import ProductCard from '@/components/home/ProductCard'

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-[var(--radius-sm)] bg-[var(--color-surface)]" />
      <div className="mt-3.5 space-y-2">
        <div className="h-3 w-1/3 rounded bg-[var(--color-surface)]" />
        <div className="h-3.5 w-2/3 rounded bg-[var(--color-surface)]" />
        <div className="h-3.5 w-1/4 rounded bg-[var(--color-surface)]" />
      </div>
    </div>
  )
}

/**
 * ProductGrid — يعرض شبكة المنتجات مع الحالات الثلاث المطلوبة في كل
 * صفحة تعتمد على بيانات غير متزامنة: Loading (skeleton)، Empty، أو
 * المحتوى الفعلي. يُستخدم في /products وسيُعاد استخدامه لاحقًا في
 * نتائج البحث والمنتجات ذات الصلة.
 */
export default function ProductGrid({ items, isLoading, skeletonCount = 8 }) {
  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <PackageSearch className="size-10 text-[var(--color-text-muted)]" strokeWidth={1.4} />
        <p className="font-medium text-[var(--color-text)]">لا توجد منتجات</p>
        <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
          لم نجد منتجات مطابقة لهذا الفلتر أو البحث. جرّبي تغيير الصنف أو كلمة البحث.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
