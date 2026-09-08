import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X, MessageCircle, Music2, Phone } from 'lucide-react'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons'
import { cn } from '@/utils/cn'

/**
 * MobileMenu — قائمة منزلقة من جهة البداية (يمين في RTL) لعرض روابط
 * التنقل وبيانات التواصل على الشاشات الصغيرة. حركة واحدة فقط
 * (slide + fade للخلفية) بدل حركات متفرقة على كل عنصر.
 */
export default function MobileMenu({ isOpen, onClose, navLinks }) {
  const { contact, social } = useStoreConfig()

  // منع تمرير الصفحة خلف القائمة عند فتحها
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!isOpen}
    >
      {/* الخلفية المعتمة */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* لوحة القائمة */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-y-0 end-0 flex w-[85%] max-w-sm flex-col bg-[var(--color-bg)] shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <span className="font-[var(--font-heading)] text-lg font-semibold">القائمة</span>
          <button
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="inline-flex size-9 items-center justify-center rounded-full hover:bg-[var(--color-surface)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'rounded-[3px] px-3 py-3 text-base font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-surface)] text-[var(--color-text)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 border-t border-[var(--color-border)] p-4">
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Phone className="size-4" strokeWidth={1.6} />
              <bdi dir="ltr">{contact.phone}</bdi>
            </a>
          )}
          <div className="flex items-center gap-4">
            {contact?.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" aria-label="واتساب">
                <MessageCircle className="size-5" strokeWidth={1.6} />
              </a>
            )}
            {social?.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="إنستغرام">
                <InstagramIcon className="size-5" />
              </a>
            )}
            {social?.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="فيسبوك">
                <FacebookIcon className="size-5" />
              </a>
            )}
            {social?.tiktok && (
              <a href={social.tiktok} target="_blank" rel="noreferrer" aria-label="تيك توك">
                <Music2 className="size-5" strokeWidth={1.6} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
