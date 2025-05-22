import { toast } from 'react-toastify';
import { API_BOOKINGS } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';
import { getToken } from '../../utility/middleware';

export async function createBooking(bookingData) {
    if (
        !bookingData.dateFrom ||
        !bookingData.dateTo ||
        !bookingData.guests ||
        !bookingData.venueId
    ) {
        throw new Error('dateFrom, dateTo, guests, and venueId are required');
    }

    try {
        const token = await getToken();
        const API_KEY = await getAPIKey();
        const response = await fetch(`${API_BOOKINGS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('API error response:', data);
            throw new Error(
                data.message ||
                    `Could not create booking, status: ${response.status}`
            );
        }

        console.log('Booking created:', data);
        toast.success('Booking created successfully!');
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        toast.error(`Failed to create booking: ${error.message}`);
        throw new Error(`Failed to create booking: ${error.message}`);
    }
}
