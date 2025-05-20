import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../hooks/profile/getProfile';
import { IoCloseOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa6';
import { VenueCard } from '../../components/Cards/VenueCard';
import { BookingCard } from '../../components/Cards/BookingCard';
import { Link } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiInfo } from 'react-icons/fi';

export function RenderProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [activeTab, setActiveTab] = useState('venues'); // New state for tab toggle
    const name = localStorage.getItem('name');
    const navigate = useNavigate();
    const isVenueManager = localStorage.getItem('venueManager') === 'true';

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setAuthError('You must be logged in to view your profile.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getProfile(name);
                setProfile(response.data);
            } catch (error) {
                console.error('Could not fetch profile:', error.message);
                setError(error.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        if (name) {
            fetchProfile();
        } else {
            console.error('Could not find name in localStorage');
            setError('No user name found. Please log in.');
        }
    }, [name]);

    if (authError) {
        return (
            <div className="flex w-full flex-col gap-4 sm:gap-6 rounded-lg max-w-md sm:max-w-lg mx-auto p-4 sm:p-6">
                <p className="text-red-500 text-center text-sm sm:text-base">
                    {authError}
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2 sm:py-3 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 text-sm sm:text-base">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <>
            <title>Holidaze | Profile</title>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
                <div className="max-w-md sm:max-w-lg lg:max-w-4xl mx-auto">
                    {loading && (
                        <div className="text-center">
                            <p className="text-gray-900 text-sm sm:text-base">
                                Loading profile...
                            </p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center">
                            <p className="text-red-500 text-sm sm:text-base">
                                {error}
                            </p>
                        </div>
                    )}
                    {!profile && !loading && !error && (
                        <div className="text-center">
                            <p className="text-gray-900 text-sm sm:text-base">
                                No profile found.
                            </p>
                        </div>
                    )}
                    {profile && !loading && !error && (
                        <div className="w-full max-w-full">
                            <div
                                className="h-32 sm:h-40 lg:h-48 bg-cover bg-center rounded-t-lg"
                                style={{
                                    backgroundImage: `url(${profile.banner.url})`,
                                }}
                                aria-label={profile.banner.alt}>
                                <div className="w-full p-2 sm:p-3 flex justify-end">
                                    <Link to={'/profile/update'}>
                                        <button className="flex flex-row gap-1 items-center border border-gray-300 bg-gray-50 hover:bg-gray-300 p-1 sm:p-2 rounded-lg">
                                            <MdEdit className="h-4 sm:h-5 w-4 sm:w-5" />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-b-lg shadow-md -mt-16 sm:-mt-20 lg:-mt-24 p-4 sm:p-6 relative">
                                <div className="absolute -top-10 sm:-top-12 lg:-top-14 left-4 sm:left-6 lg:left-8">
                                    <img
                                        src={profile.avatar.url}
                                        alt={
                                            profile.avatar.alt ||
                                            'Profile avatar'
                                        }
                                        className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border-4 border-white shadow-md object-cover"
                                    />
                                </div>

                                <div className="flex flex-col mt-10 sm:mt-12 lg:mt-16 text-center justify-center items-center">
                                    <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                                        {profile.name}
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        {profile.email}
                                    </p>
                                    <div className="flex flex-row items-center w-fit gap-2 sm:gap-3 mt-2 sm:mt-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900 text-gray-50 text-xs sm:text-sm rounded-full">
                                        <p>Venue Manager</p>
                                        <span>
                                            {isVenueManager ? (
                                                <FaCheck />
                                            ) : (
                                                <IoCloseOutline />
                                            )}
                                        </span>
                                    </div>
                                    {profile.bio ? (
                                        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-700">
                                            {profile.bio}
                                        </p>
                                    ) : (
                                        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-500 italic">
                                            No bio provided.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 sm:mt-6 lg:mt-8 flex w-full gap-4 sm:gap-6 justify-center items-center">
                                    <div className="text-center w-16 sm:w-20">
                                        <p className="text-sm sm:text-base text-gray-900 font-medium">
                                            {profile._count.bookings}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            Bookings
                                        </p>
                                    </div>
                                    <div className="text-center w-16 sm:w-20">
                                        <p className="text-sm sm:text-base text-gray-900 font-medium">
                                            {profile._count.venues}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            Venues
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {(profile.venues.length > 0 ||
                                profile.bookings.length > 0) && (
                                <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-row gap-2 sm:gap-3 justify-center w-full max-w-full">
                                    <button
                                        onClick={() => setActiveTab('venues')}
                                        className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg ${
                                            activeTab === 'venues'
                                                ? 'bg-gray-900 text-gray-50'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}>
                                        Your Venues
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('bookings')}
                                        className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg ${
                                            activeTab === 'bookings'
                                                ? 'bg-gray-900 text-gray-50'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}>
                                        Your Bookings
                                    </button>
                                </div>
                            )}

                            {activeTab === 'venues' &&
                                profile.venues.length > 0 && (
                                    <div className="mt-4 sm:mt-6 lg:mt-8">
                                        <p className="text-gray-900 flex flex-row w-full overflow-hidden my-4 sm:my-6 lg:my-8 text-sm sm:text-base font-semibold items-center">
                                            <span className="relative inline-block group">
                                                <FiInfo className="h-4 sm:h-5 w-4 sm:w-5 text-gray-900 mr-2" />
                                                <span className="absolute left-full top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs sm:text-sm rounded p-2 sm:p-3 shadow-lg min-w-max z-10">
                                                    Click on the venue you want
                                                    to see bookings on.
                                                </span>
                                            </span>
                                            Your Venues
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-full">
                                            {profile.venues.map((venue) => (
                                                <Link
                                                    key={venue.id}
                                                    to={`/venue/${venue.id}`}>
                                                    <VenueCard venue={venue} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {activeTab === 'bookings' &&
                                profile.bookings.length > 0 && (
                                    <div className="mt-4 sm:mt-6 lg:mt-8">
                                        <p className="text-gray-900 flex flex-row w-full overflow-hidden my-4 sm:my-6 lg:my-8 text-sm sm:text-base font-semibold items-center">
                                            <span className="relative inline-block group">
                                                <FiInfo className="h-4 sm:h-5 w-4 sm:w-5 text-gray-900 mr-2" />
                                                <span className="absolute left-full top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs sm:text-sm rounded p-2 sm:p-3 shadow-lg min-w-max z-10">
                                                    Venues you have booked.
                                                </span>
                                            </span>
                                            Your Bookings
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-full">
                                            {profile.bookings.map((booking) => (
                                                <Link
                                                    key={booking.id}
                                                    to={`/venue/${booking.venue.id}`}>
                                                    <BookingCard
                                                        venue={booking.venue}
                                                        dateFrom={
                                                            booking.dateFrom
                                                        }
                                                        dateTo={booking.dateTo}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
