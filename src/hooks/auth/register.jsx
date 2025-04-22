import { API_REGISTER } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function register({ name, email, password, venueManager }) {
    try {
        if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
            throw new Error('Name must be alphanumeric with underscores only');
        }
        if (!email || !/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(email)) {
            throw new Error('Email must be a valid @stud.noroff.no address');
        }
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        const API_KEY = await getAPIKey();
        const response = await fetch(API_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify({
                name,
                email,
                password,
                venueManager: venueManager || false,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Registration failed with status ${response.status}`
            );
        }

        console.log('API success response:', data);
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error(`Failed to register: ${error.message}`);
    }
}
