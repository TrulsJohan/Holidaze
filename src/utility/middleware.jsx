export async function getToken() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Token not found');
        }
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw new Error('Failed to retrieve token');
    }
}

export async function getAPIKey() {
    try {
        const API_KEY = import.meta.env.VITE_API_KEY;
        if (!API_KEY) {
            throw new Error('VITE_API_KEY not found in environment variables');
        }
        return API_KEY;
    } catch (error) {
        console.error('Error retrieving API key:', error);
        throw new Error(`Failed to retrieve API key: ${error.message}`);
    }
}
