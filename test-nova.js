
import fetch from 'node-fetch';

async function testNova() {
    try {
        console.log('Testing Nova AI API...');

        // Test payload similar to frontend
        const payload = {
            message: "Hello Nova, are you working?",
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

        if (data.response && !data.response.includes("fluctuating") && !data.response.includes("technical difficulties")) {
            console.log('✅ Nova AI Logic Verified! (No error messages detected)');
        } else {
            console.warn('⚠️ Response looks like a fallback/error message.', data.response);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
        console.log('Make sure the server is running on localhost:5000');
    }
}

testNova();
