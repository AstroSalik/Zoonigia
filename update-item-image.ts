import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses, campaigns } from './shared/schema';
import { eq } from 'drizzle-orm';

async function updateImage() {
  try {
    // ============================================
    // CONFIGURATION - EDIT THESE VALUES
    // ============================================
    
    // Choose 'course' or 'campaign'
    const itemType: 'course' | 'campaign' = 'course';
    
    // Enter the ID of the course or campaign you want to update
    // Find IDs in Admin Dashboard (/admin) → Courses or Campaigns tab
    const itemId = 2; // Example: 2 for Quantum Computing, 3 for Advanced Robotics
    
    // Enter the exact filename of your image (must be in client/public/attached_assets/)
    const imageFileName = 'quantum-computing-banner.png'; // Example: 'quantum-computing-banner.png'
    
    // ============================================
    // END CONFIGURATION
    // ============================================
    
    const imageUrl = `/attached_assets/${imageFileName}`;
    
    console.log(`\n🔄 Updating ${itemType} ID ${itemId} with image: ${imageUrl}\n`);

    if (itemType === 'course') {
      // First, check if course exists
      const existingCourse = await db
        .select()
        .from(courses)
        .where(eq(courses.id, itemId))
        .limit(1);
      
      if (existingCourse.length === 0) {
        console.error(`❌ Course ID ${itemId} not found!`);
        console.log('\n📋 Available courses:');
        const allCourses = await db.select().from(courses);
        allCourses.forEach(c => {
          console.log(`   - ID: ${c.id}, Title: ${c.title}`);
        });
        process.exit(1);
      }
      
      const [updatedCourse] = await db
        .update(courses)
        .set({
          imageUrl: imageUrl,
          updatedAt: new Date()
        })
        .where(eq(courses.id, itemId))
        .returning();

      if (updatedCourse) {
        console.log('✅ Course image updated successfully!');
        console.log(`   Course ID: ${updatedCourse.id}`);
        console.log(`   Course Title: ${updatedCourse.title}`);
        console.log(`   Image URL: ${updatedCourse.imageUrl}`);
      }
    } else if (itemType === 'campaign') {
      // First, check if campaign exists
      const existingCampaign = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, itemId))
        .limit(1);
      
      if (existingCampaign.length === 0) {
        console.error(`❌ Campaign ID ${itemId} not found!`);
        console.log('\n📋 Available campaigns:');
        const allCampaigns = await db.select().from(campaigns);
        allCampaigns.forEach(c => {
          console.log(`   - ID: ${c.id}, Title: ${c.title}`);
        });
        process.exit(1);
      }
      
      const [updatedCampaign] = await db
        .update(campaigns)
        .set({
          imageUrl: imageUrl,
          updatedAt: new Date()
        })
        .where(eq(campaigns.id, itemId))
        .returning();

      if (updatedCampaign) {
        console.log('✅ Campaign image updated successfully!');
        console.log(`   Campaign ID: ${updatedCampaign.id}`);
        console.log(`   Campaign Title: ${updatedCampaign.title}`);
        console.log(`   Image URL: ${updatedCampaign.imageUrl}`);
      }
    } else {
      console.error('❌ Invalid itemType. Must be "course" or "campaign".');
      process.exit(1);
    }
    
    console.log('\n✨ Done! Refresh your browser to see the changes.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image:', error);
    process.exit(1);
  }
}

updateImage();

