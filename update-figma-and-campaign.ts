import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses, campaigns } from './shared/schema';
import { eq, ilike } from 'drizzle-orm';

async function updateFigmaAndCampaign() {
  try {
    // 1. Update Figma course: Remove "self-paced" from duration
    const figmaCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, 8))
      .limit(1);
    
    if (figmaCourse.length > 0) {
      const currentDuration = figmaCourse[0].duration || '';
      const newDuration = currentDuration.replace(/self-paced/gi, '').replace(/\s*\(\)\s*/g, '').replace(/\s+/g, ' ').trim();
      
      await db
        .update(courses)
        .set({ 
          duration: newDuration,
          updatedAt: new Date()
        })
        .where(eq(courses.id, 8));
      
      console.log('✅ Updated Figma course duration:');
      console.log('   Old:', currentDuration);
      console.log('   New:', newDuration);
    } else {
      console.log('❌ Figma course not found (ID: 8)');
    }

    // 2. Update Youth Ideathon campaign: Add image URL
    const youthIdeathon = await db
      .select()
      .from(campaigns)
      .where(ilike(campaigns.title, '%youth%ideathon%'))
      .limit(1);
    
    if (youthIdeathon.length > 0) {
      const campaign = youthIdeathon[0];
      const imageUrl = '/attached_assets/youth-ideathon-banner.png'; // Update this to match your actual filename
      
      await db
        .update(campaigns)
        .set({ 
          imageUrl: imageUrl,
          updatedAt: new Date()
        })
        .where(eq(campaigns.id, campaign.id));
      
      console.log('✅ Updated Youth Ideathon campaign image:');
      console.log('   Campaign ID:', campaign.id);
      console.log('   Campaign Title:', campaign.title);
      console.log('   Image URL:', imageUrl);
    } else {
      console.log('⚠️  Youth Ideathon campaign not found. Searching all campaigns...');
      const allCampaigns = await db.select().from(campaigns);
      console.log('Available campaigns:');
      allCampaigns.forEach(c => {
        console.log(`   - ID: ${c.id}, Title: ${c.title}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating:', error);
    process.exit(1);
  }
}

updateFigmaAndCampaign();

