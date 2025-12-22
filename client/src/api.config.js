const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('--- API CONFIG ---');
console.log('API_URL:', API_URL);
console.log('ENV:', import.meta.env.MODE);

export default API_URL;
