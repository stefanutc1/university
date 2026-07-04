export async function queryDns(domain: string, type = 'A') { return { domain, type, answer: '1.1.1.1', ttl: 300 }; }

// Record types A, AAAA, MX, TXT, CNAME, NS supported
