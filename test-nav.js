
import fetch from 'node-fetch';

async function testNavigation() {
    try {
        console.log('Testing Nova Navigation Intent...');

        const payload = {
            message: "Take me to the dashboard",
            history: [],
            userId: "test-user"
        };

        const response = await fetch('http://localhost:5000/api/nova', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('✅ Nav Response:', JSON.stringify(data, null, 2));

        if (data.action && data.action.includes("dashboard")) {
            console.log('✅ Navigation Logic Verified!');
        } else {
            console.warn('⚠️ Navigation action missing or incorrect.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testNavigation();
