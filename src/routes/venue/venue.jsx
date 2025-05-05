import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVenue } from '../../hooks/venue/getVenue';
import { CreateBookingForm } from '../../components/Forms/CreateBookingForm';
import { createBooking } from '../../hooks/booking/createBooking';
import { VenueCard } from '../../components/Cards/VenueCard';
import GoogleMap from '../../components/UI/GoogleMaps';

export function RenderVenue() {
    const [venue, setVenue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchVenue = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getVenue(id);
                console.log('RenderVenue venue data:', response.data);
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

    const handleBookingSubmit = async (bookingData) => {
        setBookingError(null);
        try {
            await createBooking(bookingData);
        } catch (error) {
            console.error('Error creating booking:', error);
            setBookingError(error.message || 'Failed to create booking');
        }
    };

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
                    <div className="flex flex-col gap-6 w-full">
                        <VenueCard venue={venue} useCarousel={true} />
                        <div>
                            <CreateBookingForm
                                venueId={id}
                                onSubmit={handleBookingSubmit}
                                bookings={venue.bookings}
                                maxGuests={venue.maxGuests}
                            />
                            {bookingError && (
                                <p className="text-red-500 text-center mt-4">
                                    {bookingError}
                                </p>
                            )}
                        </div>
                        <p className="text-wrap text-sm text-gray-900 w-full overflow-hidden">
                            {venue.description}
                        </p>
                        <div className="flex flex-col w-full border border-gray-900 rounded-lg">
                            <GoogleMap venue={venue} />
                            <div className="flex flex-row bg-gray-100 rounded-b-lg justify-between items-center w-full p-3 gap-6">
                                <div>
                                    <img
                                        className="rounded-full w-[50px] h-[50px]"
                                        src={venue.owner.avatar.url}
                                        alt={
                                            venue.owner.avatar.alt ||
                                            'Owner avatar'
                                        }
                                    />
                                </div>
                                <div className="flex flex-col text-xs text-gray-900 overflow-hidden">
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
