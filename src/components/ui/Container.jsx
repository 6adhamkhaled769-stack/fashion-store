import { cn } from '@/utils/cn'

/**
 * Container — حاوية عرض موحّدة تضبط العرض الأقصى والـ padding الجانبي
 * المتجاوب. تُستخدم في كل قسم بدل تكرار نفس الكلاسات في كل صفحة.
 */
export default function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </Tag>
  )
}
