import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { offerBanner } from '@/lib/mockData'

/**
 * OfferBanner — بانر عروض بعرض كامل بين قسمي "وصل حديثًا" و"الأكثر
 * مبيعًا"، لكسر رتابة شبكات المنتجات المتكررة وجذب الانتباه للعروض.
 *
 * TODO(PHASE 9/15): استبدال offerBanner ببيانات فعلية — إما بانر
 * ثابت من store_settings أو مبني على كوبونات/عروض نشطة فعليًا.
 */
export default function OfferBanner() {
  const { eyebrow, title, subtitle, ctaLabel, ctaTo, image } = offerBanner

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-lg)]">
          <ImageWithFallback src={image} alt={title} className="aspect-[16/10] w-full sm:aspect-[21/9]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/85 via-[var(--color-primary)]/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-center sm:p-10 md:text-start">
            <div className="mx-auto max-w-lg md:mx-0">
              {eyebrow && (
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-primary-foreground)]/80">
                  {eyebrow}
                </p>
              )}
              <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-primary-foreground)] sm:text-3xl">
                {title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-primary-foreground)]/85 sm:text-base">
                {subtitle}
              </p>
              <Button as={Link} to={ctaTo} variant="secondary" size="lg" className="mt-6">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
