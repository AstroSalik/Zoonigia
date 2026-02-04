import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '.env') });

import { db } from './server/db';
import { campaigns } from './shared/schema';
import { eq } from 'drizzle-orm';

async function restoreFullCampaignContent() {
  try {
    console.log('\n🔧 Restoring FULL Campaign Content...\n');

    // YOUTH IDEATHON 2025 - Removed for production


    // FIGMA DESIGN SPRINT - Full Content
    const figmaContent = {
      title: "Figma Design Sprint",
      description: "Master UI/UX design with Figma in this intensive 6-week bootcamp. Learn to create stunning interfaces, collaborate with teams, and build a professional portfolio. Perfect for aspiring designers and creative technologists.",
      type: "design_challenge",
      field: "Design & Technology",
      duration: "6 weeks",
      startDate: "2025-01-15",
      endDate: "2025-02-28",
      partner: "Zoonigia • Design Community • Figma",
      status: "accepting_registrations",
      progress: 30,
      price: "0.00",
      isFree: true,
      isFeatured: true,
      featuredOrder: 2,
      imageUrl: '/attached_assets/figma-course-banner.png',
      maxParticipants: 500,
      targetParticipants: 300,
      requirements: `• Basic computer skills
• Access to a computer with internet
• Creative mindset and attention to detail
• Willingness to learn design thinking
• 6-8 hours per week commitment
• No prior design experience required!`,
      timeline: `**Week 1: Figma Fundamentals & Design Thinking**
- Introduction to UI/UX design principles
- Figma workspace mastery
- Design thinking methodology
- Create your first wireframe

**Week 2: UI Design & Visual Systems**
- Typography and color theory
- Layout principles and grids
- Auto Layout and responsive design
- Component creation and styling

**Week 3: UX Design & User Flows**
- User research basics
- Creating user personas
- User flow mapping with FigJam
- Prototyping and interactions

**Week 4: Design Systems & Collaboration**
- Building design systems
- Component libraries
- Team collaboration features
- Developer handoff best practices

**Week 5: Advanced Prototyping & Animation**
- Smart animate and micro-interactions
- Prototyping complex flows
- Motion design principles
- User testing your prototypes

**Week 6: Capstone Project & Portfolio**
- Complete portfolio project
- Case study creation
- Design critique and feedback
- Certificate ceremony and showcase`,
      outcomes: `🎨 **Skills You'll Master:**
• Professional Figma proficiency
• UI/UX design principles
• Design systems architecture
• Prototyping and interaction design
• Team collaboration workflows
• Portfolio development

📂 **Portfolio Projects:**
• 3-5 complete design projects
• Professional case studies
• Responsive web designs
• Mobile app interfaces
• Design system documentation

🏅 **Career Benefits:**
• Zoonigia Design Certificate
• Portfolio review and feedback
• Design community access
• Internship referrals
• Freelance project opportunities
• Lifetime design resources access`
    };

    const [figmaCampaign] = await db
      .insert(campaigns)
      .values({
        id: 2,
        ...figmaContent,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: campaigns.id,
        set: {
          ...figmaContent,
          updatedAt: new Date()
        }
      })
      .returning();

    console.log('✅ Figma Design Sprint - FULL CONTENT RESTORED');
    console.log(`   ID: ${figmaCampaign.id}`);
    console.log(`   Title: ${figmaCampaign.title}`);
    console.log(`   Requirements: ${figmaCampaign.requirements?.substring(0, 50)}...`);
    console.log(`   Timeline: ${figmaCampaign.timeline?.substring(0, 50)}...`);
    console.log(`   Outcomes: ${figmaCampaign.outcomes?.substring(0, 50)}...\n`);

    // ASTEROID SEARCH CAMPAIGN - Full Content
    const asteroidContent = {
      title: "Zoonigia Asteroid Search Campaign",
      description: "Collaborate with NASA Citizen Science and IASC to discover real asteroids and name them officially. Contribute to space science while learning astronomy, research methods, and data analysis.",
      type: "asteroid_search",
      field: "Astronomy & Space Science",
      duration: "16 weeks",
      startDate: "2025-08-17",
      endDate: "2025-11-23",
      partner: "NASA • IASC • University of Hawaii • Zoonigia",
      status: "accepting_registrations",
      progress: 20,
      price: "300.00",
      isFree: false,
      isFeatured: true,
      featuredOrder: 3,
      imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      maxParticipants: 200,
      targetParticipants: 100,
      requirements: `• Age 12+ (parental consent required for minors)
• Basic computer skills
• Interest in astronomy and space science
• Access to computer with stable internet
• Commitment to 4-6 hours per week
• Willingness to learn data analysis
• Team or individual participation welcome`,
      timeline: `**Weeks 1-4: Training Phase**
- Introduction to asteroid science
- NASA tools and software training
- Image analysis techniques
- Understanding orbital mechanics
- Research methodology basics

**Weeks 5-12: Active Search Campaign**
- Analyze telescope images from NASA
- Identify potential asteroids
- Track moving objects
- Submit discoveries for verification
- Collaborate with international team
- Weekly progress reviews

**Weeks 13-15: Verification & Documentation**
- Professional astronomers verify findings
- Prepare discovery documentation
- Write research notes
- Create presentations
- Peer review sessions

**Week 16: Naming & Recognition**
- Official asteroid naming ceremony
- Certificate presentation
- Research paper contribution
- NASA acknowledgment
- Community celebration`,
      outcomes: `🌟 **Scientific Recognition:**
• Official NASA Citizen Scientist certificate
• IASC participation recognition
• Name a discovered asteroid (subject to discovery)
• Contribution to asteroid catalog
• Research paper co-authorship opportunity

📊 **Learning Outcomes:**
• Practical astronomy research experience
• Data analysis and pattern recognition
• Scientific documentation skills
• Collaboration with NASA scientists
• Understanding of Near-Earth Objects
• Real contribution to planetary defense

🎓 **Career Development:**
• Portfolio-worthy space science project
• Letter of recommendation from NASA partner
• Astronomy research experience
• STEM career pathway insight
• University application enhancement
• Access to astronomy community network`
    };

    const [asteroidCampaign] = await db
      .insert(campaigns)
      .values({
        id: 3,
        ...asteroidContent,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: campaigns.id,
        set: {
          ...asteroidContent,
          updatedAt: new Date()
        }
      })
      .returning();

    console.log('✅ Asteroid Search Campaign - FULL CONTENT RESTORED');
    console.log(`   ID: ${asteroidCampaign.id}`);
    console.log(`   Title: ${asteroidCampaign.title}`);
    console.log(`   Requirements: ${asteroidCampaign.requirements?.substring(0, 50)}...`);
    console.log(`   Timeline: ${asteroidCampaign.timeline?.substring(0, 50)}...`);
    console.log(`   Outcomes: ${asteroidCampaign.outcomes?.substring(0, 50)}...\n`);

    // Verify final state
    console.log('\n📊 FINAL VERIFICATION:\n');
    const allFeaturedCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.isFeatured, true))
      .orderBy(campaigns.featuredOrder);

    allFeaturedCampaigns.forEach((c, i) => {
      console.log(`${i + 1}. ${c.title}`);
      console.log(`   Order: ${c.featuredOrder}`);
      console.log(`   Image: ${c.imageUrl}`);
      console.log(`   Price: ${c.isFree ? 'FREE' : '₹' + c.price}`);
      console.log(`   Requirements: ${c.requirements ? '✅ SET' : '❌ MISSING'}`);
      console.log(`   Timeline: ${c.timeline ? '✅ SET' : '❌ MISSING'}`);
      console.log(`   Outcomes: ${c.outcomes ? '✅ SET' : '❌ MISSING'}`);
      console.log('');
    });

    console.log('✅ ALL CAMPAIGN CONTENT FULLY RESTORED!\n');
    console.log('🔄 Refresh your browser to see ALL the detailed content.');
    console.log('📝 All requirements, timelines, and outcomes are now complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreFullCampaignContent();

