
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function checkModels() {
    if (!apiKey) {
        console.log("No API Key");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log(`Fetching models from ${url.replace(apiKey, 'HIDDEN')}...`);
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            fs.writeFileSync('available-models.json', JSON.stringify(data, null, 2));
            console.log("✅ Models found! Saved to available-models.json");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("❌ No models returned. Response:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.log("❌ Fetch failed:", e.message);
    }
}

checkModels();
