/**
 * بيانات تجريبية (Demo/Seed محلي) لواجهة المتجر.
 *
 * هذا الملف مؤقت فقط: الشكل (shape) هنا مطابق عمدًا لما سيرجع من
 * جداول `products` و `categories` و `product_images` في Supabase.
 * بدءًا من PHASE 9 (Connect Storefront to Supabase) سيتم استبدال
 * الاستيراد من هذا الملف باستدعاءات فعلية عبر services/productsService
 * و services/categoriesService — دون تغيير أي مكوّن يستهلك هذه البيانات.
 *
 * الصور صور مؤقتة (placeholder) من مصدر خارجي مجاني لأغراض العرض فقط،
 * وستُستبدل بصور حقيقية من Supabase Storage عند ربط كل متجر ببياناته.
 */

export const mockCategories = [
  {
    id: 'cat-1',
    slug: 'dresses',
    name: 'فساتين',
    image: 'https://loremflickr.com/600/750/dress,fashion?lock=101',
  },
  {
    id: 'cat-2',
    slug: 'outerwear',
    name: 'جاكيتات ومعاطف',
    image: 'https://loremflickr.com/600/750/coat,fashion?lock=102',
  },
  {
    id: 'cat-3',
    slug: 'knitwear',
    name: 'تريكو',
    image: 'https://loremflickr.com/600/750/knitwear,sweater?lock=103',
  },
  {
    id: 'cat-4',
    slug: 'accessories',
    name: 'إكسسوارات',
    image: 'https://loremflickr.com/600/750/handbag,accessories?lock=104',
  },
]

export const mockFeaturedProducts = [
  {
    id: 'p-1',
    slug: 'linen-wrap-dress',
    name: 'فستان لينن ملفوف',
    category: 'فساتين',
    price: 1450,
    oldPrice: 1850,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/dress,linen,woman?lock=201',
  },
  {
    id: 'p-2',
    slug: 'oversized-wool-coat',
    name: 'معطف صوف واسع',
    category: 'جاكيتات ومعاطف',
    price: 2600,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/coat,wool,woman?lock=202',
  },
  {
    id: 'p-3',
    slug: 'ribbed-knit-top',
    name: 'بلوزة تريكو مضلعة',
    category: 'تريكو',
    price: 690,
    oldPrice: 890,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/knit,top,fashion?lock=203',
  },
  {
    id: 'p-4',
    slug: 'tailored-wide-trousers',
    name: 'بنطلون واسع كلاسيك',
    category: 'بناطيل',
    price: 980,
    oldPrice: null,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/trousers,fashion,studio?lock=204',
  },
  {
    id: 'p-5',
    slug: 'silk-blend-scarf',
    name: 'وشاح حرير مخلوط',
    category: 'إكسسوارات',
    price: 420,
    oldPrice: null,
    isNew: true,
    inStock: false,
    image: 'https://loremflickr.com/700/875/scarf,silk,fashion?lock=205',
  },
  {
    id: 'p-6',
    slug: 'structured-tote-bag',
    name: 'شنطة توتي مهيكلة',
    category: 'إكسسوارات',
    price: 1120,
    oldPrice: 1400,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/handbag,tote,leather?lock=206',
  },
]

export const heroSlide = {
  eyebrow: 'مجموعة الخريف الجديدة',
  title: 'أزياء تُصمَّم لتدوم',
  subtitle:
    'قطع يومية بجودة عالية وتفاصيل مدروسة — مختارة بعناية لخزانة ملابس تدوم لمواسم لا لموسم واحد.',
  ctaPrimary: { label: 'تسوّقي المجموعة', to: '/products' },
  ctaSecondary: { label: 'وصل حديثًا', to: '/products?sort=newest' },
  image: 'https://loremflickr.com/1600/2000/fashion,model,editorial?lock=301',
}
