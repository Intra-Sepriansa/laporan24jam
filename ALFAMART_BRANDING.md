# 🏪 ALFAMART BRANDING GUIDELINES

## Brand Identity

**Alfamart** adalah salah satu jaringan minimarket terbesar di Indonesia dengan lebih dari 17,000 toko di seluruh Indonesia dan Filipina.

**Tagline:** "Belanja Puas, Harga Pas!"

---

## 🎨 Color Palette

### Primary Colors (Official Alfamart):
```css
/* Red - Primary Brand Color */
--alfamart-red: #E31E24;
--alfamart-red-dark: #C41E3A;
--alfamart-red-light: #FF4444;

/* Blue - Secondary Brand Color */
--alfamart-blue: #0066CC;
--alfamart-blue-dark: #004C99;
--alfamart-blue-light: #3399FF;

/* Yellow/Orange - Accent Color */
--alfamart-yellow: #FFB81C;
--alfamart-orange: #FF8C00;
```

### UI Colors (For Application):
```css
/* Backgrounds */
--bg-primary: #FFFFFF;
--bg-secondary: #F8F9FA;
--bg-tertiary: #E9ECEF;

/* Text */
--text-primary: #212529;
--text-secondary: #6C757D;
--text-muted: #ADB5BD;

/* Success, Warning, Error */
--success: #10B981;
--warning: #FFB81C;
--error: #E31E24;
--info: #0066CC;

/* Borders */
--border-light: #DEE2E6;
--border-medium: #CED4DA;
--border-dark: #ADB5BD;
```

---

## 📝 Typography

### Font Family:
```css
/* Primary Font (Similar to Alfamart) */
font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;

/* For Logo/Headers (Rounded) */
font-family: 'Nunito', 'Quicksand', 'Poppins', sans-serif;
```

### Font Sizes:
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights:
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

---

## 🎯 Logo Usage

### Logo Variations:
1. **Full Color Logo** - Primary use
2. **White Logo** - On dark backgrounds
3. **Single Color** - Red or Blue only
4. **Monochrome** - Black or white

### Logo Placement:
- Top left corner (standard)
- Minimum size: 120px width
- Clear space: Equal to height of "A" in logo
- Never distort or rotate

---

## 🎨 Design Principles

### 1. **Friendly & Approachable**
- Rounded corners (border-radius: 8px-12px)
- Soft shadows
- Warm color combinations
- Friendly icons

### 2. **Clean & Modern**
- Ample white space
- Clear hierarchy
- Consistent spacing (4px grid)
- Simple layouts

### 3. **Trustworthy & Professional**
- Consistent branding
- Clear typography
- Organized information
- Professional imagery

### 4. **Accessible**
- High contrast ratios (WCAG AA)
- Clear labels
- Keyboard navigation
- Screen reader friendly

---

## 🖼️ UI Components Style

### Buttons:
```css
/* Primary Button (Red) */
background: #E31E24;
color: white;
border-radius: 8px;
padding: 10px 20px;
font-weight: 600;

/* Secondary Button (Blue) */
background: #0066CC;
color: white;

/* Outline Button */
border: 2px solid #E31E24;
color: #E31E24;
background: transparent;
```

### Cards:
```css
background: white;
border-radius: 12px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
padding: 20px;
border: 1px solid #E9ECEF;
```

### Inputs:
```css
border: 1px solid #CED4DA;
border-radius: 8px;
padding: 10px 16px;
font-size: 16px;

/* Focus State */
border-color: #0066CC;
box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
```

### Tables:
```css
/* Header */
background: #F8F9FA;
color: #212529;
font-weight: 600;

/* Rows */
border-bottom: 1px solid #E9ECEF;

/* Hover */
background: #F8F9FA;
```

---

## 📱 Responsive Design

### Breakpoints:
```css
/* Mobile First */
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

### Layout:
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Sidebar: Collapsible on mobile

---

## 🎭 Iconography

### Icon Style:
- **Style:** Rounded, friendly
- **Weight:** Medium (2px stroke)
- **Size:** 20px, 24px, 32px
- **Library:** Lucide React (already installed)

### Common Icons:
- 🏪 Store: `Store` icon
- 📊 Reports: `FileText` icon
- 📈 Analytics: `TrendingUp` icon
- 👤 User: `User` icon
- ⚙️ Settings: `Settings` icon
- 📤 Export: `Download` icon
- ➕ Add: `Plus` icon
- ✏️ Edit: `Edit` icon
- 🗑️ Delete: `Trash2` icon

---

## 🌟 Brand Personality

### Voice & Tone:
- **Friendly:** Ramah dan hangat
- **Helpful:** Membantu dan supportive
- **Professional:** Terpercaya dan kompeten
- **Efficient:** Cepat dan efisien

### Messaging:
- "Belanja Puas, Harga Pas!"
- "Selalu Ada Untuk Anda"
- "Mudah, Cepat, Terpercaya"

---

## 🎨 Application Theme

### Light Theme (Default):
```css
{
  "primary": "#E31E24",
  "secondary": "#0066CC",
  "accent": "#FFB81C",
  "background": "#FFFFFF",
  "surface": "#F8F9FA",
  "text": "#212529",
  "border": "#DEE2E6"
}
```

### Dark Theme (Optional):
```css
{
  "primary": "#FF4444",
  "secondary": "#3399FF",
  "accent": "#FFB81C",
  "background": "#1A1A1A",
  "surface": "#2D2D2D",
  "text": "#FFFFFF",
  "border": "#404040"
}
```

---

## 📐 Spacing System

### Base Unit: 4px
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

## 🎯 Implementation Notes

### For This Project:
1. ✅ Use Alfamart red (#E31E24) as primary color
2. ✅ Use Alfamart blue (#0066CC) as secondary color
3. ✅ Use rounded corners (8-12px) for friendly feel
4. ✅ Include Alfamart logo in header
5. ✅ Use Inter font (already in Tailwind)
6. ✅ Maintain professional yet friendly tone
7. ✅ Keep UI clean and organized
8. ✅ Ensure mobile responsiveness

### Tailwind Config Update:
```javascript
theme: {
  extend: {
    colors: {
      alfamart: {
        red: '#E31E24',
        'red-dark': '#C41E3A',
        'red-light': '#FF4444',
        blue: '#0066CC',
        'blue-dark': '#004C99',
        'blue-light': '#3399FF',
        yellow: '#FFB81C',
        orange: '#FF8C00',
      }
    }
  }
}
```

---

## 🚀 Ready to Implement!

Dengan branding guidelines ini, kita akan membuat aplikasi yang:
- ✅ Konsisten dengan brand Alfamart
- ✅ Professional dan modern
- ✅ User-friendly dan accessible
- ✅ Mobile-responsive
- ✅ Mudah di-maintain

**Next:** Implementasi custom login page dengan Alfamart branding! 🎨
