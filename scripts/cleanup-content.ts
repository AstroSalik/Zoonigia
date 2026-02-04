import { db } from '../server/db';
import {
    campaigns,
    courses,
    campaignParticipants,
    campaignTeamRegistrations,
    courseEnrollments,
    courseRegistrations,
    courseModules,
    courseLessons,
    courseQuizzes,
    courseReviews,
    studentProgress,
    studentProgress as studentProgressTable,
} from '../shared/schema';
import { eq, like, or, inArray } from 'drizzle-orm';

async function cleanupContent() {
    console.log('\n🧹 Starting Content Cleanup...\n');

    try {
        // 1. Remove Youth Ideathon Campaigns
        // We look for titles containing "Youth Ideathon"
        const youthCampaigns = await db
            .select()
            .from(campaigns)
            .where(like(campaigns.title, '%Youth Ideathon%'));

        if (youthCampaigns.length > 0) {
            console.log(`Found ${youthCampaigns.length} Youth Ideathon campaign(s) to remove.`);

            const campaignIds = youthCampaigns.map(c => c.id);

            // Delete dependencies first
            await db.delete(campaignTeamRegistrations).where(inArray(campaignTeamRegistrations.campaignId, campaignIds));
            console.log('   Deleted related team registrations');

            await db.delete(campaignParticipants).where(inArray(campaignParticipants.campaignId, campaignIds));
            console.log('   Deleted related participants');

            // Now delete campaigns
            await db.delete(campaigns).where(inArray(campaigns.id, campaignIds));

            youthCampaigns.forEach(c => {
                console.log(`✅ Removed Campaign: ${c.title} (ID: ${c.id})`);
            });
        } else {
            console.log('ℹ️ No Youth Ideathon campaigns found.');
        }

        // 2. Remove Quantum Computing Courses
        const quantumCourses = await db
            .select()
            .from(courses)
            .where(like(courses.title, '%Quantum Computing%'));

        if (quantumCourses.length > 0) {
            console.log(`Found ${quantumCourses.length} Quantum Computing course(s) to remove.`);

            const courseIds = quantumCourses.map(c => c.id);

            // Delete dependencies first
            // Note: This is simplified. Deeply nested deletions (quizzes, lessons within modules) might need more steps
            // if CASCADE isn't set up in DB, but let's try shallow first or assume cascade for deeper items.
            // Actually, let's be thorough.

            // Get lessons to delete progress
            const lessons = await db.select({ id: courseLessons.id }).from(courseLessons).where(inArray(courseLessons.courseId, courseIds));
            const lessonIds = lessons.map(l => l.id);

            if (lessonIds.length > 0) {
                await db.delete(studentProgress).where(inArray(studentProgress.lessonId, lessonIds));
                // Quizzes linked to lessons? schema says quiz has courseId, so we can use that.
            }

            await db.delete(courseReviews).where(inArray(courseReviews.courseId, courseIds));
            await db.delete(courseEnrollments).where(inArray(courseEnrollments.courseId, courseIds));
            await db.delete(courseRegistrations).where(inArray(courseRegistrations.courseId, courseIds));

            // Delete quizzes
            await db.delete(courseQuizzes).where(inArray(courseQuizzes.courseId, courseIds));

            // Delete lessons
            await db.delete(courseLessons).where(inArray(courseLessons.courseId, courseIds));

            // Delete modules
            await db.delete(courseModules).where(inArray(courseModules.courseId, courseIds));

            // Finally delete courses
            await db.delete(courses).where(inArray(courses.id, courseIds));

            quantumCourses.forEach(c => {
                console.log(`✅ Removed Course: ${c.title} (ID: ${c.id})`);
            });
        } else {
            console.log('ℹ️ No Quantum Computing courses found.');
        }

        console.log('\n✨ Cleanup Complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupContent();
