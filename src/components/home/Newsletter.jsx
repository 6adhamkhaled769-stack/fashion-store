import { useState } from 'react'
import { Mail } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

/**
 * Newsletter — شريط اشتراك بارز بعرض كامل في نهاية الصفحة الرئيسية،
 * بخلفية داكنة (Ink) تمايزًا عن نموذج الاشتراك الصغير في الفوتر —
 * هذا الشريط يظهر مرة واحدة فقط لمن يزور الرئيسية، بينما نموذج
 * الفوتر يبقى متاحًا في كل صفحة.
 *
 * TODO(PHASE 9+): ربط الاشتراك فعليًا (جدول newsletter_subscribers
 * في Supabase أو مزوّد بريد خارجي).
 */
export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="bg-[var(--color-primary)] py-16 sm:py-20">
      <Container className="flex flex-col items-center text-center">
        <div className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-primary-foreground)]/10">
          <Mail className="size-5 text-[var(--color-primary-foreground)]" strokeWidth={1.6} />
        </div>

        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-primary-foreground)] sm:text-3xl">
          كوني أول من يعرف
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--color-primary-foreground)]/75 sm:text-base">
          انضمي لقائمتنا البريدية لتصلك المجموعات الجديدة والعروض الحصرية قبل الجميع.
        </p>

        {subscribed ? (
          <p className="mt-7 text-sm font-medium text-[var(--color-primary-foreground)]">
            تم الاشتراك بنجاح — شكرًا لانضمامك إلينا.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="h-12 w-full min-w-0 rounded-[3px] border border-[var(--color-primary-foreground)]/25 bg-transparent px-4 text-sm text-[var(--color-primary-foreground)] outline-none placeholder:text-[var(--color-primary-foreground)]/50 focus-visible:border-[var(--color-primary-foreground)]/60"
            />
            <Button type="submit" variant="secondary" size="lg" className="shrink-0">
              اشتراك
            </Button>
          </form>
        )}
      </Container>
    </section>
  )
}
