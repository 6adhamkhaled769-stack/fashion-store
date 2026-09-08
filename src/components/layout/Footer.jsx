import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Music2, Phone } from 'lucide-react'
import { useStoreConfig } from '@/context/StoreConfigContext'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons'

export default function Footer() {
  const { name, tagline, description, contact, social } = useStoreConfig()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    // TODO(PHASE 9+): ربط النشرة البريدية بخدمة فعلية (Supabase table أو مزوّد بريد).
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <Container className="py-14">
        {/* اسم العلامة الكبير — طابع "توقيع بيت أزياء" */}
        <div className="border-b border-[var(--color-border)] pb-10">
          <h2 className="font-[var(--font-heading)] text-4xl font-semibold sm:text-5xl">{name}</h2>
          {tagline && <p className="mt-2 text-[var(--color-text-muted)]">{tagline}</p>}
        </div>

        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* عن المتجر */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">عن المتجر</h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
              <li><Link to="/products" className="hover:text-[var(--color-text)]">كل المنتجات</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-[var(--color-text)]">وصل حديثًا</Link></li>
              <li><Link to="/products?tag=sale" className="hover:text-[var(--color-text)]">العروض</Link></li>
              <li><Link to="/orders" className="hover:text-[var(--color-text)]">تتبّع طلبي</Link></li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">تواصل معنا</h3>
            <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
              {contact?.phone && (
                <li>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-[var(--color-text)]">
                    <Phone className="size-4 shrink-0" strokeWidth={1.6} />
                    <bdi dir="ltr">{contact.phone}</bdi>
                  </a>
                </li>
              )}
              {contact?.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-[var(--color-text)]">
                    <Mail className="size-4 shrink-0" strokeWidth={1.6} />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" strokeWidth={1.6} />
                  {contact.address}
                </li>
              )}
            </ul>
            <div className="mt-4 flex items-center gap-3">
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="إنستغرام" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <InstagramIcon className="size-5" />
                </a>
              )}
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="فيسبوك" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <FacebookIcon className="size-5" />
                </a>
              )}
              {social?.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noreferrer" aria-label="تيك توك" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <Music2 className="size-5" strokeWidth={1.6} />
                </a>
              )}
            </div>
          </div>

          {/* النشرة البريدية */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">النشرة البريدية</h3>
            <p className="mb-3 text-sm text-[var(--color-text-muted)]">
              اشتركي لتصلك أحدث المجموعات والعروض أولًا بأول.
            </p>
            {subscribed ? (
              <p className="text-sm text-[var(--color-success)]">تم الاشتراك بنجاح، شكرًا لك.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="h-11 w-full min-w-0 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-secondary)]"
                />
                <Button type="submit" size="sm" variant="primary" className="shrink-0">
                  اشتراك
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} {name} — جميع الحقوق محفوظة</p>
          <p>الدفع عند الاستلام متاح لجميع الطلبات</p>
        </div>
      </Container>
    </footer>
  )
}
