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

async function updateFigmaOverview() {
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
    
    // New overview description to add
    const newOverview = "A focused, hands-on program that takes you from zero to portfolio in 8 weeks. Learn research, UI, prototyping, motion, and design systems in Figma — then ship a capstone product that proves you're job-ready. Mentors, live sessions, peer critique, and internship pipelines included.";
    
    // Check if the new overview is already in the content
    const overviewLower = newOverview.toLowerCase();
    const currentAboutLower = currentAbout.toLowerCase();
    const overviewStart = overviewLower.substring(0, 50);
    
    let updatedAbout = currentAbout;
    
    // Check if text exists and where it is
    const textExists = currentAboutLower.includes(overviewStart);
    
    // Find "🌟 Course Overview" or "Course Overview" with star emoji
    // Also check for "Learn Figma Design Like a Pro" to find the right section
    const courseOverviewPatterns = [
      '🌟 course overview',
      '⭐ course overview',
      '✨ course overview',
      'course overview'
    ];
    
    let courseOverviewIndex = -1;
    let courseOverviewEndIndex = -1;
    
    // First try to find "🌟 Course Overview" or similar
    for (const pattern of courseOverviewPatterns) {
      const index = currentAboutLower.indexOf(pattern);
      if (index !== -1) {
        courseOverviewIndex = index;
        // Find the end of this line (newline or end of string)
        const lineEnd = currentAbout.indexOf('\n', index);
        courseOverviewEndIndex = lineEnd !== -1 ? lineEnd + 1 : currentAbout.length;
        break;
      }
    }
    
    // If not found, try to find "Learn Figma Design Like a Pro" and look for Course Overview after it
    if (courseOverviewIndex === -1) {
      const learnFigmaIndex = currentAboutLower.indexOf('learn figma design like a pro');
      if (learnFigmaIndex !== -1) {
        // Find the next line after "Learn Figma Design Like a Pro"
        const afterLearnFigma = currentAbout.substring(learnFigmaIndex);
        const afterLearnFigmaLower = afterLearnFigma.toLowerCase();
        const courseOverviewAfterLearn = afterLearnFigmaLower.indexOf('course overview');
        if (courseOverviewAfterLearn !== -1) {
          courseOverviewIndex = learnFigmaIndex + courseOverviewAfterLearn;
          const lineEnd = currentAbout.indexOf('\n', courseOverviewIndex);
          courseOverviewEndIndex = lineEnd !== -1 ? lineEnd + 1 : currentAbout.length;
        }
      }
    }
    
    // Find "Welcome to the Certified" to place text before it
    const welcomeIndex = currentAboutLower.indexOf('welcome to the certified');
    
    if (textExists) {
      // Remove the text from wherever it currently is
      let cleanedAbout = currentAbout.trim();
      const textIndex = cleanedAbout.toLowerCase().indexOf(overviewLower);
      if (textIndex !== -1) {
        // Remove the text and surrounding newlines
        const beforeText = cleanedAbout.substring(0, textIndex).trim();
        const afterText = cleanedAbout.substring(textIndex + newOverview.length).trim().replace(/^\n+/, '').trim();
        cleanedAbout = (beforeText + '\n\n' + afterText).replace(/\n{3,}/g, '\n\n').trim();
      }
      
      // Recalculate indices after cleaning
      const cleanedAboutLower = cleanedAbout.toLowerCase();
      const courseOverviewIndexCleaned = cleanedAboutLower.indexOf('course overview');
      const welcomeIndexInCleaned = cleanedAboutLower.indexOf('welcome to the certified');
      
      // Place it after "🌟 Course Overview" and before "Welcome to the Certified"
      if (courseOverviewIndexCleaned !== -1 && welcomeIndexInCleaned !== -1) {
        // Find end of "Course Overview" line
        const courseOverviewEnd = cleanedAbout.indexOf('\n', courseOverviewIndexCleaned);
        const insertPosition = courseOverviewEnd !== -1 ? courseOverviewEnd : courseOverviewIndexCleaned + 20;
        const beforeInsert = cleanedAbout.substring(0, insertPosition).trim();
        const afterInsert = cleanedAbout.substring(insertPosition).trim();
        updatedAbout = beforeInsert + '\n\n' + newOverview + '\n\n' + afterInsert;
      } else if (welcomeIndexInCleaned !== -1) {
        // If Course Overview not found but Welcome is, place before Welcome
        const beforeWelcome = cleanedAbout.substring(0, welcomeIndexInCleaned).trim();
        const afterWelcome = cleanedAbout.substring(welcomeIndexInCleaned).trim();
        updatedAbout = beforeWelcome + '\n\n' + newOverview + '\n\n' + afterWelcome;
      } else {
        updatedAbout = newOverview + '\n\n' + cleanedAbout;
      }
    } else {
      // Text doesn't exist - add it after "🌟 Course Overview" and before "Welcome to the Certified"
      if (courseOverviewEndIndex !== -1 && welcomeIndex !== -1 && courseOverviewEndIndex < welcomeIndex) {
        // Place after Course Overview, before Welcome
        const beforeInsert = currentAbout.substring(0, courseOverviewEndIndex).trim();
        const afterInsert = currentAbout.substring(courseOverviewEndIndex).trim();
        updatedAbout = beforeInsert + '\n\n' + newOverview + '\n\n' + afterInsert;
      } else if (welcomeIndex !== -1) {
        // If Course Overview not found but Welcome is, place before Welcome
        const beforeWelcome = currentAbout.substring(0, welcomeIndex).trim();
        const afterWelcome = currentAbout.substring(welcomeIndex).trim();
        updatedAbout = beforeWelcome + '\n\n' + newOverview + '\n\n' + afterWelcome;
      } else if (currentAbout && currentAbout.trim().length > 0) {
        updatedAbout = newOverview + '\n\n' + currentAbout.trim();
      } else {
        updatedAbout = newOverview;
      }
    }
    
    await db
      .update(courses)
      .set({ 
        about: updatedAbout,
        updatedAt: new Date()
      })
      .where(eq(courses.id, 8));
    
    console.log('✅ Updated Figma course overview:');
    console.log('\nNew Overview:');
    console.log(newOverview);
    console.log('\n✅ Course about field updated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating Figma course overview:', error);
    process.exit(1);
  }
}

updateFigmaOverview();

