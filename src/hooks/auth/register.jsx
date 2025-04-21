import { API_REGISTER } from '../../utility/constants';

export async function register({ name, email, password, venueManager }) {
    const response = await fetch(API_REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            password,
            venueManager: venueManager || false,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
}
