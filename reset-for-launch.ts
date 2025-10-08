/**
 * Reset Database for Production Launch
 * This script clears test data while keeping essential content
 * 
 * Run with: npx tsx reset-for-launch.ts
 */

import { config } from "dotenv";
config(); // Load environment variables from .env

import { db } from "./server/db";
import { 
  courseEnrollments, 
  workshopEnrollments, 
  campaignParticipants,
  studentProgress,
  quizAttempts,
  courseReviews,
  courseCertificates,
  invoices,
  refundRequests,
  campaignTeamRegistrations,
  workshopRegistrations,
  contactInquiries,
  loveMessages,
  userPoints,
  userBadges,
  pointTransactions
} from "./shared/schema";

async function resetForLaunch() {
  console.log("🚀 Resetting database for production launch...\n");

  try {
    // 1. Clear all enrollments
    console.log("📚 Clearing course enrollments...");
    await db.delete(courseEnrollments);
    console.log("✅ Course enrollments cleared");

    // 2. Clear student progress
    console.log("📊 Clearing student progress...");
    await db.delete(studentProgress);
    console.log("✅ Student progress cleared");

    // 3. Clear quiz attempts
    console.log("📝 Clearing quiz attempts...");
    await db.delete(quizAttempts);
    console.log("✅ Quiz attempts cleared");

    // 4. Clear course reviews
    console.log("⭐ Clearing course reviews...");
    await db.delete(courseReviews);
    console.log("✅ Course reviews cleared");

    // 5. Clear certificates
    console.log("🎓 Clearing certificates...");
    await db.delete(courseCertificates);
    console.log("✅ Certificates cleared");

    // 6. Clear invoices
    console.log("🧾 Clearing invoices...");
    await db.delete(invoices);
    console.log("✅ Invoices cleared");

    // 7. Clear refund requests
    console.log("💰 Clearing refund requests...");
    await db.delete(refundRequests);
    console.log("✅ Refund requests cleared");

    // 8. Clear workshop enrollments
    console.log("🔬 Clearing workshop enrollments...");
    await db.delete(workshopEnrollments);
    console.log("✅ Workshop enrollments cleared");

    // 9. Clear workshop registrations
    console.log("📋 Clearing workshop registrations...");
    await db.delete(workshopRegistrations);
    console.log("✅ Workshop registrations cleared");

    // 10. Clear campaign participants
    console.log("🚀 Clearing campaign participants...");
    await db.delete(campaignParticipants);
    console.log("✅ Campaign participants cleared");

    // 11. Clear campaign team registrations
    console.log("👥 Clearing campaign team registrations...");
    await db.delete(campaignTeamRegistrations);
    console.log("✅ Campaign team registrations cleared");

    // 12. Clear contact inquiries (optional - comment out if you want to keep them)
    console.log("📧 Clearing contact inquiries...");
    await db.delete(contactInquiries);
    console.log("✅ Contact inquiries cleared");

    // 13. Clear special messages (optional)
    console.log("💌 Clearing special communications...");
    await db.delete(loveMessages);
    console.log("✅ Special communications cleared");

    // 14. Clear gamification data
    console.log("🎮 Clearing gamification data...");
    await db.delete(pointTransactions);
    await db.delete(userBadges);
    await db.delete(userPoints);
    console.log("✅ Gamification data cleared");

    console.log("\n🎉 Database reset complete!");
    console.log("\n📋 What was cleared:");
    console.log("  ✅ All enrollments and registrations");
    console.log("  ✅ All student progress and quiz attempts");
    console.log("  ✅ All reviews and certificates");
    console.log("  ✅ All invoices and refund requests");
    console.log("  ✅ All contact inquiries and messages");
    console.log("  ✅ All gamification data");
    console.log("\n📦 What was kept:");
    console.log("  ✅ Users (accounts remain)");
    console.log("  ✅ Courses (content remains)");
    console.log("  ✅ Workshops (content remains)");
    console.log("  ✅ Campaigns (content remains)");
    console.log("  ✅ Blog posts (content remains)");
    console.log("  ✅ Badges (definitions remain)");
    console.log("\n🚀 Your platform is ready for launch!");

  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
}

// Run the reset
resetForLaunch()
  .then(() => {
    console.log("\n✨ Done! You can now launch your platform.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Reset failed:", error);
    process.exit(1);
  });

