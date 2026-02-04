import { config } from 'dotenv';
import { resolve } from 'path';
import { db } from './server/db';
import { blogPosts, InsertBlogPost } from './shared/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: resolve(__dirname, '.env') });

interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any;
  categories: number[];
  tags: number[];
  _links: any;
  _embedded?: {
    author?: Array<{ name: string; description: string; avatar_urls?: { [key: string]: string } }>;
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; taxonomy: string }>>;
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

async function fetchWordPressPosts(): Promise<WordPressPost[]> {
  const baseUrl = 'https://zoonigia.wordpress.com/wp-json/wp/v2';
  const perPage = 100; // Maximum per page
  let allPosts: WordPressPost[] = [];
  let page = 1;
  let hasMore = true;

  console.log('📥 Fetching WordPress posts from zoonigia.wordpress.com...');

  while (hasMore) {
    try {
      const url = `${baseUrl}/posts?per_page=${perPage}&page=${page}&_embed=true&status=publish`;
      console.log(`   Fetching page ${page}...`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 400) {
          hasMore = false;
          break;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts: WordPressPost[] = await response.json();
      
      if (posts.length === 0) {
        hasMore = false;
        break;
      }

      allPosts = allPosts.concat(posts);
      console.log(`   ✅ Fetched ${posts.length} posts (Total: ${allPosts.length})`);

      if (posts.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    } catch (error) {
      console.error(`❌ Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }

  return allPosts;
}

async function fetchWordPressCategories(): Promise<Map<number, string>> {
  const baseUrl = 'https://zoonigia.wordpress.com/wp-json/wp/v2';
  const categoryMap = new Map<number, string>();

  try {
    console.log('📥 Fetching WordPress categories...');
    const response = await fetch(`${baseUrl}/categories?per_page=100`);
    if (response.ok) {
      const categories: WordPressCategory[] = await response.json();
      categories.forEach(cat => {
        categoryMap.set(cat.id, cat.name);
      });
      console.log(`   ✅ Fetched ${categories.length} categories`);
    }
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
  }

  return categoryMap;
}

async function fetchWordPressTags(): Promise<Map<number, string>> {
  const baseUrl = 'https://zoonigia.wordpress.com/wp-json/wp/v2';
  const tagMap = new Map<number, string>();

  try {
    console.log('📥 Fetching WordPress tags...');
    const response = await fetch(`${baseUrl}/tags?per_page=100`);
    if (response.ok) {
      const tags: WordPressTag[] = await response.json();
      tags.forEach(tag => {
        tagMap.set(tag.id, tag.name);
      });
      console.log(`   ✅ Fetched ${tags.length} tags`);
    }
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
  }

  return tagMap;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function extractFeaturedImage(post: WordPressPost): string | null {
  // Try to get featured image from _embedded
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  
  // Try to extract from content
  const imgMatch = post.content.rendered.match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch) {
    return imgMatch[1];
  }
  
  return null;
}

function extractAuthorInfo(post: WordPressPost): { name: string; title?: string; imageUrl?: string } {
  if (post._embedded?.author?.[0]) {
    const author = post._embedded.author[0];
    return {
      name: author.name || 'Salik Riyaz',
      title: author.description || undefined,
      imageUrl: author.avatar_urls?.['96'] || undefined
    };
  }
  
  return {
    name: 'Salik Riyaz',
    title: 'Founder & CEO'
  };
}

function extractCategories(post: WordPressPost, categoryMap: Map<number, string>): string[] {
  const categories: string[] = [];
  
  // From embedded terms
  if (post._embedded?.['wp:term']) {
    post._embedded['wp:term'].forEach(termArray => {
      termArray.forEach(term => {
        if (term.taxonomy === 'category' && !categories.includes(term.name)) {
          categories.push(term.name);
        }
      });
    });
  }
  
  // From category IDs
  post.categories.forEach(catId => {
    const catName = categoryMap.get(catId);
    if (catName && !categories.includes(catName)) {
      categories.push(catName);
    }
  });
  
  return categories;
}

function extractTags(post: WordPressPost, tagMap: Map<number, string>): string[] {
  const tags: string[] = [];
  
  // From embedded terms
  if (post._embedded?.['wp:term']) {
    post._embedded['wp:term'].forEach(termArray => {
      termArray.forEach(term => {
        if (term.taxonomy === 'tag' && !tags.includes(term.name)) {
          tags.push(term.name);
        }
      });
    });
  }
  
  // From tag IDs
  post.tags.forEach(tagId => {
    const tagName = tagMap.get(tagId);
    if (tagName && !tags.includes(tagName)) {
      tags.push(tagName);
    }
  });
  
  return tags;
}

async function importWordPressBlogs() {
  try {
    console.log('🚀 Starting WordPress blog import...\n');

    // Fetch data from WordPress
    const [posts, categoryMap, tagMap] = await Promise.all([
      fetchWordPressPosts(),
      fetchWordPressCategories(),
      fetchWordPressTags()
    ]);

    console.log(`\n📊 Found ${posts.length} posts to import\n`);

    if (posts.length === 0) {
      console.log('⚠️  No posts found. Exiting.');
      return;
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const post of posts) {
      try {
        // Check if post already exists by slug
        const existingPosts = await db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.slug, post.slug))
          .limit(1);

        const authorInfo = extractAuthorInfo(post);
        const featuredImage = extractFeaturedImage(post);
        const categories = extractCategories(post, categoryMap);
        const tags = extractTags(post, tagMap);
        const excerpt = stripHtmlTags(post.excerpt.rendered || '');
        
        // Preserve WordPress HTML content exactly as is
        const content = post.content.rendered;

        const blogData: InsertBlogPost = {
          title: post.title.rendered,
          content: content, // Preserve full HTML
          excerpt: excerpt || undefined,
          authorName: authorInfo.name,
          authorTitle: authorInfo.title,
          authorImageUrl: authorInfo.imageUrl,
          publishedAt: new Date(post.date),
          isPublished: true,
          imageUrl: featuredImage || undefined,
          featuredImage: featuredImage || undefined,
          categories: categories.length > 0 ? categories : undefined,
          tags: tags.length > 0 ? tags : undefined,
          slug: post.slug,
          status: 'published',
          seoTitle: post.title.rendered,
          seoDescription: excerpt || undefined,
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
        };

        if (existingPosts.length > 0) {
          // Update existing post
          await db
            .update(blogPosts)
            .set({
              ...blogData,
              updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, existingPosts[0].id));
          
          updated++;
          console.log(`   ✅ Updated: "${post.title.rendered}"`);
        } else {
          // Create new post
          await db.insert(blogPosts).values(blogData);
          imported++;
          console.log(`   ✅ Imported: "${post.title.rendered}"`);
        }
      } catch (error) {
        console.error(`   ❌ Error importing "${post.title.rendered}":`, error);
        skipped++;
      }
    }

    console.log(`\n✨ Import complete!`);
    console.log(`   📥 Imported: ${imported}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${posts.length}\n`);

  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the import
importWordPressBlogs()
  .then(() => {
    console.log('✅ WordPress import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ WordPress import failed:', error);
    process.exit(1);
  });

