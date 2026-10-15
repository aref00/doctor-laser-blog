# 🩺 ماژول وبلاگ دکتر لیزر (Doctor Laser Blog Engine)

سیستم مدیریت محتوا و وبلاگ رسمی پلتفرم **دکتر لیزر**، طراحی‌شده با تمرکز بر سئو داخلی پیشرفته (Technical SEO)، دسترسی‌پذیری بالا (a11y)، ساختار داده‌های معنایی (Semantic HTML & Schema.org) و کارایی حداکثری بر بستر وب مدرن.

---

## 📑 فهرست مطالب
- [معماری و ساختار پروژه](#-معماری-و-ساختار-پروژه)
- [استاندارد ثبتی رجیستری مقالات (Registry Spec)](#-استاندارد-ثبتی-رجیستری-مقالات-registry-spec)
- [چک‌لیست استانداردهای سئو (SEO & Content Guidelines)](#-چک‌لیست-استانداردهای-سئو-seo--content-guidelines)
- [الگوی استاندارد نشانه‌گذاری مقالات (Template)](#-الگوی-استاندارد-نشانه‌گذاری-مقالات-template)
- [فرایند افزودن پست جدید (Contribution Workflow)](#-فرایند-افزودن-پست-جدید-contribution-workflow)
- [توسعه محلی و دستورات کاربردی](#-توسعه-محلی-و-دستورات-کاربردی)

---

## 🏗 معماری و ساختار پروژه

ساختار پرونده‌ها و دارایی‌های چندرسانه‌ای مقالات به فرمت بهینه `.avif` / `.webp`:

```text
blog/
├── posts/
│   ├── [post-slug]/
│   │   ├── index.html              # بدنه اصلی مقاله با نشانه‌گذاری سئو
│   │   ├── cover.avif              # تصویر شاخص مقاله (نسبت 16:9 یا 2:1)
│   │   └── assets/                 # تصاویر درون‌متنی، دیاگرام‌ها و نمودارها
├── data/
│   └── posts.registry.ts (or .js)  # رجیستری متادیتا، دسته‌بندی و مسیرها
└── README.md
```

---

## 📌 استاندارد ثبتی رجیستری مقالات (Registry Spec)

تمام مقالات در رجیستری محتوا اعتبارسنجی می‌شوند. فیلدهای کلیدی عبارتند از:

```typescript
interface BlogPostRegistryItem {
  slug: string;        // شناسه یکتا در URL (انگلیسی، استاندارد کباب‌کیس)
  title: string;       // عنوان سئو شده و بهینه (بین ۴۰ تا ۶۰ کاراکتر فارسی)
  date: string;        // تاریخ شمسی رسمی (مثال: ۱۴۰۵-۰۷-۲۳)
  isoDate: string;     // تاریخ استاندارد ISO 8601 جهت خزش موتورهای جستجو (YYYY-MM-DD)
  category: string;    // دسته‌بندی موضوعی
  excerpt: string;     // متای توضیحات سئو (Meta Description) بین ۱۲۰ تا ۱۵۵ کاراکتر
  image: string;       // تصویر شاخص پست در دایرکتوری مقاله
  readTime: string;    // برآورد مدت‌زمان مطالعه (مثال: "۵ دقیقه")
}
```

### نمونه آبجکت رجیستری:

```javascript
{
  slug: "dr-zahra-mohammadi-clinic-setup",
  title: "از تماس اولیه تا راه‌اندازی حضوری؛ تجربه کلینیک دکتر زهرا محمدی با دکتر لیزر",
  date: "۱۴۰۵-۰۷-۲۳",
  isoDate: "2026-10-15",
  category: "گزارش راه‌اندازی",
  excerpt: "گزارشی از مسیر آشنایی کلینیک دکتر زهرا محمدی با دکتر لیزر؛ از تماس و مشاهده دمو تا راه‌اندازی و آموزش حضوری، سامان‌دهی تصاویر، نمایش نمونه‌کارها و فراخوانی بیماران.",
  image: "clinic-training.avif",
  readTime: "۵ دقیقه"
}
```

---

## 🚀 چک‌لیست استانداردهای سئو (SEO & Content Guidelines)

رعایت این اصول برای تمامی محتواها جهت تضمین رتبه‌بندی در ریدرهای موتورهای جستجو ضروری است:

1. **داده‌های ساختاریافته (Schema.org):**
   - استفاده دقیق از شیب `itemscope itemtype="https://schema.org/BlogPosting"`.
   - مشخص کردن خصیصه‌های `itemprop="headline"`, `itemprop="datePublished"`, `itemprop="articleBody"`.
2. **سلسله‌مراتب عناوین (Headings Hierarchy):**
   - فقط یک تگ `<h1>` در کل صفحه مجاز است.
   - زیرعنوان‌ها باید به ترتیب منطقی `<h2>`، `<h3>` و در صورت نیاز `<h4>` باشند؛ هرگز سطح تیتر نباید جهش داشته باشد.
3. **بهینه‌سازی تصاویر (Core Web Vitals):**
   - تصاویر باید در فرمت مدرن و فشرده مانند `AVIF` یا `WebP` باشند.
   - افزودن ویژگی `loading="lazy"` برای جلوگیری از کندی LCP.
   - استفاده از تگ‌های `<figure>` و `<figcaption>` به همراه `alt` دقیق و مرتبط با کلیدواژه بخش.
4. **مسیر راهنما (Breadcrumb Semantic Navigation):**
   - ناوبری صفحه باید دارای `aria-label="مسیر صفحه"` و `aria-current="page"` روی آیتم فعال باشد.
5. **پیوندهای داخلی و کال‌تواکشن (Internal Linking & CTA):**
   - پیوند به صفحات کلینیک‌ها، لندینگ‌های هدف و صفحات ثبت‌نام همراه با پارامترهای رهگیری معتبر (`utm_source=blog_*`).
   - تعبیه تگ‌های فراخوان اقدام (CTA) در انتهای مقاله با هدایت روشن به ثبت‌نام یا دریافت دمو.

---

## 📄 الگوی استاندارد نشانه‌گذاری مقالات (Template)

```html
<main id="main-content">
  <article class="post-layout" itemscope itemtype="https://schema.org/BlogPosting">
    <!-- مسیر صفحه -->
    <nav class="breadcrumb" aria-label="مسیر صفحه">
      <a href="https://doctor-laser.ir">خانه</a>
      <span class="breadcrumb__sep" aria-hidden="true">&#8250;</span>
      <a href="/blog">وبلاگ</a>
      <span class="breadcrumb__sep" aria-hidden="true">&#8250;</span>
      <span aria-current="page">عنوان خلاصه صفحه</span>
    </nav>

    <!-- هدر مقاله -->
    <header class="post-header">
      <span class="badge badge--warning">دسته‌بندی موضوعی</span>
      <h1 class="post-header__title" itemprop="headline">عنوان جذاب و سئو شده</h1>
      <div class="post-header__meta" role="contentinfo">
        <span class="post-header__meta-item">
          <time itemprop="datePublished" datetime="YYYY-MM-DD">تاریخ شمسی</time>
        </span>
        <span class="post-header__meta-item">X دقیقه مطالعه</span>
        <span class="post-header__meta-item">تیم دکتر لیزر</span>
      </div>
    </header>

    <!-- بدنه مقاله -->
    <div class="post-body" itemprop="articleBody">
      <p>پاراگراف لید و معرفی موضوع...</p>
      
      <figure>
        <img src="/blog/posts/[slug]/image-1.avif" alt="توضیح کامل تصویر برای سئو" loading="lazy" />
        <figcaption>توضیح زیر تصویر</figcaption>
      </figure>

      <h2>تیتر فرعی اصلی</h2>
      <p>محتوای بدنه...</p>

      <!-- بخش دعوت به اقدام (CTA) -->
      <div class="post-cta">
        <h3>عنوان فراخوان اقدام</h3>
        <p><a href="https://doctor-laser.ir/register">همین حالا شروع کنید</a></p>
      </div>
    </div>
  </article>
</main>
```

---

## 🛠 فرایند افزودن پست جدید (Contribution Workflow)

1. ایجاد دایرکتوری جدید در مسیر `posts/[post-slug]`.
2. قراردادن فایل محتوایی `index.html` و تصاویر بهینه‌شده با ابعاد مناسب در همان پوشه.
3. بررسی تناسب تگ‌های `alt`، پیوندهای داخلی و تگ‌های Schema.
4. اضافه کردن مشخصات پست به فایل `posts.registry.ts`.
5. اجرای ابزارهای اعتبارسنجی و تست Rich Results تسترهای گوگل پیش از مرج روی برنچ اصلی.

---

## 💻 توسعه و پایش کیفیت

- **تست ساختار Schema:** استفاده از ابزار [Rich Results Test گوگل](https://search.google.com/test/rich-results)
- **بررسی عملکرد و Core Web Vitals:** بررسی از طریق ابزار Google Lighthouse برای حفظ نمره بالای ۹۰ در دسته‌های Performance و Accessibility و SEO.