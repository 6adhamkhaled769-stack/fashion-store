import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { getCategories } from '@/services/productsService'

function SkeletonTile() {
  return <div className="aspect-[3/4] w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface)]" />
}

/**
 * CategoryShowcase — شبكة أصناف رئيسية بصورة لكل صنف، تقود المستخدم
 * مباشرة لصفحة المنتجات مفلترة بالصنف (?category=slug).
 *
 * يجلب الأصناف فعليًا من جدول `categories` في Supabase (PHASE 9B).
 * يختفي القسم بالكامل لو لم يُضِف الأدمن أي صنف بعد، بدل عرض شبكة فارغة.
 */
export default function CategoryShowcase() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getCategories().then((cats) => {
      if (!cancelled) {
        setCategories(cats)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!isLoading && categories.length === 0) return null

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="تسوّقي حسب" title="الأصناف" />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonTile key={i} />)
            : categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-md)]"
                >
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 start-4 font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary-foreground)] sm:text-xl">
                    {category.name}
                  </span>
                </Link>
              ))}
        </div>
      </Container>
    </section>
  )
}
