import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, Clock, Tag } from 'lucide-react';

interface BlogPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog: {
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    coverImageAlt: string;
    authorName: string;
    categoryName?: string;
    publishedAt?: Date | null;
  };
}

export default function BlogPreviewDialog({ open, onOpenChange, blog }: BlogPreviewDialogProps) {
  const wordCount = blog.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Blog Preview</DialogTitle>
        </DialogHeader>
        
        <article className="prose prose-sm sm:prose max-w-none">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-xl mb-6">
              <img
                src={blog.coverImage}
                alt={blog.coverImageAlt || blog.title}
                className="w-full h-full object-cover m-0"
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 not-prose">
            {blog.categoryName && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {blog.categoryName}
              </Badge>
            )}
            {blog.authorName && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.authorName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {blog.publishedAt ? format(blog.publishedAt, 'MMM d, yyyy') : format(new Date(), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{blog.title || 'Untitled Post'}</h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-6">
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content yet...</p>' }}
          />
        </article>
      </DialogContent>
    </Dialog>
  );
}
