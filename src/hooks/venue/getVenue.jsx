import { API_VENUES } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function getVenue(venueId) {
    if (!venueId) {
        throw new Error('Venue ID is required');
    }

    try {
        const API_KEY = await getAPIKey();
        const response = await fetch(
            `${API_VENUES}/${venueId}?_owner=true&_bookings=true`, {
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
                    `Could not fetch venue, status: ${response.status}`
            );
        }
        console.log(data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to fetch venue: ${error.message}`);
    }
}
