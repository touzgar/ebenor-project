'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListBulletIcon,
  ListNumberedIcon,
  LinkIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  onImageInsert?: () => void; // Callback to open media selector
  disabled?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Commencez à écrire...',
  minHeight = '200px',
  maxHeight = '500px',
  onImageInsert,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-600 underline hover:text-amber-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Sanitize HTML to prevent XSS
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'h1',
          'h2',
          'h3',
          'ul',
          'ol',
          'li',
          'a',
          'img',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
      });
      onChange(sanitizedHtml);
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien:', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;

    if (onImageInsert) {
      // Use media selector callback
      onImageInsert();
    } else {
      // Fallback to URL prompt
      const url = window.prompt('URL de l\'image:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }, [editor, onImageInsert]);

  // Public method to insert image (can be called from parent)
  const insertImageUrl = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    [editor]
  );

  // Expose insertImageUrl method to parent
  useEffect(() => {
    if (editor) {
      (editor as any).insertImageUrl = insertImageUrl;
    }
  }, [editor, insertImageUrl]);

  if (!editor) {
    return (
      <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 rounded mb-2"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-amber-100 text-amber-700' : 'text-neutral-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-neutral-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-neutral-300 bg-neutral-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            title="Gras (Ctrl+B)"
          >
            <BoldIcon className="h-5 w-5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            title="Italique (Ctrl+I)"
          >
            <ItalicIcon className="h-5 w-5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Souligné (Ctrl+U)"
          >
            <UnderlineIcon className="h-5 w-5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            title="Barré"
          >
            <StrikethroughIcon className="h-5 w-5" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Titre 1"
          >
            <span className="font-bold text-sm">H1</span>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Titre 2"
          >
            <span className="font-bold text-sm">H2</span>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Titre 3"
          >
            <span className="font-bold text-sm">H3</span>
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Liste à puces"
          >
            <ListBulletIcon className="h-5 w-5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Liste numérotée"
          >
            <ListNumberedIcon className="h-5 w-5" />
          </ToolbarButton>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Aligner à gauche"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h10M4 18h16"
              />
            </svg>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Centrer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M7 12h10M4 18h16"
              />
            </svg>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Aligner à droite"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M10 12h10M4 18h16"
              />
            </svg>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justifier"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </ToolbarButton>
        </div>

        {/* Link and Image */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Insérer un lien"
          >
            <LinkIcon className="h-5 w-5" />
          </ToolbarButton>

          <ToolbarButton onClick={insertImage} title="Insérer une image">
            <PhotoIcon className="h-5 w-5" />
          </ToolbarButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Annuler (Ctrl+Z)"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Rétablir (Ctrl+Y)"
          >
            <ArrowUturnRightIcon className="h-5 w-5" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className="prose prose-sm max-w-none p-4 focus:outline-none overflow-y-auto"
        style={{
          minHeight,
          maxHeight,
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Character Count (Optional) */}
      <div className="border-t border-neutral-300 bg-neutral-50 px-4 py-2 text-xs text-neutral-500 flex justify-between">
        <span>{editor.storage.characterCount?.characters() || 0} caractères</span>
        <span>{editor.storage.characterCount?.words() || 0} mots</span>
      </div>
    </div>
  );
}

// Export a method to get sanitized HTML
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'h1',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'a',
      'img',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
  });
};
