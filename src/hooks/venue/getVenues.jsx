import { API_VENUES } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function getVenues(page = 1, limit = 100) {
    if (limit > 100) {
        throw new Error('Limit cannot exceed 100');
    }

    try {
        const API_KEY = await getAPIKey();
        const response = await fetch(
            `${API_VENUES}?page=${page}&limit=${limit}&_owner=true&_bookings=true`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Noroff-API-Key': API_KEY,
                },
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Could not fetch venues, status: ${response.status}`
            );
        }

        console.log('API success response:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to fetch venues: ${error.message}`);
    }
}
