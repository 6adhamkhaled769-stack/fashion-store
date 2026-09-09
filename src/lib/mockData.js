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

export const mockNewArrivals = [
  {
    id: 'p-7',
    slug: 'satin-slip-dress',
    name: 'فستان ساتان انسيابي',
    category: 'فساتين',
    price: 1350,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/satin,dress,fashion?lock=401',
  },
  {
    id: 'p-8',
    slug: 'cropped-denim-jacket',
    name: 'جاكيت دنيم قصير',
    category: 'جاكيتات ومعاطف',
    price: 1180,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/denim,jacket,fashion?lock=402',
  },
  {
    id: 'p-9',
    slug: 'pleated-midi-skirt',
    name: 'تنورة ميدي مطوية',
    category: 'تنانير',
    price: 760,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/skirt,pleated,fashion?lock=403',
  },
  {
    id: 'p-10',
    slug: 'merino-turtleneck',
    name: 'بلوزة مرينو ياقة عالية',
    category: 'تريكو',
    price: 890,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/turtleneck,sweater,fashion?lock=404',
  },
  {
    id: 'p-11',
    slug: 'leather-ankle-boots',
    name: 'بوت جلد قصير',
    category: 'أحذية',
    price: 1650,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/leather,boots,fashion?lock=405',
  },
  {
    id: 'p-12',
    slug: 'gold-drop-earrings',
    name: 'حلق ذهبي معلّق',
    category: 'إكسسوارات',
    price: 340,
    oldPrice: null,
    isNew: true,
    inStock: true,
    image: 'https://loremflickr.com/700/875/earrings,jewelry,gold?lock=406',
  },
]

export const mockBestSellers = [
  {
    id: 'p-13',
    slug: 'classic-trench-coat',
    name: 'ترنش كلاسيك',
    category: 'جاكيتات ومعاطف',
    price: 2100,
    oldPrice: 2450,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/trenchcoat,fashion,studio?lock=501',
  },
  {
    id: 'p-14',
    slug: 'basic-cotton-tee',
    name: 'تيشيرت قطن أساسي',
    category: 'تيشيرتات',
    price: 320,
    oldPrice: null,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/tshirt,cotton,fashion?lock=502',
  },
  {
    id: 'p-15',
    slug: 'high-waist-jeans',
    name: 'جينز خصر عالي',
    category: 'بناطيل',
    price: 890,
    oldPrice: 1050,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/jeans,denim,fashion?lock=503',
  },
  {
    id: 'p-16',
    slug: 'floral-midi-dress',
    name: 'فستان ميدي مطبع',
    category: 'فساتين',
    price: 1240,
    oldPrice: null,
    isNew: false,
    inStock: false,
    image: 'https://loremflickr.com/700/875/floral,dress,fashion?lock=504',
  },
  {
    id: 'p-17',
    slug: 'canvas-sneakers',
    name: 'سنيكرز قماش',
    category: 'أحذية',
    price: 720,
    oldPrice: null,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/sneakers,canvas,fashion?lock=505',
  },
  {
    id: 'p-18',
    slug: 'leather-crossbody-bag',
    name: 'شنطة كروس جلد',
    category: 'إكسسوارات',
    price: 980,
    oldPrice: 1200,
    isNew: false,
    inStock: true,
    image: 'https://loremflickr.com/700/875/crossbody,bag,leather?lock=506',
  },
]

export const offerBanner = {
  eyebrow: 'لفترة محدودة',
  title: 'خصم حتى 30٪ على مختارات الموسم',
  subtitle: 'على تشكيلة مختارة من المعاطف والفساتين — قبل نفاد المقاسات.',
  ctaLabel: 'تسوّقي العروض',
  ctaTo: '/products?tag=sale',
  image: 'https://loremflickr.com/1400/1000/fashion,sale,studio?lock=601',
}

/**
 * heroContent — النص الثابت في يسار الـ Hero (لا يتغيّر مع تبديل
 * المنتج/اللون على اليمين، بنفس منطق الفيديو المرجعي).
 */
export const heroContent = {
  eyebrow: 'مجموعة الخريف الجديدة',
  title: 'أزياء تُصمَّم لتدوم',
  subtitle:
    'قطع يومية بجودة عالية وتفاصيل مدروسة — مختارة بعناية لخزانة ملابس تدوم لمواسم لا لموسم واحد.',
  ctaPrimary: { label: 'تسوّقي المجموعة', to: '/products' },
  ctaSecondary: { label: 'وصل حديثًا', to: '/products?sort=newest' },
}

/**
 * heroProductVariants — منتجات/ألوان الـ Hero التفاعلي. كل عنصر يحمل
 * لون الخامة الفعلي (swatchHex) الذي تُبنى منه خلفية القسم بالكامل
 * ديناميكيًا (عبر color-mix)، فيتزامن لون خلفية الـ Hero مع لون
 * المنتج المعروض تمامًا — بنفس فكرة الفيديو المرجعي، لكن بدرجة لونية
 * هادئة (tint خفيف) تحافظ على هوية "بيت الأزياء" الفاخرة بدل درجات
 * صارخة.
 *
 * TODO(PHASE 9): تُقرأ لاحقًا من منتجات مُميَّزة فعليًا (is_featured)
 * مع متغيّر اللون (product_variants.color_hex) بدل هذه البيانات.
 */
export const heroProductVariants = [
  {
    id: 'hero-1',
    slug: 'oversized-wool-coat',
    name: 'معطف صوف واسع',
    colorLabel: 'كحلي',
    swatchHex: '#1f2a3a',
    price: 2600,
    oldPrice: 3100,
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://loremflickr.com/900/1100/coat,navy,fashion?lock=701',
  },
  {
    id: 'hero-2',
    slug: 'linen-wrap-dress',
    name: 'فستان لينن ملفوف',
    colorLabel: 'كوجناك',
    swatchHex: '#b5652b',
    price: 1450,
    oldPrice: 1850,
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://loremflickr.com/900/1100/dress,rust,fashion?lock=702',
  },
  {
    id: 'hero-3',
    slug: 'ribbed-knit-top',
    name: 'بلوزة تريكو مضلعة',
    colorLabel: 'رملي',
    swatchHex: '#c9b28a',
    price: 690,
    oldPrice: null,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://loremflickr.com/900/1100/knit,beige,fashion?lock=703',
  },
  {
    id: 'hero-4',
    slug: 'classic-trench-coat',
    name: 'ترنش كلاسيك',
    colorLabel: 'زيتوني',
    swatchHex: '#3f4a37',
    price: 2100,
    oldPrice: 2450,
    sizes: ['S', 'M', 'L'],
    image: 'https://loremflickr.com/900/1100/trenchcoat,olive,fashion?lock=704',
  },
]
