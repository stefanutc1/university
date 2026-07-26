export async function fetchRatesFromBackend(baseUrl = 'http://localhost:8080') { return fetch(`${baseUrl}/api/v1/rates`); }
