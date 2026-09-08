import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { heroSlide } from '@/lib/mockData'

/**
 * Hero — قسم الافتتاح في الصفحة الرئيسية. تخطيط تحريري (نص + صورة)
 * بدل بانر ممتلئ بالنص فوق الصورة، بما يتماشى مع هوية "بيت أزياء"
 * الهادئة للمشروع.
 *
 * TODO(PHASE 9): استبدال `heroSlide` من mockData ببيانات فعلية —
 * إما من جدول store_settings (بانر واحد قابل للتعديل) أو جدول
 * منفصل لاحقًا إن احتجنا أكثر من slide.
 */
export default function Hero() {
  const { eyebrow, title, subtitle, ctaPrimary, ctaSecondary, image } = heroSlide

  return (
    <section className="border-b border-[var(--color-border)]">
      <Container className="grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
        {/* النص */}
        <div className="order-2 lg:order-1">
          {eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)]">
              {eyebrow}
            </p>
          )}
          <h1 className="font-[var(--font-heading)] text-4xl font-semibold leading-[1.15] sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {ctaPrimary && (
              <Button as={Link} to={ctaPrimary.to} size="lg">
                {ctaPrimary.label}
              </Button>
            )}
            {ctaSecondary && (
              <Button as={Link} to={ctaSecondary.to} size="lg" variant="outline">
                {ctaSecondary.label}
              </Button>
            )}
          </div>
        </div>

        {/* الصورة */}
        <div className="order-1 lg:order-2">
          <ImageWithFallback
            src={image}
            alt={title}
            className="aspect-[4/5] w-full rounded-[var(--radius-lg)] sm:aspect-[16/11] lg:aspect-[4/5]"
          />
        </div>
      </Container>
    </section>
  )
}
