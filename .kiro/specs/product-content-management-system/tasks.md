# Implementation Plan: Product and Content Management System

## Overview

This implementation plan covers the development of a comprehensive Product and Content Management System for ÉBENOR CRÉATION. The system includes public-facing product catalog and gallery pages, along with a complete admin dashboard for managing products, gallery images, and homepage content.

The implementation builds on existing infrastructure (Express.js backend, Next.js 14 frontend, MongoDB models) and adds Cloudinary integration, rich content editing, bulk operations, and analytics capabilities.

## Tasks

### Phase 1: Backend API Foundation

- [x] 1. Set up Cloudinary integration and file upload service
  - Install and configure Cloudinary SDK in backend
  - Create `backend/src/services/cloudinaryService.ts` with upload, delete, and transformation functions
  - Create `backend/src/services/fileUploadService.ts` with validation and processing logic
  - Configure Multer middleware for multipart file uploads
  - Add environment variables for Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
  - Implement signed upload URLs for secure uploads
  - _Requirements: 18.1-18.10, 28.1-28.10_

- [ ]* 1.1 Write unit tests for Cloudinary service
  - Test upload success scenarios
  - Test upload failure scenarios (invalid file type, size exceeded)
  - Test delete operations
  - Test transformation generation
  - _Requirements: 18.1-18.10_

- [x] 2. Implement image processing service
  - Create `backend/src/services/imageProcessorService.ts`
  - Implement thumbnail generation (300x300px max)
  - Implement medium version generation (800x800px max)
  - Implement large version generation (1920x1920px max)
  - Implement WebP conversion with JPEG fallback
  - Implement dimension extraction
  - Implement compression with quality optimization
  - _Requirements: 19.1-19.10_

- [ ]* 2.1 Write unit tests for image processor
  - Test thumbnail generation maintains aspect ratio
  - Test all size variants are generated
  - Test WebP conversion
  - Test dimension extraction
  - _Requirements: 19.1-19.10_

- [x] 3. Implement video processing service
  - Create `backend/src/services/videoProcessorService.ts`
  - Implement video format validation (mp4, webm)
  - Implement video size validation (max 100MB)
  - Implement thumbnail generation from video
  - Implement Cloudinary video upload
  - _Requirements: 10.3-10.7_

- [x] 4. Enhance product controller with full CRUD operations
  - Update `backend/src/controllers/productController.ts`
  - Implement GET /api/products with filtering, search, sorting, pagination
  - Implement GET /api/products/:slug for product detail
  - Implement POST /api/admin/products for product creation (admin only)
  - Implement PUT /api/admin/products/:id for product updates (admin only)
  - Implement DELETE /api/admin/products/:id for product deletion (admin only)
  - Implement POST /api/admin/products/bulk for bulk operations (admin only)
  - Add query parameter parsing for filters (category, subcategory, price range, materials, availability, tags)
  - Add text search using MongoDB text index
  - Add sorting options (newest, price-asc, price-desc, featured)
  - _Requirements: 1.1-1.6, 2.1-2.10, 3.1-3.6, 4.1-4.4, 8.1-8.12, 11.1-11.10_

- [ ]* 4.1 Write integration tests for product API endpoints
  - Test product listing with various filters
  - Test product search functionality
  - Test product creation with valid data
  - Test product creation with invalid data (validation errors)
  - Test product update operations
  - Test product deletion
  - Test bulk operations
  - _Requirements: 8.1-8.12_

- [x] 5. Enhance gallery controller with full CRUD operations
  - Update `backend/src/controllers/galleryController.ts`
  - Implement GET /api/gallery with filtering, pagination
  - Implement GET /api/gallery/:id for image detail
  - Implement POST /api/admin/gallery for image upload (admin only)
  - Implement PUT /api/admin/gallery/:id for image updates (admin only)
  - Implement DELETE /api/admin/gallery/:id for image deletion (admin only)
  - Implement POST /api/admin/gallery/bulk for bulk operations (admin only)
  - Add category and tag filtering
  - Add featured images endpoint
  - _Requirements: 7.1-7.8, 12.1-12.14, 13.1-13.10_

- [ ]* 5.1 Write integration tests for gallery API endpoints
  - Test gallery listing with filters
  - Test image upload with valid files
  - Test image upload with invalid files
  - Test image metadata updates
  - Test image deletion
  - Test bulk operations
  - _Requirements: 12.1-12.14_

- [x] 6. Enhance homepage content controller
  - Update `backend/src/controllers/homeController.ts`
  - Implement GET /api/home for public homepage content
  - Implement PUT /api/admin/home for content updates (admin only)
  - Implement section-specific update endpoints
  - Add publish/unpublish functionality
  - Add validation for all content sections
  - _Requirements: 14.1-14.16_

- [ ]* 6.1 Write integration tests for homepage API endpoints
  - Test content retrieval
  - Test content updates with valid data
  - Test content updates with invalid data
  - Test publish/unpublish operations
  - _Requirements: 14.1-14.16_

- [x] 7. Implement media library service and controller
  - Create `backend/src/services/mediaLibraryService.ts`
  - Create `backend/src/controllers/mediaLibraryController.ts`
  - Implement GET /api/admin/media for listing all media
  - Implement DELETE /api/admin/media/:id for media deletion
  - Implement PUT /api/admin/media/:id/replace for media replacement
  - Add search and filtering by type, category, date
  - Add storage usage calculation
  - Track media references in products and content
  - _Requirements: 15.1-15.12_

- [x] 8. Checkpoint - Backend API validation
  - Run all backend tests
  - Test all API endpoints with Postman or similar tool
  - Verify authentication and authorization work correctly
  - Verify file uploads to Cloudinary work
  - Ensure all tests pass, ask the user if questions arise.

### Phase 2: Frontend Public Pages

- [x] 9. Implement product catalog page
  - Create `frontend/src/app/(public)/produits/page.tsx`
  - Implement grid and list view layouts
  - Implement responsive grid (4 cols desktop, 2 tablet, 1 mobile)
  - Display product cards with image, name, short description, category, price
  - Implement lazy loading for images using next/image
  - Implement pagination with 12 products per page
  - Add view toggle button (grid/list)
  - _Requirements: 1.1-1.6_

- [x] 10. Implement product filter system
  - Create `frontend/src/components/public/ProductFilters.tsx`
  - Add category filter dropdown
  - Add subcategory filter (dynamic based on category)
  - Add price range inputs (min/max)
  - Add materials checkboxes
  - Add availability status filter
  - Add tags checkboxes
  - Implement "Clear All Filters" button
  - Display active filter count
  - Update URL query parameters on filter change
  - _Requirements: 2.1-2.10_

- [x] 11. Implement product search functionality
  - Create `frontend/src/components/public/ProductSearch.tsx`
  - Add search input with minimum 2 characters
  - Implement debounced search (300ms delay)
  - Display search results with highlighted terms
  - Show "No results" message with suggestions
  - Combine search with active filters
  - _Requirements: 3.1-3.6_

- [x] 12. Implement product sorting
  - Add sort dropdown to product catalog
  - Implement sort options: newest, price-asc, price-desc, featured
  - Maintain sort selection across filter changes
  - Update URL query parameters on sort change
  - _Requirements: 4.1-4.4_

- [x] 13. Implement product detail page
  - Create `frontend/src/app/(public)/produits/[slug]/page.tsx`
  - Display product name, full description, specifications
  - Implement image gallery with thumbnails
  - Display dimensions, materials, finishes
  - Display price with currency and availability status
  - Add video player if video exists
  - Implement "Similar Products" section (4 products)
  - Add call-to-action button linking to contact page
  - Implement SEO meta tags (title, description, Open Graph)
  - Add structured data markup for Product schema
  - _Requirements: 5.1-5.12, 23.1-23.4_

- [x] 14. Implement lightbox component
  - Create `frontend/src/components/ui/Lightbox.tsx`
  - Display full-size images in overlay
  - Add navigation arrows for multiple images
  - Add keyboard navigation (arrow keys, escape)
  - Implement zoom functionality
  - Add touch gesture support (swipe, pinch-to-zoom)
  - Close on overlay click or escape key
  - _Requirements: 5.3-5.5, 7.3_

- [ ]* 14.1 Write unit tests for lightbox component
  - Test keyboard navigation
  - Test image navigation
  - Test close functionality
  - _Requirements: 5.3-5.5_

- [x] 15. Implement gallery page
  - Create `frontend/src/app/(public)/galerie/page.tsx`
  - Implement masonry layout using CSS Grid or library
  - Display images with title and category on hover
  - Implement lazy loading for images
  - Add category filter
  - Add tag filter
  - Open lightbox on image click
  - _Requirements: 7.1-7.8_

- [x] 16. Add featured products to homepage
  - Update `frontend/src/app/(public)/page.tsx`
  - Create "Featured Products" section component
  - Display up to 6 featured products
  - Show product image, name, short description, price
  - Add "View All Products" link
  - _Requirements: 6.1-6.4_

- [x] 17. Add featured gallery to homepage
  - Update homepage with "Featured Realizations" section
  - Display up to 12 featured gallery images
  - Implement masonry layout
  - Open lightbox on image click
  - _Requirements: 7.8_

- [x] 18. Checkpoint - Public pages validation
  - Test all public pages on mobile, tablet, desktop
  - Verify responsive layouts work correctly
  - Test filtering, search, and sorting
  - Verify lazy loading works
  - Test lightbox functionality
  - Ensure all tests pass, ask the user if questions arise.

### Phase 3: Frontend Admin Dashboard

- [x] 19. Set up admin layout and navigation
  - Update `frontend/src/app/admin/layout.tsx`
  - Add admin navigation sidebar with links to all sections
  - Add user profile dropdown with logout
  - Implement responsive navigation (drawer on mobile)
  - Add breadcrumb navigation
  - _Requirements: 8.1, 12.1, 14.1_

- [x] 20. Implement admin dashboard analytics
  - Update `frontend/src/app/admin/dashboard/page.tsx`
  - Display total products count
  - Display featured products count
  - Display products breakdown by category
  - Display total gallery images count
  - Display featured gallery images count
  - Display recent uploads (last 10 items)
  - Display total storage usage
  - Create data fetching hooks for analytics
  - _Requirements: 16.1-16.9_

- [ ]* 20.1 Write unit tests for analytics dashboard
  - Test data display with mock data
  - Test loading states
  - Test error states
  - _Requirements: 16.1-16.9_

- [x] 21. Implement product manager - list view
  - Create `frontend/src/app/admin/products/page.tsx`
  - Display products table with columns: image, name, category, price, availability, featured, actions
  - Add search input
  - Add filter dropdowns (category, availability, featured)
  - Add pagination controls
  - Add "Create Product" button
  - Add checkboxes for bulk selection
  - Add "Select All" checkbox
  - Display bulk actions menu when items selected
  - _Requirements: 8.1-8.4, 11.1-11.3_

- [x] 22. Implement product manager - create/edit form
  - _Requirements: 8.5-8.12_

- [x] 22.1 Set up form validation schema and basic form structure
  - Install React Hook Form and Zod dependencies
  - Create Zod validation schema for product form
  - Create shared form component or hook for product form logic
  - Set up form state management with React Hook Form
  - _Requirements: 8.5-8.12_

- [x] 22.2 Create product creation page with basic fields
  - Create `frontend/src/app/admin/products/new/page.tsx`
  - Add form fields: name, slug, category, subcategory
  - Add short description textarea
  - Add full description textarea (rich text editor in task 43)
  - Implement auto-generate slug from name
  - Display validation errors inline
  - _Requirements: 8.5-8.12_

- [x] 22.3 Add dynamic array inputs (specifications, materials, finishes, tags)
  - Add specifications key-value pairs with add/remove buttons
  - Add materials array input with add/remove buttons
  - Add finishes array input with add/remove buttons
  - Add tags input with add/remove buttons
  - _Requirements: 8.5-8.12_

- [x] 22.4 Add dimensions, price, and product settings fields
  - Add dimensions inputs (length, width, height, unit)
  - Add price inputs (amount, currency, unit)
  - Add availability dropdown
  - Add featured checkbox
  - Add SEO fields (title, description) with auto-generation
  - _Requirements: 8.5-8.12_

- [x] 22.5 Implement form submission and create product edit page
  - _Requirements: 8.5-8.12_

- [x] 22.5.1 Verify and enhance form submission in new page
  - Ensure proper data preparation for API
  - Verify success/error handling
  - Test redirect to products list after success
  - Verify loading state during submission
  - _Requirements: 8.5-8.12_

- [x] 22.5.2 Create product edit page structure
  - Create `frontend/src/app/admin/products/[id]/edit/page.tsx`
  - Copy structure from new page
  - Update title to "Modifier le produit"
  - Update breadcrumb for edit mode
  - Update submit button text to "Enregistrer les modifications"
  - _Requirements: 8.5-8.12_

- [x] 22.5.3 Implement data loading for edit page
  - Fetch product by ID on mount
  - Show loading spinner while fetching
  - Handle errors (404, network errors)
  - Populate all form fields with existing data
  - _Requirements: 8.5-8.12_

- [x] 22.5.4 Implement form submission for edit page
  - Handle PUT request to /api/admin/products/:id
  - Show success/error notifications
  - Redirect to products list after success
  - Test complete edit workflow
  - _Requirements: 8.5-8.12_
  - Show success/error notifications
  - Redirect to products list after success
  - Create `frontend/src/app/admin/products/[id]/edit/page.tsx`
  - Load existing product data for edit page
  - Handle form submission to PUT /api/admin/products/:id
  - _Requirements: 8.5-8.12_

- [ ]* 22.1 Write unit tests for product form
  - Test form validation
  - Test auto-generation of slug and SEO fields
  - Test form submission
  - _Requirements: 8.5-8.12_

- [x] 23. Implement product image management
  - Create `frontend/src/components/admin/ProductImageManager.tsx`
  - Add drag-and-drop upload zone
  - Add file input for multiple image selection
  - Display image preview thumbnails
  - Implement drag-and-drop reordering
  - Add "Set as Primary" button for each image
  - Add alt text input for each image
  - Add delete button for each image
  - Validate file types (jpg, png, webp)
  - Validate file sizes (max 10MB)
  - Display upload progress
  - Show validation errors
  - _Requirements: 9.1-9.12_

- [x] 24. Implement product video management
  - Create `frontend/src/components/admin/ProductVideoManager.tsx`
  - Add video upload input
  - Add video URL input option
  - Display video thumbnail with play icon
  - Add delete button
  - Validate file types (mp4, webm)
  - Validate file size (max 100MB)
  - Display upload progress
  - _Requirements: 10.1-10.8_

- [x] 25. Implement product bulk operations
  - Create `frontend/src/components/admin/ProductBulkActions.tsx`
  - Add bulk actions dropdown: Delete, Feature, Unfeature, Change Category
  - Implement confirmation dialog for destructive actions
  - Implement category selection dialog for "Change Category"
  - Execute bulk operations via API
  - Show success/error notifications
  - Refresh product list after operations
  - _Requirements: 11.4-11.10_

- [x] 26. Checkpoint - Product management validation
  - Test product creation with all fields
  - Test product editing
  - Test product deletion
  - Test image upload and management
  - Test video upload
  - Test bulk operations
  - Verify validation works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 27. Implement gallery manager - list view
  - Create `frontend/src/app/admin/gallery/page.tsx`
  - Display images in grid layout
  - Add search input
  - Add filter dropdowns (category, featured)
  - Add pagination controls
  - Add "Upload Images" button
  - Add checkboxes for bulk selection
  - Add "Select All" checkbox
  - Display bulk actions menu when items selected
  - _Requirements: 12.1-12.3, 13.1-13.3_

- [x] 28. Implement gallery manager - upload interface
  - Create `frontend/src/app/admin/gallery/upload/page.tsx`
  - Add drag-and-drop upload zone for multiple files
  - Add file input for multiple image selection
  - Display upload queue with progress bars
  - Validate file types (jpg, png, webp)
  - Validate file sizes (max 10MB per image)
  - Show validation errors
  - Upload images to Cloudinary via API
  - Redirect to edit page after upload
  - _Requirements: 12.2-12.12_

- [x] 29. Implement gallery manager - edit form
  - Create `frontend/src/app/admin/gallery/[id]/edit/page.tsx`
  - Add form fields: title, description, category, tags, alt text
  - Add featured checkbox
  - Add sort order input
  - Display image preview
  - Implement form validation
  - Display validation errors inline
  - Auto-generate alt text from title if not provided
  - _Requirements: 12.5-12.7, 12.14_

- [x] 30. Implement gallery bulk operations
  - Create `frontend/src/components/admin/GalleryBulkActions.tsx`
  - Add bulk actions dropdown: Delete, Feature, Unfeature, Change Category
  - Implement confirmation dialog for destructive actions
  - Implement category selection dialog
  - Execute bulk operations via API
  - Show success/error notifications
  - Refresh gallery list after operations
  - _Requirements: 13.4-13.10_

- [x] 31. Implement gallery drag-and-drop reordering
  - Add drag-and-drop functionality to gallery list view
  - Update sort order on drop
  - Save new order to API
  - Show visual feedback during drag
  - _Requirements: 12.13_

- [x] 32. Checkpoint - Gallery management validation
  - Test image upload (single and multiple)
  - Test image editing
  - Test image deletion
  - Test bulk operations
  - Test drag-and-drop reordering
  - Verify validation works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 33. Implement homepage editor - hero section
  - Create `frontend/src/app/admin/homepage/hero/page.tsx`
  - Add form fields: title, subtitle, CTA text, CTA link
  - Add background image upload
  - Display preview of hero section
  - Implement form validation
  - Save to API on submit
  - _Requirements: 14.3_

- [x] 34. Implement homepage editor - about section
  - Create `frontend/src/app/admin/homepage/about/page.tsx`
  - Add form fields: title, description, image
  - Add highlights array input (dynamic add/remove/reorder)
  - Display preview of about section
  - Implement form validation
  - Save to API on submit
  - _Requirements: 14.4-14.5_

- [x] 34.1 Create about section page structure and basic form
  - Create `frontend/src/app/admin/homepage/about/page.tsx`
  - Add authentication check and loading states
  - Add header section with title and cancel button
  - Add form fields: title (required, max 200 chars), description (required, max 1000 chars)
  - Add image upload section with preview
  - Implement basic form validation
  - _Requirements: 14.4_

- [x] 34.2 Implement highlights dynamic array management
  - Add highlights section with add/edit/delete functionality
  - Create highlight input with text field (max 200 chars)
  - Add "Add Highlight" button
  - Display highlights list with remove buttons
  - Implement drag-and-drop reordering using @dnd-kit
  - Add empty state when no highlights exist
  - _Requirements: 14.5_

- [x] 34.3 Add preview section and API integration
  - Create preview section showing how about section will appear
  - Display title, description, image, and highlights in preview
  - Implement API integration using homeService.updateContent()
  - Add success notification and redirect after save
  - Add form actions (Cancel, Save Changes)
  - _Requirements: 14.4-14.5_

- [x] 35. Implement homepage editor - services section
  - Create `frontend/src/app/admin/homepage/services/page.tsx`
  - Display list of services with add/edit/delete/reorder
  - Create service form modal with fields: title, description, icon, image
  - Implement drag-and-drop reordering
  - Display preview of services section
  - Implement form validation
  - Save to API on submit
  - _Requirements: 14.6-14.7_

- [x] 36. Implement homepage editor - process section
  - Create `frontend/src/app/admin/homepage/process/page.tsx`
  - Display list of process steps with add/edit/delete/reorder
  - Create process step form modal with fields: step number, title, description, image
  - Implement drag-and-drop reordering
  - Display preview of process section
  - Implement form validation
  - Validate step numbers are sequential
  - Save to API on submit
  - _Requirements: 14.8-14.9_

- [x] 37. Implement homepage editor - testimonials section
  - Create `frontend/src/app/admin/homepage/testimonials/page.tsx`
  - Display list of testimonials with add/edit/delete
  - Create testimonial form modal with fields: name, company, text, rating, image
  - Display preview of testimonials section
  - Implement form validation
  - Save to API on submit
  - _Requirements: 14.10-14.11_

- [x] 38. Implement homepage editor - contact section
  - Create `frontend/src/app/admin/homepage/contact/page.tsx`
  - Add form fields: address, phone, email, WhatsApp, working hours
  - Display preview of contact section
  - Implement form validation (email format, phone format)
  - Save to API on submit
  - _Requirements: 14.12_

- [x] 39. Implement homepage publish/unpublish functionality
  - Add publish/unpublish buttons to each section editor
  - Implement publish state toggle via API
  - Show publish status indicator
  - Display confirmation dialog for unpublish
  - _Requirements: 14.15-14.16_

- [x] 40. Checkpoint - Homepage editor validation
  - Test all section editors
  - Test publish/unpublish functionality
  - Verify previews display correctly
  - Test validation for all fields
  - Ensure all tests pass, ask the user if questions arise.

- [x] 40.1 Test hero section editor
  - Verify form loads with existing data
  - Test title field validation (5-200 chars)
  - Test subtitle field validation (10-500 chars)
  - Test CTA text validation (2-50 chars)
  - Test CTA link validation (required, URL format)
  - Test background image upload
  - Verify preview displays correctly
  - Test form submission success
  - Test form submission with validation errors
  - Test publish/unpublish toggle
  - _Requirements: 14.3, 14.15-14.16_

- [x] 40.2 Test about section editor
  - Verify form loads with existing data
  - Test title field validation (5-200 chars)
  - Test description field validation (50-1000 chars)
  - Test image upload
  - Test highlights add/remove/reorder
  - Test highlights validation (5-200 chars each)
  - Verify preview displays correctly
  - Test form submission success
  - Test form submission with validation errors
  - Test publish/unpublish toggle
  - _Requirements: 14.4-14.5, 14.15-14.16_

- [x] 40.3 Test services section editor
  - Verify form loads with existing data
  - Test add new service modal
  - Test service title validation (5-100 chars)
  - Test service description validation (20-500 chars)
  - Test service icon field (required)
  - Test service image field (optional URL)
  - Test edit service functionality
  - Test delete service functionality
  - Test drag-and-drop reordering
  - Verify preview displays correctly
  - Test form submission success
  - Test publish/unpublish toggle
  - _Requirements: 14.6-14.7, 14.15-14.16_

- [x] 40.4 Test process section editor
  - Verify form loads with existing data
  - Test add new process step modal
  - Test step number auto-generation
  - Test step title validation (5-100 chars)
  - Test step description validation (20-500 chars)
  - Test step image field (required URL)
  - Test edit process step functionality
  - Test delete process step functionality
  - Test drag-and-drop reordering with auto-renumbering
  - Verify preview displays correctly with timeline
  - Test form submission success
  - Test publish/unpublish toggle
  - _Requirements: 14.8-14.9, 14.15-14.16_

- [x] 40.5 Test testimonials section editor
  - Verify form loads with existing data
  - Test add new testimonial modal
  - Test name validation (2-100 chars)
  - Test company validation (2-100 chars)
  - Test text validation (10-500 chars)
  - Test rating selector (1-5 stars)
  - Test image field (optional URL)
  - Test edit testimonial functionality
  - Test delete testimonial functionality
  - Verify preview displays correctly with star ratings
  - Test form submission success
  - Test publish/unpublish toggle
  - _Requirements: 14.10-14.11, 14.15-14.16_

- [x] 40.6 Test contact section editor
  - Verify form loads with existing data
  - Test address validation (10-300 chars)
  - Test phone validation (international format, min 8 digits)
  - Test email validation (valid email format)
  - Test WhatsApp validation (international format, min 8 digits)
  - Test working hours validation (5-200 chars)
  - Verify preview displays correctly with icons
  - Test form submission success
  - Test form submission with validation errors
  - Test publish/unpublish toggle
  - _Requirements: 14.12, 14.15-14.16_

- [x] 40.7 Integration testing and final validation
  - Test navigation between all section editors
  - Verify all sections save independently
  - Test that changes persist after page reload
  - Verify publish/unpublish state consistency
  - Test error handling for network failures
  - Verify loading states display correctly
  - Test responsive design on mobile/tablet/desktop
  - Verify all success/error notifications work
  - Check browser console for errors
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 14.1-14.16_

### Phase 4: Advanced Features

- [x] 41. Implement media library interface
  - Create `frontend/src/app/admin/media/page.tsx`
  - Display all media in grid layout
  - Add search input by filename and tags
  - Add filters: media type (image/video), category, upload date
  - Display media details on hover: filename, size, dimensions, format, date
  - Add delete button with confirmation
  - Add replace button
  - Display total storage usage
  - Implement pagination
  - _Requirements: 15.1-15.12_

- [x] 42. Implement media selection modal
  - Create `frontend/src/components/admin/MediaSelector.tsx`
  - Display media library in modal
  - Add search and filter functionality
  - Allow single or multiple selection
  - Return selected media URLs to parent component
  - Use in product form, gallery form, homepage editor
  - _Requirements: 15.12_

- [x] 43. Implement rich text editor component
  - Create `frontend/src/components/admin/RichTextEditor.tsx`
  - Integrate TipTap or Lexical editor
  - Add toolbar with formatting options: bold, italic, underline, strikethrough
  - Add heading levels (H1, H2, H3)
  - Add lists (ordered, unordered)
  - Add link insertion
  - Add image insertion from media library
  - Add text alignment options
  - Implement undo/redo
  - Save content as HTML
  - Sanitize HTML to prevent XSS
  - _Requirements: 17.1-17.9_

- [ ]* 43.1 Write unit tests for rich text editor
  - Test formatting operations
  - Test HTML sanitization
  - Test undo/redo functionality
  - _Requirements: 17.1-17.9_

- [x] 44. Implement toast notification system
  - Create `frontend/src/components/ui/Toast.tsx`
  - Create toast context and provider
  - Support success, error, warning, info types
  - Auto-dismiss success notifications after 5 seconds
  - Keep error notifications until manually dismissed
  - Display multiple toasts in stack
  - Add close button
  - _Requirements: 24.1-24.8_

- [x] 45. Implement loading states and indicators
  - Create `frontend/src/components/ui/LoadingSpinner.tsx`
  - Create `frontend/src/components/ui/LoadingSkeleton.tsx`
  - Add loading states to all data fetching operations
  - Add loading indicators to form submissions
  - Add progress bars to file uploads
  - _Requirements: 24.5_

- [x] 46. Implement error handling and error pages
  - Create `frontend/src/app/error.tsx` for error boundary
  - Create `frontend/src/app/not-found.tsx` for 404 errors
  - Display user-friendly error messages
  - Add navigation options on error pages
  - Log errors to backend
  - _Requirements: 24.9-24.10_

- [x] 47. Implement confirmation dialogs
  - Create `frontend/src/components/ui/ConfirmDialog.tsx`
  - Use for all destructive actions (delete, unpublish)
  - Display action description and consequences
  - Add "Cancel" and "Confirm" buttons
  - Support custom messages and button labels
  - _Requirements: 24.6_

- [x] 48. Checkpoint - Advanced features validation
  - Test media library functionality
  - Test media selector in various contexts
  - Test rich text editor
  - Test toast notifications
  - Test loading states
  - Test error handling
  - Test confirmation dialogs
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Security, Performance, and Accessibility

- [x] 49. Implement rate limiting
  - Add rate limiting middleware to backend
  - Limit upload endpoints to 10 uploads per minute per user
  - Limit login attempts to 5 per minute per IP
  - Return 429 Too Many Requests with retry-after header
  - _Requirements: 18.9, 25.8_

- [x] 50. Implement CSRF protection
  - Add CSRF token generation to backend
  - Include CSRF token in all state-changing requests
  - Validate CSRF tokens on protected endpoints
  - _Requirements: 25.7_

- [x] 51. Implement input validation and sanitization
  - Add server-side validation for all API endpoints
  - Validate required fields, string lengths, numeric ranges
  - Validate email and URL formats
  - Validate enum values
  - Validate unique constraints
  - Sanitize all text inputs to prevent XSS
  - Return 400 Bad Request with detailed errors
  - _Requirements: 26.1-26.10_

- [ ]* 51.1 Write integration tests for validation
  - Test validation for all API endpoints
  - Test XSS prevention
  - Test SQL injection prevention
  - _Requirements: 26.1-26.10_

- [x] 52. Implement audit trail logging
  - Add createdBy and updatedBy fields tracking
  - Log all destructive operations with user and timestamp
  - Create audit log collection in MongoDB
  - Add audit log viewing in admin dashboard
  - _Requirements: 27.1-27.8_

- [x] 53. Optimize database queries and indexing
  - Verify all indexes are created (already defined in models)
  - Add compound indexes for common query patterns
  - Implement query result caching where appropriate
  - Monitor slow queries and optimize
  - _Requirements: 29.1-29.10_

- [x] 54. Implement image lazy loading and optimization
  - Use next/image for all images with lazy loading
  - Configure Cloudinary loader for next/image
  - Implement blur placeholders for images
  - Use WebP format with JPEG fallback
  - Implement responsive images with srcset
  - _Requirements: 1.5, 7.7, 19.5-19.6, 22.4_

- [x] 55. Implement code splitting and performance optimization
  - Configure route-based code splitting (already done by Next.js)
  - Implement dynamic imports for heavy components
  - Add bundle analyzer to identify large dependencies
  - Optimize bundle size
  - Implement browser caching headers
  - Implement API response compression (gzip/brotli)
  - _Requirements: 22.5-22.10_

- [x] 56. Implement accessibility features
  - Add alt text to all images
  - Add ARIA labels to interactive elements without visible text
  - Ensure keyboard navigation works for all interactive elements
  - Add visible focus indicators
  - Verify color contrast ratios (4.5:1 for normal text, 3:1 for large text)
  - Add skip navigation links
  - Associate labels with form inputs using for/id
  - Provide descriptive error messages
  - Use semantic HTML elements (header, nav, main, article, aside, footer)
  - _Requirements: 21.1-21.10_

- [ ]* 56.1 Write accessibility tests
  - Test keyboard navigation
  - Test screen reader compatibility
  - Test color contrast
  - Test ARIA labels
  - _Requirements: 21.1-21.10_

- [x] 57. Implement responsive design refinements
  - Test all pages on mobile (320px-767px)
  - Test all pages on tablet (768px-1023px)
  - Test all pages on desktop (1024px+)
  - Ensure filter system collapses to drawer on mobile
  - Ensure navigation collapses to hamburger on mobile
  - Ensure lightbox supports touch gestures
  - Ensure galleries support swipe gestures
  - Ensure forms have comfortable touch targets
  - Ensure no horizontal scrolling on any viewport
  - _Requirements: 20.1-20.10_

- [x] 58. Implement SEO optimization
  - Add meta title and description to all public pages
  - Add Open Graph tags to product detail pages
  - Add structured data markup (Product schema) to product pages
  - Add canonical URLs to all pages
  - Generate XML sitemap
  - Generate robots.txt
  - Ensure semantic HTML structure with proper heading hierarchy
  - Ensure all pages have unique titles and descriptions
  - _Requirements: 23.1-23.10_

- [x] 59. Checkpoint - Security, performance, and accessibility validation
  - Run security audit (npm audit)
  - Test rate limiting
  - Test CSRF protection
  - Test input validation and sanitization
  - Run Lighthouse performance audit (target: 90+ score)
  - Run Lighthouse accessibility audit (target: 90+ score)
  - Test responsive design on real devices
  - Verify SEO meta tags
  - Ensure all tests pass, ask the user if questions arise.

### Phase 6: Testing and Documentation

- [ ] 60. Write comprehensive API documentation
  - Document all API endpoints with request/response examples
  - Document authentication requirements
  - Document error responses
  - Document rate limits
  - Create Postman collection or OpenAPI spec
  - _Requirements: All API-related requirements_

- [ ]* 61. Write end-to-end tests for critical user flows
  - Test product browsing and filtering flow
  - Test product detail viewing flow
  - Test admin login flow
  - Test product creation flow
  - Test image upload flow
  - Test gallery browsing flow
  - _Requirements: All user-facing requirements_

- [ ] 62. Write deployment documentation
  - Document environment variables required
  - Document Cloudinary setup steps
  - Document MongoDB setup and indexing
  - Document Docker deployment steps
  - Document production build process
  - _Requirements: 30.1-30.10_

- [ ] 63. Write user guide for admin dashboard
  - Document how to create products
  - Document how to manage gallery
  - Document how to edit homepage content
  - Document how to use media library
  - Document bulk operations
  - Add screenshots and examples
  - _Requirements: All admin-related requirements_

- [ ] 64. Final checkpoint - Complete system validation
  - Run full test suite (unit, integration, e2e)
  - Test all features end-to-end
  - Verify all requirements are met
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on multiple devices (mobile, tablet, desktop)
  - Perform load testing
  - Review code quality and refactor if needed
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation uses TypeScript for both frontend and backend
- All file uploads are handled through Cloudinary CDN
- Authentication is handled via JWT tokens (already implemented)
- The system builds on existing models and infrastructure
- Focus on security, performance, and accessibility throughout implementation
- Test coverage is important but optional tasks can be deferred to post-MVP
