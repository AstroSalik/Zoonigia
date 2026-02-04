
import WebSocket from 'ws';

console.log('Starting WS test...');
try {
    const ws = new WebSocket('wss://echo.websocket.org');
    console.log('WebSocket instance created');
    ws.on('open', () => {
        console.log('WebSocket connected');
        ws.close();
        process.exit(0);
    });
    ws.on('error', (e) => {
        console.log('WebSocket error (expected if offline):', e.message);
        process.exit(0);
    });
} catch (e) {
    console.error('CRASH:', e);
    process.exit(1);
}
