// This will use the VITE_API_URL environment variable if set (in production),
// otherwise it defaults to localhost for development.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
