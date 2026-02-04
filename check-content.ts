
import { db } from './server/db';
import { campaigns, blogPosts } from './shared/schema';
import { sql } from 'drizzle-orm';

async function checkContent() {
    try {
        console.log("Checking database content...");
        const campCount = await db.select({ count: sql`count(*)` }).from(campaigns);
        const blogCount = await db.select({ count: sql`count(*)` }).from(blogPosts);

        console.log(`✅ Campaigns found: ${campCount[0].count}`);
        console.log(`✅/❌ Blog Posts found: ${blogCount[0].count}`);

        process.exit(0);
    } catch (e) {
        console.error("❌ Error checking content:", e);
        process.exit(1);
    }
}

checkContent();
