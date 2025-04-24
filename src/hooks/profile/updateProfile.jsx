import { getAPIKey } from '../../utility/middleware';
import { API_PROFILE } from '../../utility/constants';
import { getToken } from '../../utility/middleware';

export async function updateProfile(name, profileData) {
    try {
        const API_KEY = await getAPIKey();
        const token = await getToken();
        const response = await fetch(`${API_PROFILE}/${name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Could not update profile, status: ${response.status}`
            );
        }

        console.log('Profile updated:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
    }
}
