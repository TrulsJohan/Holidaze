import { useEffect, useState } from 'react';
import { getProfile } from '../../hooks/profile/getProfile';
import { FaCheck } from 'react-icons/fa6';
import { VenueCard } from '../../components/Cards/VenueCard';
import { BookingCard } from '../../components/Cards/BookingCard';
import { Link } from 'react-router-dom';
import { IoIosSettings } from 'react-icons/io';

export function RenderProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const name = localStorage.getItem('name');

    if (!name) {
        console.error('Could not find name in localStorage');
    }

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
        }
    }, [name]);

    return (
        <>
            <title>Holidaze | {profile ? profile.name : 'Profile'}</title>
            <div className="min-h-screen p-8">
                {loading && (
                    <div className="text-center">
                        <p className="text-gray-900 text-lg">
                            Loading profile...
                        </p>
                    </div>
                )}
                {error && (
                    <div className="text-center">
                        <p className="text-red-500 text-lg">{error}</p>
                    </div>
                )}
                {!profile && !loading && !error && (
                    <div className="text-center">
                        <p className="text-gray-900 text-lg">
                            No profile found.
                        </p>
                    </div>
                )}
                {profile && !loading && !error && (
                    <div className="max-w-4xl mx-auto">
                        <div
                            className="h-40 bg-cover bg-center rounded-t-lg"
                            style={{
                                backgroundImage: `url(${profile.banner.url})`,
                            }}
                            aria-label={profile.banner.alt}></div>

                        <div className="bg-white rounded-b-lg shadow-md -mt-16 p-6 relative">
                            <Link
                                to={'/profile/update'}
                                className="absolute right-4 top-4 ">
                                <div className="rounded-full p-1 hover:bg-gray-300">
                                    <IoIosSettings className="h-6 w-6" />
                                </div>
                            </Link>
                            <div className="absolute -top-12 left-[75px]">
                                <img
                                    src={profile.avatar.url}
                                    alt={profile.avatar.alt || 'Profile avatar'}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                                />
                            </div>

                            <div className="flex flex-col mt-12 text-center justify-center items-center">
                                <h1 className="text-xl font-medium text-gray-900">
                                    {profile.name}
                                </h1>
                                <p className="text-gray-600">{profile.email}</p>
                                {profile.venueManager && (
                                    <div className="flex flex-row items-center w-fit gap-2 mt-2 px-3 py-1 bg-gray-900 text-gray-50 text-sm rounded-full">
                                        <p>Venue Manager</p>
                                        <span>
                                            <FaCheck />
                                        </span>
                                    </div>
                                )}
                                {profile.bio ? (
                                    <p className="mt-4 text-sm text-gray-700">
                                        {profile.bio}
                                    </p>
                                ) : (
                                    <p className="mt-4 text-sm text-gray-500 italic">
                                        No bio provided.
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex w-full gap-4 justify-center items-center">
                                <div className="text-center w-[60px]">
                                    <p className="text-gray-900 font-medium">
                                        {profile._count.bookings}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Bookings
                                    </p>
                                </div>
                                <div className="text-center w-[60px]">
                                    <p className="text-gray-900 font-medium">
                                        {profile._count.venues}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Venues
                                    </p>
                                </div>
                            </div>
                        </div>

                        {profile.venues.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-gray-900 my-8 text-sm">
                                    Your Venues
                                </h2>
                                <div className="flex flex-col w-full">
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

                        {profile.bookings.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-gray-900 my-8 text-sm">
                                    Your Bookings
                                </h2>
                                <div className="flex flex-col w-full">
                                    {profile.bookings.map((booking) => (
                                        <Link
                                            key={booking.id}
                                            to={`/venue/${booking.venue.id}`}>
                                            <BookingCard
                                                venue={booking.venue}
                                                dateFrom={booking.dateFrom}
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
        </>
    );
}
