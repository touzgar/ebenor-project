# Responsive Design Implementation Guide

**ÉBENOR CRÉATION Platform - Developer Reference**

## Overview

This guide provides code examples and best practices for maintaining responsive design across the platform. Use this as a reference when adding new features or components.

---

## Tailwind CSS Breakpoints

### Default Breakpoints (Tailwind CSS)

```javascript
// tailwind.config.js
screens: {
  'sm': '640px',   // Small devices (landscape phones)
  'md': '768px',   // Medium devices (tablets)
  'lg': '1024px',  // Large devices (desktops)
  'xl': '1280px',  // Extra large devices
  '2xl': '1536px', // 2X Extra large devices
}
```

### Our Usage Convention

```
Mobile:  < 768px   (default, sm)
Tablet:  768px - 1023px  (md)
Desktop: 1024px+  (lg, xl, 2xl)
```

---

## Responsive Patterns

### 1. Container Pattern

**Always use the container class for page content:**

```tsx
// ✅ GOOD
<div className="container">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</div>

// ❌ BAD - Fixed width
<div className="w-[1200px]">
  {/* Content */}
</div>
```

### 2. Grid Pattern

**Use responsive grid classes:**

```tsx
// ✅ GOOD - Adapts to viewport
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// ❌ BAD - Fixed columns
<div className="grid grid-cols-4 gap-8">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### 3. Flexbox Pattern

**Use flex with wrapping for horizontal layouts:**

```tsx
// ✅ GOOD - Wraps on small screens
<div className="flex flex-wrap gap-4 lg:flex-nowrap">
  <div className="w-full lg:w-1/3">{/* Sidebar */}</div>
  <div className="w-full lg:w-2/3">{/* Main */}</div>
</div>

// ❌ BAD - Doesn't wrap
<div className="flex gap-4">
  <div className="w-1/3">{/* Sidebar */}</div>
  <div className="w-2/3">{/* Main */}</div>
</div>
```

### 4. Stack Pattern

**Stack elements vertically on mobile, horizontal on desktop:**

```tsx
// ✅ GOOD
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>{/* Left content */}</div>
  <div>{/* Right content */}</div>
</div>

// ❌ BAD - Always horizontal
<div className="flex items-center justify-between">
  <div>{/* Left content */}</div>
  <div>{/* Right content */}</div>
</div>
```

### 5. Hide/Show Pattern

**Show/hide elements based on viewport:**

```tsx
// ✅ GOOD
<>
  {/* Mobile only */}
  <div className="lg:hidden">
    <MobileMenu />
  </div>
  
  {/* Desktop only */}
  <div className="hidden lg:block">
    <DesktopMenu />
  </div>
</>

// ❌ BAD - Using CSS display: none (not semantic)
<div style={{ display: window.innerWidth < 768 ? 'block' : 'none' }}>
  <MobileMenu />
</div>
```

---

## Component Examples

### Responsive Card

```tsx
export function ResponsiveCard({ title, description, image }: CardProps) {
  return (
    <article className="card h-full">
      {/* Image - 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="text-xl font-semibold mb-2 lg:text-2xl">
          {title}
        </h3>
        <p className="text-neutral-600 mb-4 line-clamp-2 lg:line-clamp-3">
          {description}
        </p>
        
        {/* CTA - Full width on mobile, auto on desktop */}
        <button className="btn-primary w-full lg:w-auto mt-auto">
          Learn More
        </button>
      </div>
    </article>
  );
}
```

### Responsive Navigation

```tsx
export function ResponsiveNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container py-4 space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-neutral-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

### Responsive Form

```tsx
export function ResponsiveForm() {
  return (
    <form className="space-y-6">
      {/* Name Fields - Stack on mobile, side-by-side on desktop */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className="input"  // 48px height for touch
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className="input"  // 48px height for touch
            required
          />
        </div>
      </div>
      
      {/* Email - Full width */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input"
          required
        />
      </div>
      
      {/* Message - Full width */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className="textarea"
          required
        />
      </div>
      
      {/* Submit - Full width on mobile, auto on desktop */}
      <button
        type="submit"
        className="btn-primary w-full lg:w-auto"  // 44x44px minimum
      >
        Send Message
      </button>
    </form>
  );
}
```

### Responsive Table

```tsx
export function ResponsiveTable({ data }: TableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.status}</td>
                <td>
                  <button className="btn-ghost">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {data.map(row => (
          <div key={row.id} className="card">
            <div className="font-semibold mb-2">{row.name}</div>
            <div className="text-sm text-neutral-600 mb-2">{row.email}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{row.status}</span>
              <button className="btn-ghost">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
```

### Responsive Image Gallery

```tsx
export function ResponsiveGallery({ images }: GalleryProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {images.map((image, index) => (
        <div key={image.id} className="mb-6 break-inside-avoid">
          <Image
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-auto rounded-lg"
            loading={index < 4 ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={getBlurDataURL(image.url)}
          />
        </div>
      ))}
    </div>
  );
}
```

---

## Responsive Typography

### Font Sizes

```tsx
// ✅ GOOD - Responsive text sizes
<h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
  Main Heading
</h1>

<h2 className="text-2xl lg:text-3xl font-semibold">
  Section Heading
</h2>

<p className="text-base lg:text-lg">
  Body text that scales up on larger screens
</p>

// ❌ BAD - Fixed text size
<h1 className="text-5xl font-bold">
  Main Heading
</h1>
```

### Line Clamping

```tsx
// ✅ GOOD - Responsive line clamping
<p className="line-clamp-2 lg:line-clamp-3">
  {longDescription}
</p>

// ❌ BAD - Fixed line clamp
<p className="line-clamp-3">
  {longDescription}
</p>
```

---

## Responsive Spacing

### Padding and Margins

```tsx
// ✅ GOOD - Responsive spacing
<section className="py-12 lg:py-24">
  <div className="container px-4 sm:px-6 lg:px-8">
    <div className="space-y-8 lg:space-y-12">
      {/* Content */}
    </div>
  </div>
</section>

// ❌ BAD - Fixed spacing
<section className="py-24">
  <div className="container px-8">
    <div className="space-y-12">
      {/* Content */}
    </div>
  </div>
</section>
```

### Gap Spacing

```tsx
// ✅ GOOD - Responsive gaps
<div className="grid gap-4 lg:gap-8">
  {/* Items */}
</div>

<div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
  {/* Items */}
</div>

// ❌ BAD - Fixed gaps
<div className="grid gap-8">
  {/* Items */}
</div>
```

---

## Responsive Images

### Next.js Image Component

```tsx
// ✅ GOOD - Responsive image with sizes
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-auto"
  priority={false}  // true for above-fold images
  placeholder="blur"
  blurDataURL={getBlurDataURL('/path/to/image.jpg')}
/>

// ❌ BAD - No sizes attribute
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={800}
  className="w-full h-auto"
/>
```

### Aspect Ratios

```tsx
// ✅ GOOD - Responsive aspect ratios
<div className="relative aspect-video lg:aspect-[21/9]">
  <Image src={image} alt={alt} fill className="object-cover" />
</div>

<div className="relative aspect-square lg:aspect-[4/3]">
  <Image src={image} alt={alt} fill className="object-cover" />
</div>

// ❌ BAD - Fixed height
<div className="relative h-64">
  <Image src={image} alt={alt} fill className="object-cover" />
</div>
```

---

## Touch Targets

### Minimum Size: 44x44px

```tsx
// ✅ GOOD - Touch-friendly buttons
<button className="btn-primary">  // py-3 = 48px height
  Click Me
</button>

<button className="p-3">  // 12px * 2 + icon = 44px+
  <Icon className="w-5 h-5" />
</button>

// ❌ BAD - Too small for touch
<button className="px-2 py-1 text-xs">
  Click Me
</button>

<button className="p-1">
  <Icon className="w-3 h-3" />
</button>
```

### Spacing Between Targets

```tsx
// ✅ GOOD - Adequate spacing
<div className="flex gap-4">
  <button className="btn-primary">Button 1</button>
  <button className="btn-secondary">Button 2</button>
</div>

// ❌ BAD - Too close together
<div className="flex gap-1">
  <button className="btn-primary">Button 1</button>
  <button className="btn-secondary">Button 2</button>
</div>
```

---

## Responsive Modals/Drawers

### Full-Screen on Mobile, Centered on Desktop

```tsx
export function ResponsiveModal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-h-[90vh] lg:max-w-2xl lg:max-h-[80vh] bg-white rounded-t-2xl lg:rounded-2xl overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>
        
        {/* Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

## Responsive Animations

### Conditional Animations

```tsx
// ✅ GOOD - Disable complex animations on mobile
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: window.innerWidth < 768 ? 0.2 : 0.5,
    ease: 'easeOut'
  }}
>
  {content}
</motion.div>

// Or use CSS media queries
<div className="transition-transform duration-300 lg:hover:scale-105">
  {content}
</div>
```

---

## Performance Optimization

### Lazy Loading

```tsx
// ✅ GOOD - Lazy load below-fold content
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false  // Client-side only if needed
  }
);

// Images
<Image
  src={image}
  alt={alt}
  loading="lazy"  // Below-fold images
  placeholder="blur"
/>
```

### Code Splitting

```tsx
// ✅ GOOD - Split by route (automatic in Next.js)
// pages/products/[id].tsx
// pages/gallery/index.tsx

// ✅ GOOD - Dynamic imports for heavy components
const Lightbox = dynamic(() => import('@/components/ui/Lightbox'));
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'));
```

---

## Testing Utilities

### Responsive Testing Hook

```tsx
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 767px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

### Viewport Size Hook

```tsx
// hooks/useViewportSize.ts
import { useState, useEffect } from 'react';

export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
const { width, height } = useViewportSize();
const isMobile = width < 768;
```

---

## Common Pitfalls

### ❌ Don't Use Fixed Widths

```tsx
// ❌ BAD
<div className="w-[1200px]">
  {content}
</div>

// ✅ GOOD
<div className="w-full max-w-7xl mx-auto">
  {content}
</div>
```

### ❌ Don't Use Pixel-Based Media Queries

```tsx
// ❌ BAD
@media (max-width: 768px) {
  /* styles */
}

// ✅ GOOD - Use Tailwind breakpoints
<div className="text-base lg:text-lg">
  {content}
</div>
```

### ❌ Don't Forget Touch Targets

```tsx
// ❌ BAD - Too small
<button className="p-1 text-xs">
  <Icon className="w-3 h-3" />
</button>

// ✅ GOOD - Touch-friendly
<button className="p-3 text-sm">
  <Icon className="w-5 h-5" />
</button>
```

### ❌ Don't Use Viewport Units for Everything

```tsx
// ❌ BAD - Can cause issues on mobile
<div className="h-screen">
  {content}
</div>

// ✅ GOOD - Use min-height
<div className="min-h-screen">
  {content}
</div>
```

### ❌ Don't Forget Horizontal Scroll Prevention

```tsx
// ❌ BAD - Can cause horizontal scroll
<div className="w-screen">
  <div className="px-8">
    {content}
  </div>
</div>

// ✅ GOOD - Use container
<div className="w-full">
  <div className="container">
    {content}
  </div>
</div>
```

---

## Checklist for New Components

When creating a new component, ensure:

- [ ] Uses responsive Tailwind classes (sm:, md:, lg:, xl:)
- [ ] Touch targets are minimum 44x44px
- [ ] Images use Next.js Image with sizes attribute
- [ ] Text is readable on all viewports
- [ ] No horizontal scrolling on any viewport
- [ ] Tested on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels for interactive elements
- [ ] Loading states for async content
- [ ] Error states handled gracefully

---

## Resources

### Documentation
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [Responsive Design Checker](https://responsivedesignchecker.com/)
- [BrowserStack](https://www.browserstack.com/) - Real device testing

### Testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [WebPageTest](https://www.webpagetest.org/) - Performance testing

---

**End of Guide**

This guide should be referenced when implementing new features to ensure consistent responsive design across the platform.
