# Task 43 - Rich Text Editor Dependencies

## Required TipTap Packages

To implement the rich text editor, the following packages need to be installed:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-placeholder
```

### Package Breakdown:

1. **@tiptap/react** - Core TipTap React integration
2. **@tiptap/starter-kit** - Essential extensions bundle (includes bold, italic, headings, lists, etc.)
3. **@tiptap/extension-link** - Link insertion and editing
4. **@tiptap/extension-image** - Image insertion
5. **@tiptap/extension-text-align** - Text alignment (left, center, right, justify)
6. **@tiptap/extension-underline** - Underline formatting
7. **@tiptap/extension-placeholder** - Placeholder text

### HTML Sanitization:

For XSS prevention, we'll use:
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

## Installation Command

Run this command in the frontend directory:

```bash
cd frontend
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-placeholder dompurify
npm install --save-dev @types/dompurify
```

## Version Compatibility

- TipTap v2.x (latest)
- React 18.x (already installed)
- TypeScript 5.x (already installed)

## Note

The RichTextEditor component has been created and is ready to use once these dependencies are installed.
