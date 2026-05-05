# Responsive Design Testing Checklist

**Quick Manual Testing Guide for Task 57**

## How to Test

### Using Browser DevTools

1. **Open DevTools**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. **Toggle Device Toolbar**: Press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
3. **Select Device**: Choose from preset devices or enter custom dimensions
4. **Test Interactions**: Click, scroll, and interact with the page

### Test Viewports

```
Mobile Small:  320px × 568px  (iPhone SE)
Mobile Medium: 375px × 667px  (iPhone 8)
Mobile Large:  414px × 896px  (iPhone 11 Pro Max)
Tablet:        768px × 1024px (iPad)
Desktop:       1024px × 768px (Small Desktop)
Desktop Large: 1440px × 900px (Standard Desktop)
Desktop XL:    1920px × 1080px (Full HD)
```

---

## Public Pages Testing

### ✅ Homepage (`/`)

#### Mobile (320px-767px)
- [ ] Hero video displays correctly
- [ ] Navigation hamburger menu opens/closes
- [ ] All sections stack vertically
- [ ] Featured products show 1 column
- [ ] Gallery shows 1 column masonry
- [ ] Footer stacks vertically
- [ ] No horizontal scrolling
- [ ] All buttons are touch-friendly (44x44px)

#### Tablet (768px-1023px)
- [ ] Featured products show 2 columns
- [ ] Gallery shows 2 columns masonry
- [ ] Navigation still uses hamburger
- [ ] Sections use 2-column layouts where appropriate

#### Desktop (1024px+)
- [ ] Full horizontal navigation visible
- [ ] Featured products show 3-4 columns
- [ ] Gallery shows 3-4 columns masonry
- [ ] All hover effects work
- [ ] Smooth scroll animations

---

### ✅ Product Catalog (`/produits`)

#### Mobile (320px-767px)
- [ ] Filter buttons wrap to multiple rows
- [ ] Search input is full-width
- [ ] Sort dropdown is accessible
- [ ] Product grid shows 1 column
- [ ] Product cards are touch-friendly
- [ ] Pagination buttons are large enough
- [ ] Active filters display correctly
- [ ] "Clear All" button visible

#### Tablet (768px-1023px)
- [ ] Product grid shows 2 columns
- [ ] Filters display horizontally
- [ ] Search and sort inline

#### Desktop (1024px+)
- [ ] Product grid shows 3 columns (lg)
- [ ] Product grid shows 4 columns (xl at 1280px+)
- [ ] Sticky filter bar works
- [ ] All filters visible in one row

---

### ✅ Product Detail (`/produits/[slug]`)

#### Mobile (320px-767px)
- [ ] Image gallery displays full-width
- [ ] Thumbnails show 4 columns
- [ ] Content stacks below image
- [ ] Specifications stack vertically
- [ ] Materials/finishes wrap correctly
- [ ] CTA buttons are full-width
- [ ] Similar products show 1 column
- [ ] Lightbox opens correctly
- [ ] Lightbox navigation buttons are touch-friendly

#### Tablet (768px-1023px)
- [ ] Similar products show 2 columns
- [ ] Specifications use 2-column grid

#### Desktop (1024px+)
- [ ] Image and content side-by-side (2 columns)
- [ ] Similar products show 4 columns
- [ ] Hover effects on thumbnails work
- [ ] Lightbox keyboard navigation works

---

### ✅ Gallery (`/galerie`)

#### Mobile (320px-767px)
- [ ] Filter buttons wrap to multiple rows
- [ ] Masonry shows 1 column
- [ ] Images maintain aspect ratio
- [ ] Tap to open lightbox works
- [ ] Lightbox navigation works
- [ ] "Load More" button visible

#### Tablet (768px-1023px)
- [ ] Masonry shows 2 columns
- [ ] Images distribute evenly

#### Desktop (1024px+)
- [ ] Masonry shows 3 columns (lg)
- [ ] Masonry shows 4 columns (xl at 1280px+)
- [ ] Hover overlay effects work
- [ ] Lightbox keyboard navigation works

---

### ✅ Contact (`/contact`)

#### Mobile (320px-767px)
- [ ] Form stacks vertically
- [ ] All inputs are 48px height minimum
- [ ] Name fields stack vertically
- [ ] Submit button is full-width
- [ ] Contact info stacks below form
- [ ] WhatsApp button is touch-friendly
- [ ] FAQ cards stack vertically

#### Tablet (768px-1023px)
- [ ] Name fields show side-by-side
- [ ] FAQ cards show 2 columns

#### Desktop (1024px+)
- [ ] Form and contact info side-by-side (2 columns)
- [ ] FAQ cards show 2 columns
- [ ] Map placeholder displays correctly

---

## Admin Pages Testing

### ✅ Admin Dashboard (`/admin/dashboard`)

#### Tablet (768px-1023px)
- [ ] Mobile header with hamburger visible
- [ ] Hamburger menu opens/closes
- [ ] Stats cards stack or show 2 columns
- [ ] Charts adapt to container width
- [ ] Recent activity list scrolls

#### Desktop (1024px+)
- [ ] Fixed sidebar visible (64rem width)
- [ ] Main content offset correctly (pl-64)
- [ ] Stats show in grid (2-4 columns)
- [ ] Charts display side-by-side
- [ ] Navigation hover effects work

---

### ✅ Admin Products (`/admin/products`)

#### Tablet (768px-1023px)
- [ ] Table scrolls horizontally if needed
- [ ] Action buttons are touch-friendly
- [ ] Forms adapt to viewport
- [ ] Image upload interface works

#### Desktop (1024px+)
- [ ] Full table layout visible
- [ ] All columns display
- [ ] Bulk actions accessible
- [ ] Filters and search inline

---

### ✅ Admin Gallery (`/admin/gallery`)

#### Tablet (768px-1023px)
- [ ] Gallery grid shows 2 columns
- [ ] Upload button accessible
- [ ] Edit forms adapt

#### Desktop (1024px+)
- [ ] Gallery grid shows 3-4 columns
- [ ] Drag-and-drop reordering works
- [ ] Bulk selection works

---

### ✅ Admin Homepage Editor (`/admin/homepage/*`)

#### Tablet (768px-1023px)
- [ ] Forms stack vertically
- [ ] All inputs touch-friendly
- [ ] Preview adapts to viewport
- [ ] Save button accessible

#### Desktop (1024px+)
- [ ] Form and preview side-by-side (where applicable)
- [ ] Dynamic arrays (highlights, services) work
- [ ] Drag-and-drop reordering works

---

## Component-Specific Tests

### ✅ Header/Navigation

#### Mobile
- [ ] Logo visible and correct size
- [ ] Hamburger icon visible (top-right)
- [ ] Hamburger opens full-screen menu
- [ ] Menu items are touch-friendly
- [ ] Menu closes on navigation
- [ ] Menu closes on backdrop click
- [ ] CTA buttons visible in mobile menu

#### Desktop
- [ ] Logo visible (top-left)
- [ ] Horizontal navigation visible
- [ ] All menu items inline
- [ ] Hover effects work
- [ ] Active page indicator works
- [ ] CTA buttons visible (top-right)
- [ ] Scroll effects work (background blur)

---

### ✅ Lightbox

#### All Viewports
- [ ] Opens on image click
- [ ] Image displays correctly
- [ ] Close button visible (top-right)
- [ ] Previous/Next buttons visible (sides)
- [ ] Image counter visible (bottom)
- [ ] Title and description visible
- [ ] Keyboard navigation works (Arrow keys, Escape)
- [ ] Click backdrop to close works
- [ ] Touch-friendly button sizes

---

### ✅ Product Cards

#### All Viewports
- [ ] Image displays correctly (4:3 aspect ratio)
- [ ] Featured badge visible (if featured)
- [ ] Availability badge visible (top-right)
- [ ] Category label visible
- [ ] Title readable (no overflow)
- [ ] Description truncates correctly (2 lines)
- [ ] Price visible and formatted
- [ ] "View Details" link visible
- [ ] Tags display (max 3)
- [ ] Hover effects work (desktop)
- [ ] Touch-friendly (mobile)

---

### ✅ Forms

#### All Viewports
- [ ] All inputs minimum 48px height
- [ ] Labels associated with inputs
- [ ] Placeholder text visible
- [ ] Validation errors display inline
- [ ] Submit button minimum 44x44px
- [ ] Checkboxes/radios touch-friendly
- [ ] Select dropdowns accessible
- [ ] Focus indicators visible

---

## Horizontal Scrolling Test

### Critical Test: No Horizontal Scroll

For each page and viewport, perform this test:

1. **Scroll to bottom of page**
2. **Try to scroll horizontally** (swipe left/right on mobile, or use horizontal scrollbar)
3. **Expected Result**: No horizontal scrolling should occur

#### Pages to Test
- [ ] Homepage (`/`)
- [ ] Product Catalog (`/produits`)
- [ ] Product Detail (`/produits/[slug]`)
- [ ] Gallery (`/galerie`)
- [ ] Contact (`/contact`)
- [ ] Admin Dashboard (`/admin/dashboard`)
- [ ] Admin Products (`/admin/products`)
- [ ] Admin Gallery (`/admin/gallery`)
- [ ] Admin Homepage Editor (`/admin/homepage/*`)

#### Common Causes of Horizontal Scroll
- ❌ Fixed-width elements wider than viewport
- ❌ Images without max-width
- ❌ Long URLs or text without word-break
- ❌ Tables without overflow-x-auto
- ❌ Absolute positioned elements outside container

---

## Touch Target Test

### Minimum Size: 44x44px (WCAG 2.1 Level AAA)

#### Elements to Test
- [ ] All buttons
- [ ] All links
- [ ] Form inputs
- [ ] Checkboxes
- [ ] Radio buttons
- [ ] Select dropdowns
- [ ] Navigation menu items
- [ ] Filter buttons
- [ ] Pagination buttons
- [ ] Lightbox navigation buttons
- [ ] Close buttons
- [ ] Icon buttons

#### How to Test
1. **Visual Inspection**: Use browser DevTools to inspect element dimensions
2. **Touch Test**: On real device, try tapping with finger
3. **Expected Result**: Easy to tap without accidentally hitting adjacent elements

---

## Performance Test

### Mobile Performance

#### Test on 3G Connection (Chrome DevTools)
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Reload page
4. **Expected Result**: Page loads within 3 seconds

#### Pages to Test
- [ ] Homepage (`/`)
- [ ] Product Catalog (`/produits`)
- [ ] Product Detail (`/produits/[slug]`)
- [ ] Gallery (`/galerie`)

#### Metrics to Check
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Cumulative Layout Shift (CLS) < 0.1

---

## Accessibility Test

### Keyboard Navigation

#### Test on All Pages
1. **Tab through all interactive elements**
2. **Expected Result**: 
   - Focus indicator visible on all elements
   - Logical tab order
   - No keyboard traps
   - All functionality accessible via keyboard

#### Elements to Test
- [ ] Navigation menu
- [ ] Buttons
- [ ] Links
- [ ] Form inputs
- [ ] Filters
- [ ] Pagination
- [ ] Lightbox
- [ ] Modals/Drawers

---

## Browser Compatibility Test

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

### Features to Verify
- [ ] CSS Grid layout
- [ ] Flexbox layout
- [ ] CSS Columns (masonry)
- [ ] Backdrop filter (blur)
- [ ] CSS Custom Properties
- [ ] Animations (Framer Motion)
- [ ] Image lazy loading
- [ ] WebP images with fallback

---

## Real Device Testing

### Recommended Devices
- [ ] iPhone SE (320px width)
- [ ] iPhone 12/13 (390px width)
- [ ] iPhone 14 Pro Max (430px width)
- [ ] iPad (768px width)
- [ ] iPad Pro (1024px width)
- [ ] Android Phone (various sizes)
- [ ] Android Tablet

### What to Test
- [ ] Touch interactions feel natural
- [ ] Swipe gestures work
- [ ] Pinch-to-zoom works (where appropriate)
- [ ] Orientation change (portrait/landscape)
- [ ] Performance is acceptable
- [ ] No layout issues
- [ ] All features accessible

---

## Issue Reporting Template

If you find any responsive design issues, report them using this template:

```markdown
### Issue: [Brief Description]

**Page**: [URL or page name]
**Viewport**: [Width × Height]
**Browser**: [Browser name and version]
**Device**: [Device name or "Desktop"]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Screenshot**:
[Attach screenshot if possible]

**Priority**: [Low / Medium / High / Critical]
```

---

## Sign-Off

### Testing Completed By
- **Name**: ___________________________
- **Date**: ___________________________
- **Signature**: ___________________________

### Results Summary
- **Total Tests**: _____ / _____
- **Passed**: _____
- **Failed**: _____
- **Issues Found**: _____

### Overall Status
- [ ] ✅ All tests passed - Ready for production
- [ ] ⚠️ Minor issues found - Can proceed with notes
- [ ] ❌ Major issues found - Requires fixes before deployment

---

**End of Checklist**

This checklist ensures comprehensive testing of all responsive design requirements. Complete all sections before marking Task 57 as complete.
