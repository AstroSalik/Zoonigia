
import fetch from 'node-fetch';

async function testFounderInfo() {
    try {
        console.log('Testing Nova Founder Knowledge...');

        const payload = {
            message: "Who is the founder of Zoonigia?",
            history: [],
            userId: "test-user"
        };

        const response = await fetch('http://localhost:5000/api/nova', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('📝 Response:', data.response);

        if (data.response && (data.response.includes("Salik Riyaz") || data.response.includes("Salik"))) {
            console.log('✅ Founder Knowledge Verified!');
        } else {
            console.warn('⚠️ Founder name missing in response.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testFounderInfo();
