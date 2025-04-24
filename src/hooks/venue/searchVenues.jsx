import { API_VENUES } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function searchVenues(page = 1, limit = 20, searchQuery) {
    if (limit > 100) {
        throw new Error('Limit cannot exceed 100');
    }

    try {
        const API_KEY = await getAPIKey();
        const response = await fetch(
            `${API_VENUES}/search?q=${encodeURIComponent(
                searchQuery
            )}&page=${page}&limit=${limit}&_owner=true&_bookings=true`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Noroff-API-Key': API_KEY,
                    Authorization: `Bearer ${
                        localStorage.getItem('accessToken') || ''
                    }`,
                },
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Could not search venues, status: ${response.status}`
            );
        }

        console.log('API success response:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to search venues: ${error.message}`);
    }
}
