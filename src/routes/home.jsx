import { getAllVenues } from '../hooks/venue/getVenues';
import { useState, useEffect, useRef } from 'react';
import { VenueCard } from '../components/Cards/VenueCard';
import { FilterForm } from '../components/Forms/FilterForm';
import { MdOutlineFilterAlt } from 'react-icons/md';
import { Link } from 'react-router-dom';

export function RenderHome() {
    const [allVenues, setAllVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const limit = 20;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getAllVenues();
                setAllVenues(response.data || []);
                setFilteredVenues(response.data || []);
                setPageCount(Math.ceil((response.data || []).length / limit));
            } catch (err) {
                console.error('Error fetching venues:', err);
                setError(err.message || 'Failed to load venues');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let results = [...allVenues];

            if (filters.dateFrom && filters.dateTo) {
                const from = new Date(filters.dateFrom);
                const to = new Date(filters.dateTo);
                results = results.filter((venue) =>
                    venue.bookings.every(
                        (booking) =>
                            new Date(booking.dateTo) < from || new Date(booking.dateFrom) > to
                    )
                );
            }

            if (filters.priceFrom) {
                results = results.filter((venue) => venue.price >= Number(filters.priceFrom));
            }
            if (filters.priceTo) {
                results = results.filter((venue) => venue.price <= Number(filters.priceTo));
            }

            if (filters.location) {
                const locationLower = filters.location.toLowerCase();
                results = results.filter((venue) =>
                    venue.location.city.toLowerCase().includes(locationLower)
                );
            }

            if (filters.guests) {
                results = results.filter((venue) => venue.maxGuests >= Number(filters.guests));
            }

            if (filters.wifi) {
                results = results.filter((venue) => venue.meta.wifi === true);
            }
            if (filters.parking) {
                results = results.filter((venue) => venue.meta.parking === true);
            }
            if (filters.breakfast) {
                results = results.filter((venue) => venue.meta.breakfast === true);
            }
            if (filters.pets) {
                results = results.filter((venue) => venue.meta.pets === true);
            }

            setFilteredVenues(results);
            setPage(1);
            setPageCount(Math.ceil(results.length / limit));
        };

        applyFilters();
    }, [filters, allVenues]);

    const displayedVenues = filteredVenues.slice((page - 1) * limit, page * limit);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const handleFilterSubmit = (data) => {
        setFilters(data);
        setShowFilter(false);
    };

    const handleFilterClear = () => {
        setFilters({});
        setShowFilter(false);
    };

    return (
        <>
            <title>Holidaze | Home</title>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Explore Venues
                    </h1>
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="flex items-center gap-2 py-2 px-4 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700">
                            <MdOutlineFilterAlt className="text-xl" />
                            Filter
                        </button>
                        {showFilter && (
                            <FilterForm
                                onSubmit={handleFilterSubmit}
                                onClear={handleFilterClear}
                                onClose={() => setShowFilter(false)}
                            />
                        )}
                    </div>
                </div>

                {loading && (
                    <p className="text-gray-900 text-center">
                        Loading venues...
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {displayedVenues.length === 0 && !loading && !error && (
                    <p className="text-gray-900 text-center">
                        No venues available.
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedVenues.map((venue) => (
                        <Link key={venue.id} to={`/venue/${venue.id}`}>
                            <VenueCard venue={venue} />
                        </Link>
                    ))}
                </div>

                {pageCount > 1 && (
                    <div className="mt-6 flex justify-center items-center gap-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="py-1 px-3 bg-gray-900 text-gray-50 rounded-lg disabled:bg-gray-500 hover:bg-gray-700"></button>
                        <span className="text-gray-900">
                            page {page} of {pageCount}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pageCount}
                            className="py-1 px-3 bg-gray-900 text-gray-50 rounded-lg disabled:bg-gray-500 hover:bg-gray-700"></button>
                    </div>
                )}
            </div>
        </>
    );
}
