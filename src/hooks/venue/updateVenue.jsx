import { toast } from 'react-toastify';
import { getAPIKey } from '../../utility/middleware';
import { API_VENUES } from '../../utility/constants';
import { getToken } from '../../utility/middleware';

export async function updateVenue(id, venueData) {
    try {
        const API_KEY = await getAPIKey();
        const token = await getToken();
        const response = await fetch(`${API_VENUES}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify(venueData),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Could not update venue, status: ${response.status}`
            );
        }

        console.log('Venue updated:', data);
        toast.success('Venue updated successfully!');
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        toast.error(`Failed to update venue: ${error.message}`);
        throw new Error(`Failed to update venue: ${error.message}`);
    }
}
