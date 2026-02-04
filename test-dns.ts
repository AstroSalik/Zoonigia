
import dns from 'dns';

const host = 'ep-misty-snow-a19bsw78-pooler.ap-southeast-1.aws.neon.tech';
console.log(`Looking up ${host}...`);

dns.lookup(host, (err, address, family) => {
    if (err) {
        console.error('DNS Lookup failed:', err);
    } else {
        console.log(`Resolved: ${address} (IPv${family})`);
    }
});
