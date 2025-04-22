import { API_VENUES } from '../../utility/constants';
import { getAPIKey } from '../../utility/middleware';

export async function getVenues(page = 1, limit = 20) {
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

export async function getAllVenues() {
    try {
        const firstPage = await getVenues(1, 100);
        const totalCount = firstPage.meta.totalCount || firstPage.data.length;
        const pageCount = Math.ceil(totalCount / 100);

        const allVenues = [...firstPage.data];

        if (pageCount > 1) {
            const remainingPages = await Promise.all(
                Array.from({ length: pageCount - 1 }, (_, i) =>
                    getVenues(i + 2, 100)
                )
            );
            remainingPages.forEach((page) => allVenues.push(...page.data));
        }

        return {
            data: allVenues,
            meta: { totalCount, pageCount: Math.ceil(totalCount / 100) },
        };
    } catch (error) {
        console.error('Fetch all venues error:', error);
        throw new Error(`Failed to fetch all venues: ${error.message}`);
    }
}
