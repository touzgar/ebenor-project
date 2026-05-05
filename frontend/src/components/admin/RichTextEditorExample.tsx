'use client';

import { useState, useRef } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { MediaSelector } from './MediaSelector';
import { useMediaSelector } from '@/hooks/useMediaSelector';

/**
 * Example component demonstrating how to use RichTextEditor
 * 
 * This component shows:
 * 1. Basic rich text editing
 * 2. Integration with MediaSelector for image insertion
 * 3. Form submission with HTML content
 */
export function RichTextEditorExample() {
  const [content, setContent] = useState<string>('');
  const [savedContent, setSavedContent] = useState<string>('');
  const editorRef = useRef<any>(null);

  // Media selector for image insertion
  const mediaSelector = useMediaSelector({
    multiple: false,
    mediaType: 'image',
    onSelect: (media) => {
      // Insert selected image into editor
      const imageUrl = media as string;
      if (editorRef.current?.insertImageUrl) {
        editorRef.current.insertImageUrl(imageUrl);
      }
    },
  });

  const handleSave = () => {
    setSavedContent(content);
    alert('Contenu sauvegardé !');
  };

  const handleClear = () => {
    setContent('');
    setSavedContent('');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Rich Text Editor Example
        </h1>
        <p className="text-neutral-600">
          Full-featured WYSIWYG editor with media library integration
        </p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Editor</h2>
        
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Commencez à écrire votre contenu ici..."
          minHeight="300px"
          maxHeight="600px"
          onImageInsert={mediaSelector.open}
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Sauvegarder
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Effacer
          </button>
        </div>
      </div>

      {/* HTML Output */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">HTML Output</h2>
        <div className="bg-neutral-50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-neutral-700 whitespace-pre-wrap break-words">
            {content || '<p>Le HTML apparaîtra ici...</p>'}
          </pre>
        </div>
      </div>

      {/* Preview */}
      {savedContent && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Preview (Saved Content)</h2>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: savedContent }}
          />
        </div>
      )}

      {/* Features List */}
      <div className="bg-neutral-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-neutral-900 mb-2">Text Formatting</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Bold (Ctrl+B)</li>
              <li>✓ Italic (Ctrl+I)</li>
              <li>✓ Underline (Ctrl+U)</li>
              <li>✓ Strikethrough</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-2">Headings</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Heading 1 (H1)</li>
              <li>✓ Heading 2 (H2)</li>
              <li>✓ Heading 3 (H3)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-2">Lists</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Bullet List</li>
              <li>✓ Numbered List</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-2">Alignment</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Left Align</li>
              <li>✓ Center Align</li>
              <li>✓ Right Align</li>
              <li>✓ Justify</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-2">Media</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Insert Link</li>
              <li>✓ Insert Image (from Media Library)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-900 mb-2">History</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>✓ Undo (Ctrl+Z)</li>
              <li>✓ Redo (Ctrl+Y)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Code */}
      <div className="bg-neutral-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Usage Code</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              Basic Usage:
            </h3>
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { RichTextEditor } from '@/components/admin/RichTextEditor';

const [content, setContent] = useState<string>('');

<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="Start writing..."
  minHeight="300px"
  maxHeight="600px"
/>`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              With Media Library Integration:
            </h3>
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { useMediaSelector } from '@/hooks/useMediaSelector';

const [content, setContent] = useState<string>('');
const editorRef = useRef<any>(null);

const mediaSelector = useMediaSelector({
  multiple: false,
  mediaType: 'image',
  onSelect: (media) => {
    const imageUrl = media as string;
    if (editorRef.current?.insertImageUrl) {
      editorRef.current.insertImageUrl(imageUrl);
    }
  },
});

<RichTextEditor
  ref={editorRef}
  content={content}
  onChange={setContent}
  onImageInsert={mediaSelector.open}
/>

<MediaSelector {...mediaSelector.selectorProps} />`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">
              In a Form:
            </h3>
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { RichTextEditor, sanitizeHtml } from '@/components/admin/RichTextEditor';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Sanitize HTML before sending to API
  const sanitizedContent = sanitizeHtml(content);
  
  await api.post('/products', {
    name: productName,
    description: sanitizedContent, // Safe HTML
  });
};

<form onSubmit={handleSubmit}>
  <RichTextEditor
    content={content}
    onChange={setContent}
  />
  <button type="submit">Save Product</button>
</form>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Media Selector */}
      <MediaSelector
        {...mediaSelector.selectorProps}
        title="Select Image for Editor"
      />
    </div>
  );
}
