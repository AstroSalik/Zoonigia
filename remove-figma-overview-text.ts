import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses } from './shared/schema';
import { eq } from 'drizzle-orm';

async function removeFigmaOverviewText() {
  try {
    // Get the Figma course (ID: 8)
    const figmaCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, 8))
      .limit(1);
    
    if (figmaCourse.length === 0) {
      console.log('❌ Figma course not found (ID: 8)');
      process.exit(1);
    }

    const course = figmaCourse[0];
    const currentAbout = course.about || '';
    
    // Text to remove
    const textToRemove = "A focused, hands-on program that takes you from zero to portfolio in 8 weeks. Learn research, UI, prototyping, motion, and design systems in Figma — then ship a capstone product that proves you're job-ready. Mentors, live sessions, peer critique, and internship pipelines included.";
    
    const textToRemoveLower = textToRemove.toLowerCase();
    const currentAboutLower = currentAbout.toLowerCase();
    
    // Check if the text exists
    if (!currentAboutLower.includes(textToRemoveLower.substring(0, 50))) {
      console.log('ℹ️  Text not found in the course about field.');
      console.log('   Nothing to remove.');
      process.exit(0);
    }
    
    // Remove the text (case-insensitive)
    let updatedAbout = currentAbout;
    const textIndex = currentAboutLower.indexOf(textToRemoveLower);
    
    if (textIndex !== -1) {
      // Remove the text and clean up surrounding newlines
      const beforeText = currentAbout.substring(0, textIndex).trim();
      const afterText = currentAbout.substring(textIndex + textToRemove.length).trim();
      
      // Clean up multiple newlines
      updatedAbout = (beforeText + '\n\n' + afterText)
        .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with 2
        .replace(/^\n+/, '')          // Remove leading newlines
        .replace(/\n+$/, '')          // Remove trailing newlines
        .trim();
    }
    
    await db
      .update(courses)
      .set({ 
        about: updatedAbout,
        updatedAt: new Date()
      })
      .where(eq(courses.id, 8));
    
    console.log('✅ Removed the text from Figma course overview');
    console.log('✅ Course about field updated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing text:', error);
    process.exit(1);
  }
}

removeFigmaOverviewText();

