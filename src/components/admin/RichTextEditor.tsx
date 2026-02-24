import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_h5]:text-base [&_h5]:font-medium [&_h5]:mb-1 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:mb-1 [&_h6]:uppercase',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      const alt = window.prompt('Enter image alt text (for SEO):') || '';
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children,
    title
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-8 w-8 p-0',
        isActive && 'bg-primary/10 text-primary'
      )}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="border border-input rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-secondary/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          isActive={editor.isActive('heading', { level: 4 })}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          isActive={editor.isActive('heading', { level: 5 })}
          title="Heading 5"
        >
          <Heading5 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          isActive={editor.isActive('heading', { level: 6 })}
          title="Heading 6"
        >
          <Heading6 className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={addImage}
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="flex-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
