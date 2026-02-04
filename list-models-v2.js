
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const logFile = 'list-log.txt';
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

const apiKey = process.env.GEMINI_API_KEY;

async function checkModels() {
    log('Starting checkModels...');
    if (!apiKey) {
        log("No API Key");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        log(`Fetching models from ${url.replace(apiKey, 'HIDDEN')}...`);
        // Check if fetch exists
        if (typeof fetch === 'undefined') {
            log('❌ global fetch is not defined! Node version might be too old.');
            return;
        }

        const response = await fetch(url);
        log(`Response status: ${response.status}`);

        const text = await response.text();
        log(`Response body length: ${text.length}`);

        fs.writeFileSync('available-models.json', text);
        log("✅ Reached end of script.");

    } catch (e) {
        log("❌ Fetch failed: " + e.message);
    }
}

checkModels().catch(err => log("Global error: " + err.message));
