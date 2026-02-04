
import WebSocket from 'ws';

console.log('Testing WS import...');
try {
    console.log('WebSocket type:', typeof WebSocket);
    console.log('WebSocket:', WebSocket);
} catch (e) {
    console.error('WS error:', e);
}

// Now try importing db
import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
    try {
        console.log('Testing DB connection...');
        const result = await db.execute(sql`SELECT 1`);
        console.log('✅ Connection successful:', result);
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
