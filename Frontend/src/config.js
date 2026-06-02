// Development: uses Vite proxy at /api (configured in vite.config.js)
// Production: uses VITE_API_URL environment variable or backend API_URL
const API_BASE = import.meta.env.VITE_API_URL || '/api';
export { API_BASE };


