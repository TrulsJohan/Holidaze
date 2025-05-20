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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <title>Holidaze | Venue</title>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
                <div className="max-w-md sm:max-w-xl lg:max-w-4xl mx-auto">
                    <div className="flex justify-start mb-4 sm:mb-6 lg:mb-8">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1 text-gray-900 text-sm sm:text-base font-semibold hover:underline">
                            <span>
                                <IoIosArrowBack className="text-base sm:text-lg" />
                            </span>
                            {isOwner ? (
                                <p>Back to Profile</p>
                            ) : (
                                <p>Back home</p>
                            )}
                        </button>
                    </div>
                    {loading && (
                        <p className="text-gray-900 text-center text-sm sm:text-base">
                            Loading venue...
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 text-center text-sm sm:text-base">
                            {error}
                        </p>
                    )}
                    {venue && !loading && !error && (
                        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full max-w-full">
                            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
                                <div className="w-full md:w-4/7">
                                    <VenueCard
                                        venue={venue}
                                        useCarousel={true}
                                    />
                                </div>
                                <div className="w-full md:w-3/7">
                                    {isOwner ? (
                                        <div className="flex gap-2 sm:gap-3 bg-gray-900 p-2 sm:p-3 rounded-lg shadow-md">
                                            <button
                                                onClick={handleEdit}
                                                className="w-full text-sm sm:text-base py-2 sm:py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="w-full text-sm sm:text-base py-2 sm:py-3 bg-gray-900 text-gray-50 border border-gray-100 rounded-lg hover:bg-gray-700">
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
                                        <p className="text-red-500 text-center text-sm sm:text-base mt-4 sm:mt-6">
                                            {bookingError}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="my-4 sm:my-6 lg:my-8">
                                <h4 className="text-gray-900">
                                    Description:
                                </h4>
                                <p className="text-sm sm:text-base text-gray-900 w-full overflow-hidden">
                                    {venue.description}
                                </p>
                            </div>
                            {isOwner && venue.bookings.length > 0 ? (
                                <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-full rounded-lg">
                                    <h4 className="text-lg sm:text-xl text-gray-900">
                                        Bookings
                                    </h4>
                                    {venue.bookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex flex-col bg-gray-900 p-2 sm:p-3 rounded-lg text-gray-50">
                                            <div className="flex flex-row bg-gray-100 rounded-t-lg border-b border-gray-900 justify-between items-center w-full p-2 sm:p-3 gap-4 sm:gap-6">
                                                <div className="w-12 sm:w-16">
                                                    <img
                                                        className="rounded-full w-10 sm:w-12 h-10 sm:h-12"
                                                        src={
                                                            booking.customer
                                                                .avatar.url
                                                        }
                                                        alt={
                                                            booking.customer
                                                                .avatar.alt ||
                                                            'Owner avatar'
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full text-xs sm:text-sm text-gray-900 overflow-hidden">
                                                    <p>
                                                        {booking.customer.name}
                                                    </p>
                                                    <p>
                                                        {booking.customer.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="flex flex-col bg-gray-100 border-r text-xs sm:text-sm text-gray-900 w-full p-2 sm:p-3">
                                                    <p className="text-gray-700">
                                                        From
                                                    </p>
                                                    {formatDate(
                                                        booking.dateFrom
                                                    )}
                                                </div>
                                                <div className="flex flex-col bg-gray-100 text-xs sm:text-sm text-gray-900 w-full p-2 sm:p-3">
                                                    <p className="text-gray-700">
                                                        To
                                                    </p>
                                                    {formatDate(booking.dateTo)}
                                                </div>
                                            </div>
                                            <div className="flex flex-row border-t border-gray-900">
                                                <div className="flex flex-col bg-gray-100 border-r text-xs sm:text-sm rounded-bl-lg text-gray-900 w-full p-2 sm:p-3">
                                                    <p className="text-gray-700">
                                                        Guests
                                                    </p>
                                                    <p>
                                                        {booking.guests} guest
                                                        {booking.guests !== 1
                                                            ? 's'
                                                            : ''}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col bg-gray-100 text-xs sm:text-sm rounded-br-lg text-gray-900 w-full p-2 sm:p-3">
                                                    <p className="text-gray-700">
                                                        Booked on
                                                    </p>
                                                    {formatDate(
                                                        booking.created
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : isOwner && venue.bookings.length === 0 ? (
                                <div></div>
                            ) : (
                                <div className="flex flex-col w-full max-w-full border border-gray-900 rounded-lg">
                                    <GoogleMap venue={venue} />
                                    <div className="flex flex-row bg-gray-100 rounded-b-lg justify-between items-center w-full p-2 sm:p-3 gap-4 sm:gap-6">
                                        <div className="w-12 sm:w-16">
                                            <img
                                                className="rounded-full w-10 sm:w-12 h-10 sm:h-12"
                                                src={venue.owner.avatar.url}
                                                alt={
                                                    venue.owner.avatar.alt ||
                                                    'Owner avatar'
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col w-full text-xs sm:text-sm text-gray-900 overflow-hidden">
                                            <p>{venue.owner.name}</p>
                                            <p>{venue.owner.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!venue && !loading && !error && (
                        <p className="text-gray-900 text-center text-sm sm:text-base">
                            No venue found.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
