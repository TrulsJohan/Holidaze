import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVenue } from '../../hooks/venue/getVenue';
import { VenueCard } from '../../components/Cards/VenueCard';

export function RenderVenue() {
    const [venue, setVenue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchVenue = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getVenue(id);
                setVenue(response.data);
            } catch (error) {
                console.error('Error fetching venue:', error);
                setError(error.message || 'Failed to load venue');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [id]);

    return (
        <>
            <title>Holidaze | {venue ? venue.name : 'Venue'}</title>
            <div className="min-h-screen bg-gray-100 p-8">
                {loading && (
                    <p className="text-gray-900 text-center">
                        Loading venue...
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {venue && !loading && !error && (
                    <div className="max-w-3xl mx-auto">
                        <VenueCard venue={venue} />
                    </div>
                )}
                {!venue && !loading && !error && (
                    <p className="text-gray-900 text-center">No venue found.</p>
                )}
            </div>
        </>
    );
}
