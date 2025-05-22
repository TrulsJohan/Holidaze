import { toast } from 'react-toastify';
import { API_BOOKINGS } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';
import { getToken } from '../../utility/middleware';

export async function deleteBooking(id) {
    if (!id) {
        throw new Error('Booking ID is required');
    }

    try {
        const token = await getToken();
        const API_KEY = await getAPIKey();
        const response = await fetch(`${API_BOOKINGS}/${id}`, {
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
                    `Could not cancel booking, status: ${response.status}`
            );
        }

        console.log('Booking cancelled:', id);
        toast.success('Booking cancelled successfully!');
        return true;
    } catch (error) {
        console.error('Fetch error:', error);
        toast.error(`Failed to cancel booking: ${error.message}`);
        throw new Error(`Failed to cancel booking: ${error.message}`);
    }
}
