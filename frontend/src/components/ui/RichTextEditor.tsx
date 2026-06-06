'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TipTapLink from '@tiptap/extension-link'
import TipTapImage from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Extension } from '@tiptap/core'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading2, Heading3,
  Quote, Undo, Redo, Link, Unlink, ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Minus, Code,
  Pilcrow, Type, ChevronDown, Maximize2, Minimize2,
  Palette, Highlighter, Upload,
} from 'lucide-react'
import { useCallback, useState, useRef, useEffect } from 'react'
import { isUrlSafe } from '@/lib/sanitize'
import { uploadImageGetUrl } from '@/lib/media'

/* ── FontSize extension via TextStyle ─────────────────────── */

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }]
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: { chain: () => any }) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }: { chain: () => any }) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

/* ── Preset colors ────────────────────────────────────────── */

const TEXT_COLORS = [
  '#000000', '#374151', '#6B7280', '#EF4444', '#F97316',
  '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899',
  '#0EA5E9', '#14B8A6', '#7C3AED', '#BE123C', '#065F46', '#7F1D1D',
]

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#BBF7D0', '#BFDBFE', '#FED7AA', '#FBCFE8',
  '#E9D5FF', '#A7F3D0', '#FCA5A5',
]

const FONT_SIZES = [
  { label: 'Nhỏ', value: '13px' },
  { label: 'Bình thường', value: null },
  { label: 'Lớn', value: '18px' },
  { label: 'Rất lớn', value: '22px' },
  { label: 'Tiêu đề nhỏ', value: '26px' },
]

/* ── Toolbar Button ─────────────────────────────────────────── */

function Btn({
  onClick, active, disabled, title, children, className = '',
}: {
  onClick: () => void; active?: boolean; disabled?: boolean
  title: string; children: React.ReactNode; className?: string
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`flex h-7 min-w-7 items-center justify-center rounded transition-colors ${
        active ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
      } disabled:opacity-25 disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>
  )
}

function Sep() {
  return <div className="mx-1 h-5 w-px bg-stone-200" />
}

/* ── Format / Block Type Dropdown ───────────────────────────── */

const BLOCK_TYPES = [
  { label: 'Đoạn văn', value: 'paragraph', icon: Pilcrow },
  { label: 'Tiêu đề 2', value: 'h2', icon: Heading2 },
  { label: 'Tiêu đề 3', value: 'h3', icon: Heading3 },
  { label: 'Trích dẫn', value: 'blockquote', icon: Quote },
  { label: 'Code', value: 'codeBlock', icon: Code },
] as const

function FormatDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function currentLabel() {
    if (editor.isActive('heading', { level: 2 })) return 'Tiêu đề 2'
    if (editor.isActive('heading', { level: 3 })) return 'Tiêu đề 3'
    if (editor.isActive('blockquote')) return 'Trích dẫn'
    if (editor.isActive('codeBlock')) return 'Code'
    return 'Đoạn văn'
  }

  function apply(value: string) {
    setOpen(false)
    switch (value) {
      case 'paragraph': editor.chain().focus().setParagraph().run(); break
      case 'h2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break
      case 'h3': editor.chain().focus().toggleHeading({ level: 3 }).run(); break
      case 'blockquote': editor.chain().focus().toggleBlockquote().run(); break
      case 'codeBlock': editor.chain().focus().toggleCodeBlock().run(); break
    }
  }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex h-7 items-center gap-1 rounded px-2 text-xs font-medium text-stone-600 hover:bg-stone-100">
        <Type className="h-3.5 w-3.5" />
        <span className="hidden w-[72px] truncate text-left sm:block">{currentLabel()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-xl border border-stone-100 bg-white py-1 shadow-lg">
          {BLOCK_TYPES.map(({ label, value, icon: Icon }) => {
            const isActive =
              (value === 'paragraph' && !editor.isActive('heading') && !editor.isActive('blockquote') && !editor.isActive('codeBlock')) ||
              (value === 'h2' && editor.isActive('heading', { level: 2 })) ||
              (value === 'h3' && editor.isActive('heading', { level: 3 })) ||
              (value === 'blockquote' && editor.isActive('blockquote')) ||
              (value === 'codeBlock' && editor.isActive('codeBlock'))
            return (
              <button key={value} type="button" onClick={() => apply(value)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                  isActive ? 'bg-amber-50 text-amber-700 font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Font Size Dropdown ─────────────────────────────────────── */

function FontSizeDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const currentSize = editor.getAttributes('textStyle').fontSize
  const currentLabel = FONT_SIZES.find(f => f.value === (currentSize || null))?.label || 'Cỡ chữ'

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex h-7 items-center gap-1 rounded px-2 text-xs text-stone-600 hover:bg-stone-100">
        <span className="hidden w-[54px] truncate sm:block">{currentLabel}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-xl border border-stone-100 bg-white py-1 shadow-lg">
          {FONT_SIZES.map(({ label, value }) => (
            <button key={label} type="button"
              onClick={() => {
                setOpen(false)
                if (value) editor.chain().focus().setFontSize(value).run()
                else editor.chain().focus().unsetFontSize().run()
              }}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors ${
                (currentSize || null) === value ? 'bg-amber-50 text-amber-700 font-medium' : 'text-stone-700 hover:bg-stone-50'
              }`}
              style={{ fontSize: value || 'inherit' }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Color Palette Popup ────────────────────────────────────── */

function ColorPicker({
  colors, onSelect, onClear, customPickerRef, label, children,
}: {
  colors: string[]
  onSelect: (color: string) => void
  onClear: () => void
  customPickerRef?: React.RefObject<HTMLInputElement>
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} title={label}
        className="flex h-7 items-center gap-0.5 rounded px-1 text-stone-500 hover:bg-stone-100 hover:text-stone-800">
        {children}
        <ChevronDown className="h-2.5 w-2.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-52 rounded-xl border border-stone-100 bg-white p-3 shadow-lg">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-stone-400">{label}</p>
          <div className="grid grid-cols-8 gap-1">
            {colors.map(color => (
              <button key={color} type="button"
                onClick={() => { onSelect(color); setOpen(false) }}
                className="h-6 w-6 rounded-md border border-stone-200 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color} />
            ))}
          </div>
          {customPickerRef && (
            <div className="mt-2 flex items-center gap-2 border-t border-stone-100 pt-2">
              <label className="flex flex-1 cursor-pointer items-center gap-2 text-xs text-stone-600">
                <input ref={customPickerRef} type="color" className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                  onChange={e => onSelect(e.target.value)} />
                Màu tuỳ chỉnh
              </label>
              <button type="button" onClick={() => { onClear(); setOpen(false) }}
                className="rounded px-2 py-0.5 text-[11px] text-stone-400 hover:bg-stone-50 hover:text-stone-600">
                Bỏ màu
              </button>
            </div>
          )}
          {!customPickerRef && (
            <button type="button" onClick={() => { onClear(); setOpen(false) }}
              className="mt-2 w-full rounded border border-stone-100 py-1 text-xs text-stone-400 hover:bg-stone-50">
              Bỏ highlight
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main Toolbar ───────────────────────────────────────────── */

function Toolbar({
  editor, expanded, onToggleExpand,
}: {
  editor: Editor; expanded: boolean; onToggleExpand: () => void
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const textColorRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const addLink = useCallback(() => {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Nhập URL:', prev || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    if (!isUrlSafe(url)) { alert('URL không hợp lệ. Chỉ chấp nhận http://, https://, mailto:, tel:'); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  async function handleImageFile(file: File) {
    setUploadingImage(true)
    try {
      const url = await uploadImageGetUrl(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      // silent — let user try URL fallback
    } finally {
      setUploadingImage(false)
    }
  }

  const addImageUrl = useCallback(() => {
    const url = window.prompt('Nhập URL hình ảnh:')
    if (!url) return
    if (!isUrlSafe(url)) { alert('URL hình ảnh không hợp lệ'); return }
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const currentTextColor = editor.getAttributes('textStyle').color

  return (
    <div className="border-b border-stone-200 bg-stone-50">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        {/* Format type */}
        <FormatDropdown editor={editor} />
        <Sep />

        {/* Font size */}
        <FontSizeDropdown editor={editor} />
        <Sep />

        {/* Text style */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="In đậm (Ctrl+B)">
          <Bold className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="In nghiêng (Ctrl+I)">
          <Italic className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gạch chân (Ctrl+U)">
          <UnderlineIcon className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Gạch ngang">
          <Strikethrough className="h-3.5 w-3.5" />
        </Btn>
        <Sep />

        {/* Text color */}
        <ColorPicker
          colors={TEXT_COLORS}
          onSelect={color => editor.chain().focus().setColor(color).run()}
          onClear={() => editor.chain().focus().unsetColor().run()}
          customPickerRef={textColorRef as React.RefObject<HTMLInputElement>}
          label="Màu chữ">
          <span className="flex flex-col items-center gap-0.5">
            <Palette className="h-3.5 w-3.5" />
            <span className="h-1 w-3.5 rounded-sm" style={{ backgroundColor: currentTextColor || '#374151' }} />
          </span>
        </ColorPicker>

        {/* Highlight */}
        <ColorPicker
          colors={HIGHLIGHT_COLORS}
          onSelect={color => editor.chain().focus().toggleHighlight({ color }).run()}
          onClear={() => editor.chain().focus().unsetHighlight().run()}
          label="Màu nền (highlight)">
          <Highlighter className="h-3.5 w-3.5" />
        </ColorPicker>
        <Sep />

        {/* Lists */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Danh sách">
          <List className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Danh sách đánh số">
          <ListOrdered className="h-3.5 w-3.5" />
        </Btn>
        <Sep />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Căn trái">
          <AlignLeft className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Căn giữa">
          <AlignCenter className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Căn phải">
          <AlignRight className="h-3.5 w-3.5" />
        </Btn>
        <Sep />

        {/* Link */}
        <Btn onClick={addLink} active={editor.isActive('link')} title="Chèn/sửa liên kết">
          <Link className="h-3.5 w-3.5" />
        </Btn>
        {editor.isActive('link') && (
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Xóa liên kết">
            <Unlink className="h-3.5 w-3.5" />
          </Btn>
        )}
        <Sep />

        {/* Image — upload file hoặc URL */}
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
          onChange={async e => {
            const f = e.target.files?.[0]
            if (f) await handleImageFile(f)
            e.target.value = ''
          }} />
        <Btn
          onClick={() => imageInputRef.current?.click()}
          title={uploadingImage ? 'Đang upload...' : 'Upload ảnh từ máy'}
          disabled={uploadingImage}>
          {uploadingImage
            ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            : <Upload className="h-3.5 w-3.5" />}
        </Btn>
        <Btn onClick={addImageUrl} title="Chèn ảnh từ URL">
          <ImageIcon className="h-3.5 w-3.5" />
        </Btn>

        {/* Divider */}
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang">
          <Minus className="h-3.5 w-3.5" />
        </Btn>
        <Sep />

        {/* Undo / Redo */}
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác (Ctrl+Z)">
          <Undo className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại (Ctrl+Y)">
          <Redo className="h-3.5 w-3.5" />
        </Btn>
        <Sep />

        {/* Expand */}
        <Btn onClick={onToggleExpand} title={expanded ? 'Thu nhỏ' : 'Toàn màn hình'}>
          {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </Btn>
      </div>
    </div>
  )
}

/* ── Word Counter ───────────────────────────────────────────── */

function WordCount({ editor }: { editor: Editor }) {
  const text = editor.getText()
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  return (
    <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-3 py-1.5">
      <span className="text-[11px] text-stone-400">{words} từ · {chars} ký tự</span>
      <span className="text-[11px] text-stone-300">Ctrl+B/I/U · Ctrl+Z hoàn tác</span>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────── */

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Bắt đầu viết nội dung...',
  className = '',
}: {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const isInternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-amber-700 underline cursor-pointer', rel: 'noopener noreferrer' },
        validate: (url) => isUrlSafe(url),
      }),
      TipTapImage.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-4' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      isInternalUpdate.current = true
      onChange(e.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-stone prose-sm max-w-none focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (isInternalUpdate.current) { isInternalUpdate.current = false; return }
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className={`overflow-hidden rounded-xl bg-white ring-1 ring-stone-200 transition-shadow focus-within:ring-2 focus-within:ring-amber-400/60 ${
      expanded ? 'fixed inset-4 z-50 flex flex-col rounded-2xl shadow-2xl' : ''
    } ${className}`}>
      <Toolbar editor={editor} expanded={expanded} onToggleExpand={() => setExpanded(!expanded)} />
      <div className={`overflow-y-auto ${expanded ? 'flex-1' : 'min-h-[200px] max-h-[500px]'}`}>
        <div className="px-4 py-3">
          <EditorContent editor={editor} />
        </div>
      </div>
      <WordCount editor={editor} />
    </div>
  )
}
