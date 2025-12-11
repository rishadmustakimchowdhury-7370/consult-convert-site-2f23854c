import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Palette,
  Highlighter,
  Upload,
  Loader2,
  ExternalLink,
  X,
} from 'lucide-react';

interface AdvancedRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E',
];

const HIGHLIGHT_COLORS = [
  '#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047',
  '#ECFCCB', '#D9F99D', '#BEF264', '#A3E635',
  '#CFFAFE', '#A5F3FC', '#67E8F9', '#22D3EE',
  '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6',
];

export default function AdvancedRichTextEditor({ content, onChange, placeholder }: AdvancedRichTextEditorProps) {
  const { toast } = useToast();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-secondary/50 rounded-lg p-4 font-mono text-sm overflow-x-auto',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
        allowBase64: true,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your blog content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Error', description: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File size must be less than 5MB.', variant: 'destructive' });
      return;
    }

    setImageUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = `blog-content/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      setImageUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
    setImageUrl(urlData.publicUrl);
    setImageUploading(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const insertLink = useCallback(() => {
    if (!linkUrl) return;
    
    if (linkNewTab) {
      editor?.chain().focus().setLink({ href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }).run();
    } else {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    
    setLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl, linkNewTab]);

  const insertImage = useCallback(() => {
    if (!imageUrl) return;
    
    editor?.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
    setImageDialogOpen(false);
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
    setLinkDialogOpen(false);
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children,
    title
  }: { 
    onClick: () => void; 
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 p-0',
        isActive && 'bg-primary/10 text-primary'
      )}
      title={title}
    >
      {children}
    </Button>
  );

  const ToolbarDivider = () => <Separator orientation="vertical" className="h-6 mx-1" />;

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-secondary/20">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" title="Headings">
              <Heading1 className="w-4 h-4" />
              <span className="text-xs">Headings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1">
            <div className="space-y-1">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <Button
                  key={level}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'w-full justify-start',
                    editor.isActive('heading', { level }) && 'bg-primary/10'
                  )}
                  onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
                >
                  <span className={`font-bold ${level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : level === 3 ? 'text-base' : 'text-sm'}`}>
                    H{level}
                  </span>
                  <span className="ml-2 text-muted-foreground text-xs">Heading {level}</span>
                </Button>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => editor.chain().focus().setParagraph().run()}
              >
                <span className="text-sm">Normal text</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Color">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <Label className="text-xs mb-2 block">Text Color</Label>
            <div className="grid grid-cols-8 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className="w-5 h-5 rounded border border-input hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Remove color
            </Button>
          </PopoverContent>
        </Popover>

        {/* Background Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Highlight">
              <Highlighter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <Label className="text-xs mb-2 block">Highlight Color</Label>
            <div className="grid grid-cols-4 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-input hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Remove highlight
            </Button>
          </PopoverContent>
        </Popover>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Blockquote & Code */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href || '';
            setLinkUrl(previousUrl);
            setLinkDialogOpen(true);
          }}
          isActive={editor.isActive('link')}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton onClick={() => setImageDialogOpen(true)} title="Insert Image">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px]" />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="link-new-tab"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="link-new-tab" className="flex items-center gap-1 cursor-pointer">
                <ExternalLink className="w-3 h-3" /> Open in new tab
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            {editor?.isActive('link') && (
              <Button variant="destructive" onClick={removeLink}>
                <X className="w-4 h-4 mr-1" /> Remove Link
              </Button>
            )}
            <Button onClick={insertLink} disabled={!linkUrl}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-muted-foreground text-sm">or</span>
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> Upload from Computer</>
                )}
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Alt Text (for SEO)</Label>
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image for SEO and accessibility"
              />
              <p className="text-xs text-muted-foreground">
                Describe the image content for better search engine visibility
              </p>
            </div>
            {imageUrl && (
              <div className="border rounded-lg p-2">
                <img src={imageUrl} alt={imageAlt} className="max-h-32 mx-auto rounded" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={insertImage} disabled={!imageUrl}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
