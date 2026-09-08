/**
 * أيقونات تواصل اجتماعي — رسومات SVG أصلية مبسّطة (وليست نسخًا حرفيًا
 * لأي شعار تجاري)، بنفس أسلوب lucide (stroke-based) حتى تتناسق بصريًا
 * مع باقي الأيقونات في المشروع. استُبدلت أيقونات lucide الخاصة
 * بالعلامات التجارية بعد إزالتها من المكتبة.
 */

export function InstagramIcon({ className, strokeWidth = 1.6, ...props }) {
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
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className, strokeWidth = 1.6, ...props }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M14 8.5h-1.5A1.5 1.5 0 0 0 11 10v1.5H9v2h2V18h2v-4.5h1.7l.3-2H13V10c0-.28.22-.5.5-.5H14z" fill="currentColor" stroke="none" />
    </svg>
  )
}
