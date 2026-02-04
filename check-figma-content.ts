import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses } from './shared/schema';
import { eq } from 'drizzle-orm';

async function checkContent() {
  try {
    const figmaCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, 8))
      .limit(1);
    
    if (figmaCourse.length === 0) {
      console.log('❌ Figma course not found');
      process.exit(1);
    }

    const course = figmaCourse[0];
    console.log('Current about content:');
    console.log('='.repeat(80));
    console.log(course.about);
    console.log('='.repeat(80));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkContent();

