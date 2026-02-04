
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        fs.writeFileSync('debug-models-log.txt', 'No API Key found\n');
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    // Check key format (partial)
    fs.writeFileSync('debug-models-log.txt', `API Key starts with: ${apiKey.substring(0, 4)}...\n`);

    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-pro-latest', 'gemini-pro', 'gemini-1.0-pro'];

    for (const m of modelsToTry) {
        fs.appendFileSync('debug-models-log.txt', `Trying model: ${m}...\n`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent('Hi');
            const response = await result.response;
            fs.appendFileSync('debug-models-log.txt', `✅ Model ${m} is WORKING. Response: ${response.text()}\n`);
        } catch (e) {
            fs.appendFileSync('debug-models-log.txt', `❌ Model ${m} failed: ${e.message}\n`);
        }
    }
}

listModels();
