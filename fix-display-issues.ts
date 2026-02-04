import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses, campaigns } from './shared/schema';
import { eq } from 'drizzle-orm';

async function fixDisplayIssues() {
  try {
    console.log('\n🔧 Fixing Display Issues...\n');

    // First, list all courses to see what we have
    const allCourses = await db.select().from(courses);
    console.log('📚 Current Courses:');
    allCourses.forEach(c => {
      console.log(`  ID: ${c.id} - ${c.title}`);
      console.log(`     Image: ${c.imageUrl || '❌ No image'}`);
      console.log(`     Featured: ${c.isFeatured ? '✅' : '❌'}`);
      console.log('');
    });

    // Update courses with correct image paths
    const updates = [
      {
        id: 1,
        title: 'Quantum Computing Fundamentals',
        imageUrl: '/attached_assets/quantum-computing-banner.png',
        isFeatured: true,
        featuredOrder: 1
      },
      {
        id: 2,
        title: 'Advanced Robotics & AI',
        imageUrl: '/attached_assets/download (5).jpeg',
        isFeatured: true,
        featuredOrder: 2
      },
      {
        id: 3,
        title: 'Introduction to Space Science',
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        featuredOrder: 3
      }
    ];

    console.log('\n🔄 Updating courses...\n');

    for (const update of updates) {
      try {
        // Check if course exists
        const [existingCourse] = await db
          .select()
          .from(courses)
          .where(eq(courses.id, update.id))
          .limit(1);

        if (existingCourse) {
          // Update the course
          const [updatedCourse] = await db
            .update(courses)
            .set({
              imageUrl: update.imageUrl,
              isFeatured: update.isFeatured,
              featuredOrder: update.featuredOrder,
              updatedAt: new Date()
            })
            .where(eq(courses.id, update.id))
            .returning();

          console.log(`✅ Updated: ${updatedCourse.title}`);
          console.log(`   Image: ${updatedCourse.imageUrl}`);
          console.log(`   Featured: ${updatedCourse.isFeatured}`);
          console.log('');
        } else {
          console.log(`⚠️  Course ID ${update.id} not found - skipping`);
        }
      } catch (error) {
        console.error(`❌ Error updating course ${update.id}:`, error);
      }
    }

    // List all campaigns
    console.log('\n📢 Current Campaigns:');
    const allCampaigns = await db.select().from(campaigns);
    allCampaigns.forEach(c => {
      console.log(`  ID: ${c.id} - ${c.title}`);
      console.log(`     Image: ${c.imageUrl || '❌ No image'}`);
      console.log(`     Featured: ${c.isFeatured ? '✅' : '❌'}`);
      console.log('');
    });

    // Update campaigns with correct image paths if needed
    const campaignUpdates = [
      {
        id: 1,
        imageUrl: '/attached_assets/youth-ideathon-banner.png',
        isFeatured: true,
        featuredOrder: 1
      },
      {
        id: 2,
        imageUrl: '/attached_assets/figma-course-banner.png',
        isFeatured: true,
        featuredOrder: 2
      }
    ];

    console.log('\n🔄 Updating campaigns...\n');

    for (const update of campaignUpdates) {
      try {
        const [existingCampaign] = await db
          .select()
          .from(campaigns)
          .where(eq(campaigns.id, update.id))
          .limit(1);

        if (existingCampaign) {
          const [updatedCampaign] = await db
            .update(campaigns)
            .set({
              imageUrl: update.imageUrl,
              isFeatured: update.isFeatured,
              featuredOrder: update.featuredOrder,
              updatedAt: new Date()
            })
            .where(eq(campaigns.id, update.id))
            .returning();

          console.log(`✅ Updated: ${updatedCampaign.title}`);
          console.log(`   Image: ${updatedCampaign.imageUrl}`);
          console.log(`   Featured: ${updatedCampaign.isFeatured}`);
          console.log('');
        } else {
          console.log(`⚠️  Campaign ID ${update.id} not found - skipping`);
        }
      } catch (error) {
        console.error(`❌ Error updating campaign ${update.id}:`, error);
      }
    }

    console.log('\n✅ Display issues fixed!\n');
    console.log('📝 Summary:');
    console.log('   - Updated course images');
    console.log('   - Set featured flags');
    console.log('   - Updated campaign images');
    console.log('\n💡 Note: Make sure the following files exist:');
    console.log('   - client/public/attached_assets/quantum-computing-banner.png');
    console.log('   - client/public/attached_assets/download (5).jpeg');
    console.log('   - client/public/attached_assets/youth-ideathon-banner.png');
    console.log('   - client/public/attached_assets/figma-course-banner.png');
    console.log('\n🎬 For the video issue:');
    console.log('   - Check if YouTube video ID "Tgr6BrgIBec" is accessible');
    console.log('   - Try opening: https://www.youtube.com/watch?v=Tgr6BrgIBec');
    console.log('   - If video is private/deleted, update the video ID in client/src/pages/Home.tsx line 424');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixDisplayIssues();

