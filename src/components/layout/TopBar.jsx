import { MessageCircle, Music2 } from 'lucide-react'
import { useStoreConfig } from '@/context/StoreConfigContext'
import Container from '@/components/ui/Container'
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons'

/**
 * TopBar — شريط علوي رفيع بلون Ink، يعرض إعلان المتجر (شحن/عروض)
 * وروابط التواصل الاجتماعي. كل النصوص والروابط تأتي من storeConfig
 * وليست ثابتة، لتناسب أي متجر يُبنى على هذا القالب.
 */
export default function TopBar() {
  const { announcement, contact, social } = useStoreConfig()

  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs">
        <p className="truncate">{announcement}</p>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              aria-label="تواصل عبر واتساب"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <MessageCircle className="size-4" strokeWidth={1.6} />
            </a>
          )}
          {social?.instagram && (
            <a
              href={social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="إنستغرام"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <InstagramIcon className="size-4" />
            </a>
          )}
          {social?.facebook && (
            <a
              href={social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="فيسبوك"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FacebookIcon className="size-4" />
            </a>
          )}
          {social?.tiktok && (
            <a
              href={social.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="تيك توك"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <Music2 className="size-4" strokeWidth={1.6} />
            </a>
          )}
        </div>
      </Container>
    </div>
  )
}
