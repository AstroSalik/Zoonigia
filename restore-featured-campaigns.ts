import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses, campaigns } from './shared/schema';
import { eq } from 'drizzle-orm';

async function restoreFeaturedCampaigns() {
  try {
    console.log('\n🔧 Restoring Original Featured Campaigns...\n');

    // First, list all campaigns
    const allCampaigns = await db.select().from(campaigns);
    console.log('📢 Current Campaigns:');
    allCampaigns.forEach(c => {
      console.log(`  ID: ${c.id} - ${c.title}`);
      console.log(`     Image: ${c.imageUrl || '❌ No image'}`);
      console.log(`     Featured: ${c.isFeatured ? '✅' : '❌'}`);
      console.log('');
    });

    // Unfeature all courses first
    await db.update(courses).set({ isFeatured: false, featuredOrder: 0 });
    console.log('✅ Unfeatured all courses\n');

    // Update campaigns to be featured with correct order and images
    console.log('🔄 Updating campaigns to featured...\n');

    // Youth Ideathon
    const youthIdeathon = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, 1))
      .limit(1);

    if (youthIdeathon.length > 0) {
      await db
        .update(campaigns)
        .set({
          imageUrl: '/attached_assets/youth-ideathon-banner.png',
          isFeatured: true,
          featuredOrder: 1,
          updatedAt: new Date()
        })
        .where(eq(campaigns.id, 1));
      console.log(`✅ Featured: ${youthIdeathon[0].title}`);
      console.log(`   Order: 1`);
      console.log(`   Image: /attached_assets/youth-ideathon-banner.png\n`);
    }

    // Figma Course
    const figmaCourse = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, 2))
      .limit(1);

    if (figmaCourse.length > 0) {
      await db
        .update(campaigns)
        .set({
          imageUrl: '/attached_assets/figma-course-banner.png',
          isFeatured: true,
          featuredOrder: 2,
          updatedAt: new Date()
        })
        .where(eq(campaigns.id, 2));
      console.log(`✅ Featured: ${figmaCourse[0].title}`);
      console.log(`   Order: 2`);
      console.log(`   Image: /attached_assets/figma-course-banner.png\n`);
    }

    // Third campaign (if exists)
    const thirdCampaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, 3))
      .limit(1);

    if (thirdCampaign.length > 0) {
      await db
        .update(campaigns)
        .set({
          isFeatured: true,
          featuredOrder: 3,
          updatedAt: new Date()
        })
        .where(eq(campaigns.id, 3));
      console.log(`✅ Featured: ${thirdCampaign[0].title}`);
      console.log(`   Order: 3\n`);
    }

    // Verify the updates
    console.log('\n📊 Final Featured Items:\n');
    const featuredCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.isFeatured, true))
      .orderBy(campaigns.featuredOrder);

    featuredCampaigns.forEach(c => {
      console.log(`${c.featuredOrder}. ${c.title}`);
      console.log(`   Image: ${c.imageUrl || '❌ No image'}`);
    });

    console.log('\n✅ Featured campaigns restored!\n');
    console.log('🔄 Please refresh your browser to see the changes.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreFeaturedCampaigns();

