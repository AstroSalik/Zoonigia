
import fetch from 'node-fetch';

async function testNova() {
    try {
        console.log('Testing Nova AI API...');

        // Test payload similar to frontend
        const payload = {
            message: "Hello Nova, what is Zoonigia?",
            history: [],
            userId: "test-user"
        };

        const response = await fetch('http://localhost:5000/api/nova', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Nova Response:', JSON.stringify(data, null, 2));

        if (data.response && (data.response.includes("Zoonigia") || data.response.includes("cosmic"))) {
            console.log('✅ Nova AI Logic Verified!');
        } else {
            console.warn('⚠️ Response received but content might be fallback/unexpected.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testNova();
