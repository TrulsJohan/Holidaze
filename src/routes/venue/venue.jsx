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
            <div className="min-h-screen p-8">
                {loading && (
                    <p className="text-gray-900 text-center">
                        Loading venue...
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {venue && !loading && !error && (
                    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                        <VenueCard venue={venue} />
                        <p className="text-wrap text-sm text-gray-900 w-full">
                            {venue.description}
                        </p>
                        <div className='flex flex-col w-full'>
                            <div className='bg-gray-700'>
                                Google Maps
                            </div>
                            <div className='flex flex-row border bg-gray-100 border-gray-700 rounded-lg justify-between items-center w-full p-3 gap-6'>
                                <div className=''>
                                    <img
                                        className="rounded-full w-[50px] h-[50px]"
                                        src={venue.owner.avatar.url}
                                        alt={venue.owner.avatar.alt}
                                    />
                                </div>
                                <div className='flex flex-col text-xs text-gray-900 overflow-hidden'>
                                    <p>{venue.owner.name}</p>
                                    <p>{venue.owner.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!venue && !loading && !error && (
                    <p className="text-gray-900 text-center">No venue found.</p>
                )}
            </div>
        </>
    );
}
