import { API_REGISTER } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function register(reqBody) {
    try {
        if (!reqBody || typeof reqBody !== 'object') {
            throw new Error('Request body is required and must be an object');
        }
        const { username, email, password } = reqBody;
        if (!username || !email || !password) {
            throw new Error('Username, email, and password are required');
        }

        const API_KEY = await getAPIKey().catch((err) => {
            throw new Error(`Failed to fetch API key: ${err.message}`);
        });
        if (!API_KEY) {
            throw new Error('API key is missing');
        }

        const res = await fetch(API_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify(reqBody),
        });

        if (!res.ok) {
            let errorMessage = `HTTP error! Status: ${res.status}`;
            try {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await res.json();
                    errorMessage = errorData.message || JSON.stringify(errorData);
                } else {
                    errorMessage = await res.text();
                }
            } catch (parseError) {
                console.warn('Failed to parse error response:', parseError);
            }
            throw new Error(errorMessage);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Expected JSON response from API');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error(`Registration failed: ${error.message}`);
    }
}
