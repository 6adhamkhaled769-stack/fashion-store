import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import HeroProductStage from '@/components/home/HeroProductStage'
import { heroContent, heroProductVariants } from '@/lib/mockData'

const AUTOPLAY_MS = 5000

/**
 * Hero — قسم الافتتاح في الصفحة الرئيسية.
 *
 * تفاعلي: خلفية القسم بالكامل تتزامن لونيًا مع لون المنتج المعروض
 * على اليمين (عبر color-mix بلون الخامة الفعلي بنسبة خفيفة فوق لون
 * خلفية المتجر)، مستوحى من نمط "hero بخلفية متحركة حسب لون المنتج"،
 * لكن بدرجات هادئة (tint) تحافظ على هوية المتجر الفاخرة بدل ألوان
 * صارخة. يتبدّل تلقائيًا كل 5 ثوانٍ، ويتوقف التبديل التلقائي عند أي
 * تفاعل يدوي من الزائر أو عند تمرير الماوس فوقه.
 *
 * TODO(PHASE 9): استبدال heroProductVariants من mockData بمنتجات
 * مُميَّزة فعلية (مع متغيّر لون) من Supabase.
 */
export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const variant = heroProductVariants[activeIndex]
  const nextVariant = heroProductVariants[(activeIndex + 1) % heroProductVariants.length]

  useEffect(() => {
    if (isPaused) return undefined
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroProductVariants.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [isPaused])

  function goPrev() {
    setActiveIndex((i) => (i - 1 + heroProductVariants.length) % heroProductVariants.length)
    setIsPaused(true)
  }
  function goNext() {
    setActiveIndex((i) => (i + 1) % heroProductVariants.length)
    setIsPaused(true)
  }

  const { eyebrow, title, subtitle, ctaPrimary, ctaSecondary } = heroContent

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="border-b border-[var(--color-border)] transition-colors duration-700 ease-out"
      style={{
        backgroundColor: `color-mix(in srgb, ${variant.swatchHex} 14%, var(--color-bg) 86%)`,
      }}
    >
      <Container className="grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
        {/* النص — ثابت، لا يتغيّر مع تبديل المنتج */}
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

          {/* مؤشرات الألوان/المنتجات */}
          <div className="mt-9 hidden items-center gap-2.5 lg:flex">
            {heroProductVariants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setActiveIndex(i)
                  setIsPaused(true)
                }}
                aria-label={v.colorLabel}
                aria-pressed={i === activeIndex}
                className="group flex items-center gap-1.5"
              >
                <span
                  className="size-3 rounded-full ring-1 ring-[var(--color-text)]/15 ring-offset-2 ring-offset-[transparent] transition-all"
                  style={{
                    backgroundColor: v.swatchHex,
                    outline: i === activeIndex ? `2px solid ${v.swatchHex}` : 'none',
                    outlineOffset: 2,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* المنتج التفاعلي */}
        <div className="order-1 lg:order-2">
          <HeroProductStage
            variant={variant}
            nextVariant={nextVariant}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>
      </Container>
    </section>
  )
}
