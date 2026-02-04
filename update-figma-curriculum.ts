import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { courses } from './shared/schema';
import { eq } from 'drizzle-orm';

async function updateFigmaCurriculum() {
  try {
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
    
    // New curriculum content
    const newCurriculum = `🧭 Learning Path (Modules at a Glance)

Foundations — Design Thinking & Figma Fundamentals

UI Design — Visual Systems, Layouts & Aesthetics

UX Design — Research, Flows & Prototyping

Design Systems — Components & Collaboration

Motion, Handoff & Production (Pro Track)

Capstone Project — Build, Present & Launch

🪐 Module 1 — Design Foundations & Figma Fundamentals (Week 1)

Goal: Build the mindset, workflow, and speed of a designer.

What You'll Learn:

Understanding design thinking: how great products are shaped.

The Figma workspace — frames, layers, grids, pages, and constraints.

Using FigJam for brainstorming, flow diagrams, and wireframes.

UI wireframing best practices: structure over decoration.

Collaboration 101 — live edits, version control, comments.

Hands-On Projects:

Create your first 3-screen low-fidelity wireframe.

Build an interactive prototype for user testing.

Deliverable:

1 functional low-fidelity prototype + presentation wireframes.

Why It Matters:

This foundation builds not just your technical base, but your creative muscle memory — the discipline every world-class designer shares.

🎨 Module 2 — UI Design: Visual Systems & Layout Mastery (Week 2)

Goal: Design interfaces that are both functional and stunning.

What You'll Learn:

Auto Layout: responsive UI that adapts across devices.

Typography Systems: scale, rhythm, hierarchy, and accessibility.

Color Systems: palette building, tone psychology, and WCAG contrast.

Grids & Spacing: how professionals achieve balance.

Visual Polish: icons, imagery, and component consistency.

Hands-On Projects:

Design a 3-screen mobile app: Login, Dashboard, Product Detail.

Style guide creation using shared color & text styles.

Deliverable:

High-fidelity mobile UI + documented visual style guide.

Why It Matters:

Great design isn't about beauty alone — it's about clarity, rhythm, and trust. This module gives you the eye and technique for both.

🧠 Module 3 — UX Design: Research, Flows & Prototyping (Week 3)

Goal: Learn to think beyond pixels — design for people.

What You'll Learn:

User Research Basics — empathy mapping, quick persona creation, identifying pain points.

User Flow Design — mapping logic and navigation using FigJam.

Prototyping in Figma — linking screens, overlays, and transitions.

Smart Animate, Micro-Interactions, and Feedback Loops.

Usability testing — getting feedback that actually improves design.

Hands-On Projects:

Create a complete prototype flow for a mini app or site.

Conduct 2 quick peer tests and document improvements.

Deliverable:

Clickable prototype + user journey diagram.

Why It Matters:

UI shows what users see — UX defines what they feel. This week transforms you from decorator to problem-solver.

🧩 Module 4 — Design Systems & Professional Collaboration (Week 4)

Goal: Build scalable design systems and work like a real product designer.

What You'll Learn:

Design Systems Architecture: atoms → components → pages.

Variants & Tokens — modular design logic for reusability.

Figma Libraries — creating, publishing, and updating shared systems.

Dev Mode: inspect, export, and deliver pixel-perfect assets.

Collaboration: working with developers, handoff etiquette, QA checklist.

Hands-On Projects:

Create your personal reusable design system in Figma.

Simulate a real designer → developer handoff session.

Deliverable:

System library + developer handoff documentation.

Why It Matters:

Design is not a solo act — it's an orchestra. This module teaches you how to work in harmony with product teams, devs, and collaborators.

✨ Module 5 — Motion, Handoff & Production (Optional Pro Track - Week 5)

Goal: Add soul and motion to your designs — make them feel alive.

What You'll Learn:

Introduction to Figmotion for UI animations.

Scroll & parallax design (visual storytelling).

Exporting to Framer or FlutterFlow for live implementation.

Asset optimization & Lottie integration for developers.

Accessibility in animation (motion sensitivity best practices).

Hands-On Projects:

Animate a product hero section or mobile transition.

Export motion assets to Framer or FlutterFlow.

Deliverable:

Animated prototype + production-ready asset pack.

Why It Matters:

In modern design, animation isn't decoration — it's communication. This is where your design starts breathing.

🌍 Module 6 — Capstone Project: Build, Polish & Present (Week 6)

Goal: Bring everything together — design, prototype, and showcase your product.

Project Options:

Mobile App: Complete end-to-end app UI + prototype.

Responsive Website: Landing page + product dashboard + interactive flow.

Figma to FlutterFlow: Real app prototype with exportable Flutter code.

What You'll Deliver:

Research brief

Final design + prototype

System documentation

2-page case study for your portfolio

Evaluation:

1:1 Mentor review

Peer feedback

Final showcase with certificate ceremony

Outcome:

Zoonigia Certificate of Mastery + Portfolio-Ready Capstone + Internship Eligibility.

🎓 Ongoing Module — Career Launch & Community Access

Goal: Transition from student → professional designer.

Includes:

Personal portfolio templates & case study frameworks

Resume & design interview prep

Design challenge portfolio booster

Internship connections through Zoonigia partner network

Lifetime access to Zoonigia's Designverse Community`;

    // Find and replace the curriculum sections
    // Look for "🎯 What You'll Master" and "📋 Course Structure" sections
    let updatedAbout = currentAbout;
    
    // Find the start of "What You'll Master" section
    const masterStart = updatedAbout.toLowerCase().indexOf('🎯 what you\'ll master');
    const structureStart = updatedAbout.toLowerCase().indexOf('📋 course structure');
    
    if (masterStart !== -1) {
      // Find where this section ends (next major section or end)
      let masterEnd = updatedAbout.length;
      
      // Look for next major section markers
      const nextSections = [
        updatedAbout.toLowerCase().indexOf('## ✨', masterStart + 1),
        updatedAbout.toLowerCase().indexOf('## 🎁', masterStart + 1),
        updatedAbout.toLowerCase().indexOf('## 🏆', masterStart + 1),
        updatedAbout.toLowerCase().indexOf('## 💼', masterStart + 1),
        updatedAbout.toLowerCase().indexOf('## 📋', masterStart + 1),
        updatedAbout.toLowerCase().indexOf('## 🎯', masterStart + 1)
      ].filter(idx => idx !== -1);
      
      if (nextSections.length > 0) {
        masterEnd = Math.min(...nextSections);
      }
      
      // Replace the section
      const beforeMaster = updatedAbout.substring(0, masterStart).trim();
      const afterMaster = updatedAbout.substring(masterEnd).trim();
      
      // Insert new curriculum as "What You'll Master" section
      updatedAbout = beforeMaster + `\n\n## 🎯 What You'll Master\n\n` + newCurriculum + `\n\n` + afterMaster;
    } else if (structureStart !== -1) {
      // If "What You'll Master" not found, replace "Course Structure"
      let structureEnd = updatedAbout.length;
      
      const nextSections = [
        updatedAbout.toLowerCase().indexOf('## ✨', structureStart + 1),
        updatedAbout.toLowerCase().indexOf('## 🎁', structureStart + 1),
        updatedAbout.toLowerCase().indexOf('## 🏆', structureStart + 1),
        updatedAbout.toLowerCase().indexOf('## 💼', structureStart + 1),
        updatedAbout.toLowerCase().indexOf('## 🎯', structureStart + 1)
      ].filter(idx => idx !== -1);
      
      if (nextSections.length > 0) {
        structureEnd = Math.min(...nextSections);
      }
      
      const beforeStructure = updatedAbout.substring(0, structureStart).trim();
      const afterStructure = updatedAbout.substring(structureEnd).trim();
      
      updatedAbout = beforeStructure + `\n\n## 🎯 What You'll Master\n\n` + newCurriculum + `\n\n` + afterStructure;
    } else {
      // If neither found, add it before "What Makes This Course Special"
      const specialStart = updatedAbout.toLowerCase().indexOf('## ✨ what makes this course special');
      if (specialStart !== -1) {
        const beforeSpecial = updatedAbout.substring(0, specialStart).trim();
        const afterSpecial = updatedAbout.substring(specialStart).trim();
        updatedAbout = beforeSpecial + `\n\n## 🎯 What You'll Master\n\n` + newCurriculum + `\n\n` + afterSpecial;
      } else {
        // Just append at the end
        updatedAbout = updatedAbout.trim() + `\n\n## 🎯 What You'll Master\n\n` + newCurriculum;
      }
    }
    
    // Clean up excessive newlines
    updatedAbout = updatedAbout.replace(/\n{4,}/g, '\n\n\n').trim();
    
    await db
      .update(courses)
      .set({ 
        about: updatedAbout,
        updatedAt: new Date()
      })
      .where(eq(courses.id, 8));
    
    console.log('✅ Updated Figma course curriculum!');
    console.log('✅ Course about field updated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating curriculum:', error);
    process.exit(1);
  }
}

updateFigmaCurriculum();

