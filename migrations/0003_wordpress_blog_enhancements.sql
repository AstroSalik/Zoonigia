-- Migration: Add WordPress-style fields to blog_posts table
-- This migration adds all the WordPress-style fields for enhanced blog functionality

-- Add new columns to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS featured_image VARCHAR(255),
ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Create index on published_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Create index on categories for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_categories ON blog_posts USING GIN(categories);

-- Create index on tags for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Update existing blog posts to have proper status
UPDATE blog_posts 
SET status = CASE 
  WHEN is_published = true THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL;

-- Add constraint to ensure status is valid
ALTER TABLE blog_posts 
ADD CONSTRAINT check_blog_posts_status 
CHECK (status IN ('draft', 'published', 'scheduled', 'archived'));

-- Add comment to document the new fields
COMMENT ON COLUMN blog_posts.excerpt IS 'Brief summary of the blog post';
COMMENT ON COLUMN blog_posts.scheduled_date IS 'When the post should be published (for scheduled posts)';
COMMENT ON COLUMN blog_posts.featured_image IS 'Main image for the blog post';
COMMENT ON COLUMN blog_posts.categories IS 'Array of category names';
COMMENT ON COLUMN blog_posts.tags IS 'Array of tag names';
COMMENT ON COLUMN blog_posts.seo_title IS 'SEO optimized title';
COMMENT ON COLUMN blog_posts.seo_description IS 'SEO meta description';
COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly version of the title';
COMMENT ON COLUMN blog_posts.view_count IS 'Number of times the post has been viewed';
COMMENT ON COLUMN blog_posts.like_count IS 'Number of likes the post has received';
COMMENT ON COLUMN blog_posts.comment_count IS 'Number of comments on the post';
COMMENT ON COLUMN blog_posts.status IS 'Current status of the post: draft, published, scheduled, archived';
