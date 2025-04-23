import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getVenue } from '../../hooks/venue/getVenue';
import { CreateBookingForm } from '../../components/Forms/CreateBookingForm';
import { createBooking } from '../../hooks/booking/createBooking';
import { VenueCard } from '../../components/Cards/VenueCard';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '240px',
    borderRadius: '8px',
};

const libraries = ['marker'];

export function RenderVenue() {
    const [venue, setVenue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const { id } = useParams();
    const mapRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

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

    useEffect(() => {
        if (
            isLoaded &&
            mapRef.current &&
            venue &&
            venue.location &&
            venue.location.lat &&
            venue.location.lng
        ) {
            const map = mapRef.current;
            const position = {
                lat: venue.location.lat,
                lng: venue.location.lng,
            };
            console.log('Creating AdvancedMarkerElement at:', position);
            console.log(
                'Map ID used:',
                import.meta.env.VITE_GOOGLE_MAPS_MAP_ID
            );

            new google.maps.marker.AdvancedMarkerElement({
                map,
                position,
            });
        }
    }, [isLoaded, venue]);

    const hasValidLocation = venue && venue.location && venue.location.lat && venue.location.lng;
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

    if (!mapId) {
        console.error('VITE_GOOGLE_MAPS_MAP_ID is not defined in .env');
    }

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
                        <VenueCard venue={venue} />
                        <div>
                            <CreateBookingForm
                                venueId={id}
                                onSubmit={handleBookingSubmit}
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
                        <div className="flex flex-col w-full">
                            {hasValidLocation && isLoaded && mapId ? (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={{
                                        lat: venue.location.lat,
                                        lng: venue.location.lng,
                                    }}
                                    zoom={15}
                                    onLoad={(map) => {
                                        console.log(
                                            'Map loaded with mapId:',
                                            mapId
                                        );
                                        mapRef.current = map;
                                    }}
                                    mapId={mapId}
                                />
                            ) : hasValidLocation && !isLoaded ? (
                                <div className="bg-gray-200 p-4 rounded-md text-center text-gray-600">
                                    Loading map...
                                </div>
                            ) : hasValidLocation && !mapId ? (
                                <div className="bg-gray-200 p-4 rounded-md text-center text-gray-600">
                                    Map configuration error: Missing Map ID
                                </div>
                            ) : (
                                <div className="bg-gray-200 p-4 rounded-md text-center text-gray-600">
                                    Location not available
                                </div>
                            )}
                            <div className="flex flex-row border-b border-r border-l bg-gray-100 border-gray-700 rounded-b-lg justify-between items-center w-full p-3 gap-6">
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
