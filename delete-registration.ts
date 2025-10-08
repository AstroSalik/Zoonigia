import { config } from "dotenv";
config();

import { db } from "./server/db";
import { campaigns, campaignParticipants } from "./shared/schema";
import { eq, and, like } from "drizzle-orm";

async function deleteRegistration() {
  try {
    // Find Research Programme campaign
    const researchCampaigns = await db.select().from(campaigns)
      .where(like(campaigns.title, '%Research%'));
    
    console.log("\n📋 Found campaigns matching 'Research':");
    researchCampaigns.forEach(c => {
      console.log(`  - ID: ${c.id}, Title: ${c.title}`);
    });

    if (researchCampaigns.length === 0) {
      console.log("\n❌ No 'Research Programme' campaign found.");
      return;
    }

    const campaignId = researchCampaigns[0].id;
    console.log(`\n🎯 Using campaign: ${researchCampaigns[0].title} (ID: ${campaignId})`);

    // Get all participants for this campaign
    const participants = await db.select().from(campaignParticipants)
      .where(eq(campaignParticipants.campaignId, campaignId));

    console.log(`\n👥 Found ${participants.length} participant(s):`);
    participants.forEach(p => {
      console.log(`  - User ID: ${p.userId}`);
    });

    if (participants.length === 0) {
      console.log("\n✅ No registrations to delete.");
      return;
    }

    // Delete all registrations for this campaign
    await db.delete(campaignParticipants)
      .where(eq(campaignParticipants.campaignId, campaignId));

    console.log(`\n✅ Successfully deleted ${participants.length} registration(s) for campaign ID ${campaignId}!`);
    console.log("\n🎉 You can now register again!");

  } catch (error) {
    console.error("\n❌ Error:", error);
  }
  process.exit(0);
}

deleteRegistration();

