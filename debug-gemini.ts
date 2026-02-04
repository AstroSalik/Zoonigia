
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function debugGemini() {
    console.log('🔍 Debugging Gemini API...');
    console.log('🔑 API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('m', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ No API KEY');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log('📤 Sending prompt...');
        const result = await model.generateContent('Hello! Are you working?');
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini Success!');
        console.log('📝 Response:', text);
    } catch (error: any) {
        console.error('❌ Gemini Failed:', error.message);
        // console.error(JSON.stringify(error, null, 2));
    }
}

debugGemini();
