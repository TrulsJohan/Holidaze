import { toast } from 'react-toastify';
import { API_LOGIN } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function login({ email, password }) {
    try {
        if (!email || !/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(email)) {
            throw new Error('Email must be a valid @stud.noroff.no address');
        }
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        const API_KEY = await getAPIKey();
        const response = await fetch(`${API_LOGIN}?_holidaze=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message || `Login failed with status ${response.status}`
            );
        }

        localStorage.setItem('name', data.data.name);
        localStorage.setItem('venueManager', String(data.data.venueManager));
        localStorage.setItem('accessToken', data.data.accessToken);

        console.log('API success response:', data);
        toast.success('Login successful!');
        return data;
    } catch (error) {
        console.error('Login error:', error);
        toast.error(`Failed to login: ${error.message}`);
        throw new Error(`Failed to login: ${error.message}`);
    }
}
