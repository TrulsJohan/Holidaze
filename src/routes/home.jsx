import { getVenues } from '../hooks/venue/getVenues';
import { useState, useEffect } from 'react';

export function RenderHome() {
    const [venues, setVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getVenues(page);
                setVenues(response.data || []);
                setPageCount(response.meta?.pageCount || 1);
            } catch (err) {
                console.error('Error fetching venues:', err);
                setError(err.message || 'Failed to load venues');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    return (
        <>
            <title>Holidaze | Home</title>
            <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                    Explore Venues
                </h1>

                {loading && (
                    <p className="text-gray-900 text-center">
                        Loading venues...
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {venues.length === 0 && !loading && !error && (
                    <p className="text-gray-900 text-center">
                        No venues available.
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <div
                            key={venue.id}
                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
                            <h2 className="text-xl font-medium text-gray-900">
                                {venue.name}
                            </h2>
                            {venue.media && venue.media[0] && (
                                <img
                                    src={venue.media[0].url}
                                    alt={venue.media[0].alt || 'Venue image'}
                                    className="w-full h-48 object-cover rounded-md mt-2"
                                />
                            )}
                            <p className="text-gray-700 mt-2">
                                {venue.description}
                            </p>
                            <p className="text-gray-900 font-semibold mt-2">
                                ${venue.price} / night
                            </p>
                            <p className="text-gray-600">
                                Max Guests: {venue.maxGuests}
                            </p>
                            <p className="text-gray-600">
                                Rating: {venue.rating || 'N/A'}
                            </p>
                        </div>
                    ))}
                </div>

                {pageCount > 1 && (
                    <div className="mt-6 flex justify-center items-center gap-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="py-1 px-3 bg-gray-900 text-gray-50 rounded-lg disabled:bg-gray-500 hover:bg-gray-700">
                            &lt;
                        </button>
                        <span className="text-gray-900">
                            page {page} of {pageCount}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pageCount}
                            className="py-1 px-3 bg-gray-900 text-gray-50 rounded-lg disabled:bg-gray-500 hover:bg-gray-700">
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
