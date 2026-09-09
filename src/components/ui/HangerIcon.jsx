/**
 * HangerIcon — أيقونة شمّاعة أصلية مبسّطة (وليست نسخًا لأي شعار)،
 * بأسلوب stroke متناسق مع باقي أيقونات lucide في المشروع. تُستخدم
 * فوق صورة المنتج في الـ Hero التفاعلي لإيحاء "قطعة معلّقة" حقيقية.
 */
export default function HangerIcon({ className, strokeWidth = 1.6, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="4.5" r="1.4" />
      <path d="M12 5.8v2.4" />
      <path d="M12 8.2c-.9 0-1.7.5-2.1 1.3L3.5 20c-.5 1 .2 2.2 1.4 2.2h14.2c1.2 0 1.9-1.2 1.4-2.2l-6.4-10.5c-.4-.8-1.2-1.3-2.1-1.3Z" />
      <path d="M5 18.5h14" />
    </svg>
  )
}
