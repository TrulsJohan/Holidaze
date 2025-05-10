import { API_VENUES } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';
import { getToken } from '../../utility/middleware';

export async function deleteVenue(id) {
    if (!id) {
        throw new Error('Venue ID is required');
    }

    try {
        const token = await getToken();
        const API_KEY = await getAPIKey();
        const response = await fetch(`${API_VENUES}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Could not delete venue, status: ${response.status}`
            );
        }
        console.log('Venue deleted:', id);
        return true;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to delete venue: ${error.message}`);
    }
}
