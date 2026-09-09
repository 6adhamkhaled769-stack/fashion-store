/**
 * كتالوج تجريبي كامل لصفحة /products — منفصل عمدًا عن بيانات
 * الصفحة الرئيسية (mockData.js) حتى لا نلمس أقسام معتمدة سابقًا.
 *
 * TODO(PHASE 9): يُستبدل بالكامل باستدعاءات فعلية لجداول `products`
 * و `categories` في Supabase عبر services/productsService.js (نفس
 * الواجهة/الشكل، فقط مصدر البيانات يتغيّر).
 */

export const productCategories = [
  { slug: 'dresses', name: 'فساتين' },
  { slug: 'outerwear', name: 'جاكيتات ومعاطف' },
  { slug: 'knitwear', name: 'تريكو' },
  { slug: 'trousers', name: 'بناطيل' },
  { slug: 'shoes', name: 'أحذية' },
  { slug: 'accessories', name: 'إكسسوارات' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const mockCatalogProducts = [
  { id: 'c-1', slug: 'linen-wrap-dress', name: 'فستان لينن ملفوف', categorySlug: 'dresses', category: 'فساتين', price: 1450, oldPrice: 1850, isNew: false, inStock: true, sizes: ['XS', 'S', 'M', 'L'], createdAt: '2026-08-20', salesCount: 142, image: 'https://loremflickr.com/700/875/dress,linen,woman?lock=801' },
  { id: 'c-2', slug: 'satin-slip-dress', name: 'فستان ساتان انسيابي', categorySlug: 'dresses', category: 'فساتين', price: 1350, oldPrice: null, isNew: true, inStock: true, sizes: ['S', 'M', 'L'], createdAt: '2026-09-02', salesCount: 38, image: 'https://loremflickr.com/700/875/satin,dress,fashion?lock=802' },
  { id: 'c-3', slug: 'floral-midi-dress', name: 'فستان ميدي مطبع', categorySlug: 'dresses', category: 'فساتين', price: 1240, oldPrice: null, isNew: false, inStock: false, sizes: ['S', 'M', 'L', 'XL'], createdAt: '2026-07-11', salesCount: 96, image: 'https://loremflickr.com/700/875/floral,dress,fashion?lock=803' },
  { id: 'c-4', slug: 'oversized-wool-coat', name: 'معطف صوف واسع', categorySlug: 'outerwear', category: 'جاكيتات ومعاطف', price: 2600, oldPrice: null, isNew: true, inStock: true, sizes: ['S', 'M', 'L', 'XL'], createdAt: '2026-08-28', salesCount: 61, image: 'https://loremflickr.com/700/875/coat,wool,woman?lock=804' },
  { id: 'c-5', slug: 'classic-trench-coat', name: 'ترنش كلاسيك', categorySlug: 'outerwear', category: 'جاكيتات ومعاطف', price: 2100, oldPrice: 2450, isNew: false, inStock: true, sizes: ['S', 'M', 'L'], createdAt: '2026-06-30', salesCount: 178, image: 'https://loremflickr.com/700/875/trenchcoat,fashion,studio?lock=805' },
  { id: 'c-6', slug: 'cropped-denim-jacket', name: 'جاكيت دنيم قصير', categorySlug: 'outerwear', category: 'جاكيتات ومعاطف', price: 1180, oldPrice: null, isNew: true, inStock: true, sizes: ['XS', 'S', 'M', 'L'], createdAt: '2026-09-01', salesCount: 22, image: 'https://loremflickr.com/700/875/denim,jacket,fashion?lock=806' },
  { id: 'c-7', slug: 'ribbed-knit-top', name: 'بلوزة تريكو مضلعة', categorySlug: 'knitwear', category: 'تريكو', price: 690, oldPrice: 890, isNew: false, inStock: true, sizes: SIZES, createdAt: '2026-07-25', salesCount: 205, image: 'https://loremflickr.com/700/875/knit,top,fashion?lock=807' },
  { id: 'c-8', slug: 'merino-turtleneck', name: 'بلوزة مرينو ياقة عالية', categorySlug: 'knitwear', category: 'تريكو', price: 890, oldPrice: null, isNew: true, inStock: true, sizes: ['S', 'M', 'L', 'XL'], createdAt: '2026-08-30', salesCount: 44, image: 'https://loremflickr.com/700/875/turtleneck,sweater,fashion?lock=808' },
  { id: 'c-9', slug: 'basic-cotton-tee', name: 'تيشيرت قطن أساسي', categorySlug: 'knitwear', category: 'تريكو', price: 320, oldPrice: null, isNew: false, inStock: true, sizes: SIZES, createdAt: '2026-05-14', salesCount: 311, image: 'https://loremflickr.com/700/875/tshirt,cotton,fashion?lock=809' },
  { id: 'c-10', slug: 'tailored-wide-trousers', name: 'بنطلون واسع كلاسيك', categorySlug: 'trousers', category: 'بناطيل', price: 980, oldPrice: null, isNew: false, inStock: true, sizes: ['S', 'M', 'L', 'XL'], createdAt: '2026-06-18', salesCount: 87, image: 'https://loremflickr.com/700/875/trousers,fashion,studio?lock=810' },
  { id: 'c-11', slug: 'high-waist-jeans', name: 'جينز خصر عالي', categorySlug: 'trousers', category: 'بناطيل', price: 890, oldPrice: 1050, isNew: false, inStock: true, sizes: SIZES, createdAt: '2026-07-02', salesCount: 233, image: 'https://loremflickr.com/700/875/jeans,denim,fashion?lock=811' },
  { id: 'c-12', slug: 'pleated-midi-skirt', name: 'تنورة ميدي مطوية', categorySlug: 'trousers', category: 'بناطيل', price: 760, oldPrice: null, isNew: true, inStock: true, sizes: ['XS', 'S', 'M', 'L'], createdAt: '2026-08-15', salesCount: 29, image: 'https://loremflickr.com/700/875/skirt,pleated,fashion?lock=812' },
  { id: 'c-13', slug: 'leather-ankle-boots', name: 'بوت جلد قصير', categorySlug: 'shoes', category: 'أحذية', price: 1650, oldPrice: null, isNew: true, inStock: true, sizes: ['36', '37', '38', '39', '40'], createdAt: '2026-08-22', salesCount: 55, image: 'https://loremflickr.com/700/875/leather,boots,fashion?lock=813' },
  { id: 'c-14', slug: 'canvas-sneakers', name: 'سنيكرز قماش', categorySlug: 'shoes', category: 'أحذية', price: 720, oldPrice: null, isNew: false, inStock: true, sizes: ['36', '37', '38', '39', '40', '41'], createdAt: '2026-06-05', salesCount: 149, image: 'https://loremflickr.com/700/875/sneakers,canvas,fashion?lock=814' },
  { id: 'c-15', slug: 'silk-blend-scarf', name: 'وشاح حرير مخلوط', categorySlug: 'accessories', category: 'إكسسوارات', price: 420, oldPrice: null, isNew: true, inStock: false, sizes: [], createdAt: '2026-08-05', salesCount: 18, image: 'https://loremflickr.com/700/875/scarf,silk,fashion?lock=815' },
  { id: 'c-16', slug: 'structured-tote-bag', name: 'شنطة توتي مهيكلة', categorySlug: 'accessories', category: 'إكسسوارات', price: 1120, oldPrice: 1400, isNew: false, inStock: true, sizes: [], createdAt: '2026-05-28', salesCount: 121, image: 'https://loremflickr.com/700/875/handbag,tote,leather?lock=816' },
  { id: 'c-17', slug: 'leather-crossbody-bag', name: 'شنطة كروس جلد', categorySlug: 'accessories', category: 'إكسسوارات', price: 980, oldPrice: 1200, isNew: false, inStock: true, sizes: [], createdAt: '2026-04-19', salesCount: 168, image: 'https://loremflickr.com/700/875/crossbody,bag,leather?lock=817' },
  { id: 'c-18', slug: 'gold-drop-earrings', name: 'حلق ذهبي معلّق', categorySlug: 'accessories', category: 'إكسسوارات', price: 340, oldPrice: null, isNew: true, inStock: true, sizes: [], createdAt: '2026-09-04', salesCount: 9, image: 'https://loremflickr.com/700/875/earrings,jewelry,gold?lock=818' },
]
