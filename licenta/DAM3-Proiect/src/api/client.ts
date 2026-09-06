export const API_BASE = 'http://localhost:8080/api/v1';
export async function getHealth() { return fetch(`${API_BASE}/health`); }
