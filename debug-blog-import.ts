
import { spawn } from 'child_process';

console.log("Starting debug wrapper...");

const child = spawn('npx.cmd', ['tsx', 'import-wordpress-blogs.ts'], {
    shell: true,
    cwd: process.cwd(),
    stdio: 'pipe'
});

child.stdout.on('data', (data) => {
    console.log(`[STDOUT] ${data}`);
});

child.stderr.on('data', (data) => {
    console.log(`[STDERR] ${data}`);
});

child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});
