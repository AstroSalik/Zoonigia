-- Add blog approval workflow fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_bio TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS admin_feedback TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR REFERENCES users(id);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

-- Update the status column comment to reflect new statuses
COMMENT ON COLUMN blog_posts.status IS 'draft, under_review, published, rejected, scheduled, archived';

-- Update publishedAt to allow null (only set when actually published)
ALTER TABLE blog_posts ALTER COLUMN published_at DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN published_at DROP DEFAULT;

