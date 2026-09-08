import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * SectionHeader — عنوان قسم موحّد في الصفحة الرئيسية (وأي صفحة أخرى
 * لاحقًا) مع رابط اختياري "عرض الكل". يُستخدم في: الأصناف، منتجات
 * مميزة، وصل حديثًا، الأكثر مبيعًا.
 */
export default function SectionHeader({ eyebrow, title, viewAllTo, viewAllLabel = 'عرض الكل' }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-secondary)]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">{title}</h2>
      </div>

      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)] sm:inline-flex"
        >
          {viewAllLabel}
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.6} />
        </Link>
      )}
    </div>
  )
}
