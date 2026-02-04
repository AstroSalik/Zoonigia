-- Quick Database Fix for Image Display
-- Copy and paste these SQL commands into your PostgreSQL client or Drizzle Studio

-- Update Quantum Computing Course
UPDATE courses 
SET 
  image_url = '/attached_assets/quantum-computing-banner.png',
  is_featured = true,
  featured_order = 1,
  updated_at = NOW()
WHERE id = 1 OR title LIKE '%Quantum Computing%';

-- Update Advanced Robotics & AI Course  
UPDATE courses
SET
  image_url = '/attached_assets/download (5).jpeg',
  is_featured = true,
  featured_order = 2,
  updated_at = NOW()
WHERE id = 2 OR title LIKE '%Robotics%';

-- Update Space Science Course
UPDATE courses
SET
  image_url = 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
  is_featured = true,
  featured_order = 3,
  updated_at = NOW()
WHERE id = 3 OR title LIKE '%Space Science%';

-- Update Youth Ideathon Campaign (if exists)
UPDATE campaigns
SET
  image_url = '/attached_assets/youth-ideathon-banner.png',
  is_featured = true,
  featured_order = 1,
  updated_at = NOW()
WHERE id = 1 OR title LIKE '%Ideathon%';

-- Update Figma Campaign (if exists)
UPDATE campaigns
SET
  image_url = '/attached_assets/figma-course-banner.png',
  is_featured = true,
  featured_order = 2,
  updated_at = NOW()
WHERE id = 2 OR title LIKE '%Figma%';

-- Verify the updates
SELECT id, title, image_url, is_featured, featured_order FROM courses ORDER BY featured_order;
SELECT id, title, image_url, is_featured, featured_order FROM campaigns ORDER BY featured_order;

