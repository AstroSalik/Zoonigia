import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses, campaigns } from './shared/schema';

async function listItems() {
  try {
    console.log('\n📚 COURSES:\n');
    const allCourses = await db.select().from(courses);
    if (allCourses.length === 0) {
      console.log('   No courses found.');
    } else {
      allCourses.forEach(course => {
        console.log(`   ID: ${course.id.toString().padEnd(3)} | ${course.title.padEnd(50)} | Image: ${course.imageUrl || '❌ None'}`);
      });
    }
    
    console.log('\n\n🎯 CAMPAIGNS:\n');
    const allCampaigns = await db.select().from(campaigns);
    if (allCampaigns.length === 0) {
      console.log('   No campaigns found.');
    } else {
      allCampaigns.forEach(campaign => {
        console.log(`   ID: ${campaign.id.toString().padEnd(3)} | ${campaign.title.padEnd(50)} | Image: ${campaign.imageUrl || '❌ None'}`);
      });
    }
    
    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing items:', error);
    process.exit(1);
  }
}

listItems();

