import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenue } from '../../hooks/venue/getVenue';
import { CreateBookingForm } from '../../components/Forms/CreateBookingForm';
import { createBooking } from '../../hooks/booking/createBooking';
import { deleteVenue } from '../../hooks/venue/deleteVenue';
import { VenueCard } from '../../components/Cards/VenueCard';
import GoogleMap from '../../components/UI/GoogleMaps';
import { IoIosArrowBack } from 'react-icons/io';

export function RenderVenue() {
    const [venue, setVenue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAndVenue = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('accessToken');
                setIsLoggedIn(!!token);

                const venueResponse = await getVenue(id);
                console.log('RenderVenue venue data:', venueResponse.data);
                setVenue(venueResponse.data);

                if (token && venueResponse.data.owner) {
                    const userName = localStorage.getItem('name');
                    setIsOwner(userName === venueResponse.data.owner.name);
                }
            } catch (error) {
                console.error('Error fetching venue:', error);
                setError(error.message || 'Failed to load venue');
            } finally {
                setLoading(false);
            }
        };

        checkUserAndVenue();
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

    const handleEdit = () => {
        navigate(`/venue/update/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            try {
                await deleteVenue(id);
                navigate('/');
            } catch (error) {
                setError(error.message || 'Failed to delete venue');
            }
        }
    };

    const handleBack = () => {
        if (venue.owner.name === localStorage.getItem('name')) {
            navigate('/profile');
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <title>Holidaze | {venue ? venue.name : 'Venue'}</title>
            <div className="min-h-screen p-8">
                <div className="flex justify-start mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-gray-900 text-sm font-semibold hover:underline">
                        <span>
                            <IoIosArrowBack />
                        </span>{' '}
                        {isOwner ? <p>Back to Profile</p> : <p>Back home</p>}
                    </button>
                </div>
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
                            {isOwner ? (
                                <div className="flex gap-2 bg-gray-900 p-2 rounded-lg shadow-md">
                                    <button
                                        onClick={handleEdit}
                                        className="w-full text-sm py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-sm py-2 bg-gray-900 text-gray-50 border border-gray-100 rounded-lg hover:bg-gray-700">
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <CreateBookingForm
                                    venueId={id}
                                    onSubmit={handleBookingSubmit}
                                    bookings={venue.bookings}
                                    maxGuests={venue.maxGuests}
                                    isLoggedIn={isLoggedIn}
                                />
                            )}
                            {bookingError && !isOwner && (
                                <p className="text-red-500 text-center mt-4">
                                    {bookingError}
                                </p>
                            )}
                        </div>
                        <div className="my-4">
                            <h4>Description:</h4>
                            <p className="text-wrap text-sm text-gray-900 w-full overflow-hidden">
                                {venue.description}
                            </p>
                        </div>
                        <div className="flex flex-col w-full border border-gray-900 rounded-lg">
                            <GoogleMap venue={venue} />
                            <div className="flex flex-row bg-gray-100 rounded-b-lg justify-between items-center w-full p-3 gap-6">
                                <div className="w-[80px]">
                                    <img
                                        className="rounded-full w-[50px] h-[50px]"
                                        src={venue.owner.avatar.url}
                                        alt={
                                            venue.owner.avatar.alt ||
                                            'Owner avatar'
                                        }
                                    />
                                </div>
                                <div className="flex flex-col w-full text-xs text-gray-900 overflow-hidden">
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
