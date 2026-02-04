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

async function mergeFigmaOverviewText() {
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
    
    // The text to be merged
    const textToMerge = "A focused, hands-on program that takes you from zero to portfolio in 8 weeks. Learn research, UI, prototyping, motion, and design systems in Figma — then ship a capstone product that proves you're job-ready. Mentors, live sessions, peer critique, and internship pipelines included.";
    const textToMergeLower = textToMerge.toLowerCase();

    // The highlighted text in the screenshot (with markdown formatting)
    const highlightedTextPatterns = [
      "Welcome to the **Certified Figma Learning Program** - the ultimate FREE MasterCourse designed by industry professionals. Whether you're a complete beginner or looking to level up your design skills, this comprehensive program will transform you into a confident Figma designer.",
      "Welcome to the Certified Figma Learning Program - the ultimate FREE MasterCourse designed by industry professionals. Whether you're a complete beginner or looking to level up your design skills, this comprehensive program will transform you into a confident Figma designer."
    ];

    let updatedAbout = currentAbout;
    const currentAboutLower = currentAbout.toLowerCase();

    // First, remove the text from the end if it exists there
    const textIndexAtEnd = currentAboutLower.lastIndexOf(textToMergeLower);
    if (textIndexAtEnd !== -1) {
      // Check if it's at the end (within last 200 chars)
      const distanceFromEnd = currentAbout.length - (textIndexAtEnd + textToMerge.length);
      if (distanceFromEnd < 200) {
        // Remove it from the end
        updatedAbout = currentAbout.substring(0, textIndexAtEnd).trim();
        // Clean up trailing newlines
        updatedAbout = updatedAbout.replace(/\n+$/, '').trim();
      }
    }

    // Now find the highlighted text and insert the textToMerge after it
    let foundHighlighted = false;
    for (const highlightedText of highlightedTextPatterns) {
      const highlightedTextLower = highlightedText.toLowerCase();
      const highlightedTextIndex = updatedAbout.toLowerCase().indexOf(highlightedTextLower);
      
      if (highlightedTextIndex !== -1) {
        // Find the end of this paragraph (look for the next paragraph or newline)
        const afterHighlightedStart = highlightedTextIndex + highlightedText.length;
        const afterHighlighted = updatedAbout.substring(afterHighlightedStart);
        
        // Find where this paragraph ends (next line that's not empty or next heading)
        let paragraphEnd = afterHighlighted.length;
        const nextNewline = afterHighlighted.indexOf('\n\n');
        const nextHeading = afterHighlighted.search(/^\n*##?\s+/m);
        
        if (nextNewline !== -1 && nextNewline < 100) {
          paragraphEnd = afterHighlightedStart + nextNewline;
        } else if (nextHeading !== -1) {
          paragraphEnd = afterHighlightedStart + nextHeading;
        } else {
          // Just use the first significant newline
          const firstSignificantNewline = afterHighlighted.indexOf('\n\n');
          if (firstSignificantNewline !== -1) {
            paragraphEnd = afterHighlightedStart + firstSignificantNewline;
          }
        }
        
        const beforeInsert = updatedAbout.substring(0, paragraphEnd).trim();
        const afterInsert = updatedAbout.substring(paragraphEnd).trim();
        
        updatedAbout = beforeInsert + '\n\n' + textToMerge + '\n\n' + afterInsert;
        // Clean up excessive newlines
        updatedAbout = updatedAbout.replace(/\n{3,}/g, '\n\n').trim();
        foundHighlighted = true;
        break;
      }
    }

    if (!foundHighlighted) {
      console.log('⚠️  Highlighted text not found. The text has been removed from the end if it was there.');
    }

    // Final cleanup
    updatedAbout = updatedAbout.replace(/\n{3,}/g, '\n\n').trim();

    // Update the course in the database
    await db
      .update(courses)
      .set({ 
        about: updatedAbout,
        updatedAt: new Date()
      })
      .where(eq(courses.id, 8));

    console.log('✅ Figma course overview updated successfully!');
    console.log('The text has been merged into the highlighted section.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating Figma course overview:', error);
    process.exit(1);
  }
}

mergeFigmaOverviewText();

