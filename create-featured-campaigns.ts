import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { campaigns } from './shared/schema';
import { eq } from 'drizzle-orm';

async function createFeaturedCampaigns() {
  try {
    console.log('\n🎯 Creating Featured Campaigns...\n');

    // Youth Ideathon removed as per production requirements


    // Check if Figma Design Campaign exists
    const existingFigma = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.title, 'Figma Design Sprint'))
      .limit(1);

    if (existingFigma.length === 0) {
      // Create Figma Design Sprint Campaign
      const [figmaCampaign] = await db.insert(campaigns).values({
        title: "Figma Design Sprint",
        description: "Master UI/UX design with Figma. Learn to create stunning interfaces, collaborate with teams, and build professional portfolios. Perfect for aspiring designers and creative technologists.",
        type: "design_challenge",
        field: "Design & Technology",
        duration: "6 weeks",
        startDate: "2025-01-15",
        endDate: "2025-02-28",
        partner: "Zoonigia • Design Community",
        status: "accepting_registrations",
        progress: 30,
        price: "0.00",
        isFree: true,
        isFeatured: true,
        featuredOrder: 2,
        imageUrl: '/attached_assets/figma-course-banner.png',
      }).returning();

      console.log('✅ Created: Figma Design Sprint');
      console.log(`   ID: ${figmaCampaign.id}`);
      console.log(`   Image: ${figmaCampaign.imageUrl}`);
      console.log(`   Featured Order: ${figmaCampaign.featuredOrder}\n`);
    } else {
      // Update it to be featured with correct image
      await db.update(campaigns).set({
        isFeatured: true,
        featuredOrder: 2,
        isFree: true,
        imageUrl: '/attached_assets/figma-course-banner.png',
        updatedAt: new Date()
      }).where(eq(campaigns.id, existingFigma[0].id));

      console.log('✅ Updated: Figma Design Sprint');
      console.log(`   ID: ${existingFigma[0].id}`);
      console.log(`   Set as featured with image\n`);
    }

    // Check if Asteroid Search Campaign exists
    const existingAsteroid = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.title, 'Zoonigia Asteroid Search Campaign'))
      .limit(1);

    if (existingAsteroid.length === 0) {
      // Create Asteroid Search Campaign
      const [asteroidCampaign] = await db.insert(campaigns).values({
        title: "Zoonigia Asteroid Search Campaign",
        description: "Collaborate with NASA Citizen Science and IASC to discover real asteroids and name them officially. Contribute to space science while learning astronomy and research methods.",
        type: "asteroid_search",
        field: "Astronomy",
        duration: "16 weeks",
        startDate: "2025-08-17",
        endDate: "2025-11-23",
        partner: "NASA • IASC • University of Hawaii",
        status: "accepting_registrations",
        progress: 20,
        price: "300.00",
        isFree: false,
        isFeatured: true,
        featuredOrder: 3,
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      }).returning();

      console.log('✅ Created: Zoonigia Asteroid Search Campaign');
      console.log(`   ID: ${asteroidCampaign.id}`);
      console.log(`   Image: ${asteroidCampaign.imageUrl}`);
      console.log(`   Featured Order: ${asteroidCampaign.featuredOrder}\n`);
    } else {
      // Update it to be featured
      await db.update(campaigns).set({
        isFeatured: true,
        featuredOrder: 3,
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        updatedAt: new Date()
      }).where(eq(campaigns.id, existingAsteroid[0].id));

      console.log('✅ Updated: Zoonigia Asteroid Search Campaign');
      console.log(`   ID: ${existingAsteroid[0].id}`);
      console.log(`   Set as featured with image\n`);
    }

    // Verify the featured campaigns
    console.log('\n📊 Featured Campaigns (in order):\n');
    const featuredCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.isFeatured, true))
      .orderBy(campaigns.featuredOrder);

    featuredCampaigns.forEach((c, i) => {
      console.log(`${i + 1}. ${c.title}`);
      console.log(`   Order: ${c.featuredOrder}`);
      console.log(`   Image: ${c.imageUrl}`);
      console.log(`   Price: ${c.isFree ? 'FREE' : '₹' + c.price}`);
      console.log('');
    });

    console.log('✅ All featured campaigns created/updated!\n');
    console.log('🔄 Please refresh your browser to see the changes.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createFeaturedCampaigns();

