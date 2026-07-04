export async function queryDns(domain: string, type = 'A') { return { domain, type, answer: '1.1.1.1', ttl: 300 }; }
