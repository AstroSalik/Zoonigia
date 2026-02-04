
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug-log.txt', msg + '\n');
}

async function debugGemini() {
    fs.writeFileSync('debug-log.txt', 'Starting debug...\n');
    log('🔍 Debugging Gemini API (ESM File Log)...');
    const apiKey = process.env.GEMINI_API_KEY;
    log('🔑 API Key present: ' + !!apiKey);

    if (!apiKey) {
        log('❌ No API KEY');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        log('📤 Sending prompt...');

        // Add a race with timeout
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000));
        const request = model.generateContent('Hello! Just say "Working"');

        const result = await Promise.race([request, timeout]);
        const response = await result.response;
        const text = response.text();

        log('✅ Gemini Success!');
        log('📝 Response: ' + text);
    } catch (error) {
        log('❌ Gemini Failed: ' + error.message);
    }
}

debugGemini();
