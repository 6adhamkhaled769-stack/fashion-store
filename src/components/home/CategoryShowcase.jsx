import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { mockCategories } from '@/lib/mockData'

/**
 * CategoryShowcase — شبكة أصناف رئيسية بصورة لكل صنف، تقود المستخدم
 * مباشرة لصفحة المنتجات مفلترة بالصنف (?category=slug).
 *
 * TODO(PHASE 9): استبدال mockCategories باستدعاء فعلي لجدول
 * `categories` (الأصناف النشطة فقط، مرتبة حسب ترتيب العرض).
 */
export default function CategoryShowcase() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="تسوّقي حسب" title="الأصناف" />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {mockCategories.map((category) => (
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
