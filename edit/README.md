# EditPersianDatePicker for PHPRunner  
# افزونه EditPersianDatePicker برای PHPRunner

A production-ready Persian (Jalali) DatePicker UserControl for **PHPRunner** with improved UX, smart popup positioning, manual input support, validation, keyboard navigation, theming, and mobile-friendly behavior.

افزونه‌ای آماده استفاده در محیط عملیاتی برای **PHPRunner** جهت ورود تاریخ شمسی (جلالی) با تجربه کاربری بهبودیافته، مکان‌یابی هوشمند پنجره تقویم، امکان ورود دستی تاریخ، اعتبارسنجی، پشتیبانی از صفحه‌کلید، قابلیت تم‌پذیری و رفتار مناسب در موبایل.

---

## Features | قابلیت‌ها

### English
- Persian/Jalali date picker for PHPRunner
- Smart popup repositioning for small screens and low-page inputs
- Manual date input support for keyboard-oriented users
- Validation for Persian date format and correctness
- Keyboard support:
  - `Enter` to confirm typed value
  - `Tab` to validate before moving to next control
  - `Escape` to close popup
- Themeable with configurable colors
- Mobile-friendly popup behavior
- Clickable calendar icon
- Clear button support
- Supports:
  - Date only: `YYYY/MM/DD`
  - DateTime: `YYYY/MM/DD HH:mm:ss`
- Stores normalized Persian date using English digits

### فارسی
- تقویم شمسی/جلالی برای PHPRunner
- مکان‌یابی هوشمند پنجره تقویم در صفحه‌های کوچک و فیلدهای پایین صفحه
- امکان ورود دستی تاریخ برای کاربران حرفه‌ای و مسلط به صفحه‌کلید
- اعتبارسنجی فرمت و صحت تاریخ شمسی
- پشتیبانی از صفحه‌کلید:
  - کلید `Enter` برای تأیید مقدار واردشده
  - کلید `Tab` برای اعتبارسنجی قبل از رفتن به فیلد بعدی
  - کلید `Escape` برای بستن پنجره تقویم
- قابلیت تم‌پذیری با رنگ‌های قابل تنظیم
- رفتار مناسب در موبایل
- امکان باز شدن با کلیک روی آیکون تقویم
- امکان پاک‌کردن مقدار با دکمه حذف
- پشتیبانی از:
  - فقط تاریخ: `YYYY/MM/DD`
  - تاریخ و زمان: `YYYY/MM/DD HH:mm:ss`
- ذخیره تاریخ شمسی نرمال‌شده با ارقام انگلیسی

---

## Version | نسخه

**Current Version:** `2.0.0`

**نسخه فعلی:** `2.0.0`

---

## Included Files | فایل‌های موجود

### English
This package includes the following main files:

- `EditPersianDatePicker.php`
- `EditPersianDatePicker.js`
- `persian-datepicker-custom.css`
- `sample.php`

It also depends on:

- `persian-date.min.js`
- `persian-datepicker.min.js`
- `persian-datepicker.min.css`
- `Vazirmatn` font files (`woff2`)

### فارسی
این بسته شامل فایل‌های اصلی زیر است:

- `EditPersianDatePicker.php`
- `EditPersianDatePicker.js`
- `persian-datepicker-custom.css`
- `sample.php`

همچنین به فایل‌های زیر وابسته است:

- `persian-date.min.js`
- `persian-datepicker.min.js`
- `persian-datepicker.min.css`
- فایل‌های فونت `Vazirmatn` با فرمت `woff2`

---

## Installation | نصب

### English
1. Copy the plugin files into your PHPRunner project plugin/control directory.
2. Make sure the following files are available in the correct paths:
   - JS libraries
   - CSS files
   - Font files
3. Register and use the UserControl in PHPRunner.
4. Configure field settings using `sample.php` or your plugin settings panel.
5. If JS changes do not appear, delete this cached file:
   ```text
   templates_c/persian-datepicker.min.js
