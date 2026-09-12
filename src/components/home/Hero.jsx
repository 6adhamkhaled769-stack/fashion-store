import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import HeroProductStage from '@/components/home/HeroProductStage'
import { heroContent } from '@/lib/mockData'
import { getHeroProducts } from '@/services/productsService'

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
 * منتجات الـ Hero (heroProductVariants سابقًا) تُجلَب فعليًا من
 * Supabase عبر getHeroProducts — PHASE 9B. نص الـ Hero التسويقي
 * (العنوان/الوصف/الأزرار) يبقى محتوى تحريريًا ثابتًا وليس بيانات
 * قابلة للتخصيص من لوحة التحكم حاليًا.
 */
export default function Hero() {
  const [heroProducts, setHeroProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getHeroProducts(4).then((res) => {
      if (!cancelled) {
        setHeroProducts(res)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const variant = heroProducts[activeIndex]
  const nextVariant = heroProducts[(activeIndex + 1) % heroProducts.length]

  useEffect(() => {
    if (isPaused || heroProducts.length < 2) return undefined
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroProducts.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [isPaused, heroProducts.length])

  function goPrev() {
    setActiveIndex((i) => (i - 1 + heroProducts.length) % heroProducts.length)
    setIsPaused(true)
  }
  function goNext() {
    setActiveIndex((i) => (i + 1) % heroProducts.length)
    setIsPaused(true)
  }

  const { eyebrow, title, subtitle, ctaPrimary, ctaSecondary } = heroContent

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="border-b border-[var(--color-border)] transition-colors duration-700 ease-out"
      style={{
        backgroundColor: variant
          ? `color-mix(in srgb, ${variant.swatchHex} 14%, var(--color-bg) 86%)`
          : 'var(--color-bg)',
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
          {heroProducts.length > 1 && (
            <div className="mt-9 hidden items-center gap-2.5 lg:flex">
              {heroProducts.map((v, i) => (
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
          )}
        </div>

        {/* المنتج التفاعلي */}
        <div className="order-1 lg:order-2">
          {!isLoading && variant && (
            <HeroProductStage
              variant={variant}
              nextVariant={nextVariant}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}
          {isLoading && (
            <div className="mx-auto aspect-[3/4] max-w-sm animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface)]" />
          )}
        </div>
      </Container>
    </section>
  )
}
