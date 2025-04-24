import { getVenues } from '../hooks/venue/getVenues';
import { useState, useEffect, useRef } from 'react';
import { VenueCard } from '../components/Cards/VenueCard';
import { FilterForm } from '../components/Forms/FilterForm';
import { MdOutlineFilterAlt } from 'react-icons/md';
import { Link } from 'react-router-dom';

export function RenderHome() {
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const filterRef = useRef(null);
    const loadMoreRef = useRef(null);
    const isMounted = useRef(true);
    const seenVenueIds = useRef(new Set());
    const limit = 20;

    useEffect(() => {
        isMounted.current = true;
        const handleClickOutside = (event) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target)
            ) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchVenues = async () => {
            if (!hasMore || loading || !isMounted.current) return;

            setLoading(true);
            setError(null);

            try {
                const response = await getVenues(page, limit);
                if (isMounted.current) {
                    const newVenues = (response.data || []).filter(
                        (venue) => !seenVenueIds.current.has(venue.id)
                    );
                    newVenues.forEach((venue) =>
                        seenVenueIds.current.add(venue.id)
                    );

                    setVenues((prev) => [...prev, ...newVenues]);
                    setFilteredVenues((prev) => [...prev, ...newVenues]);
                    setHasMore(
                        response.data.length === limit &&
                            !response.meta.isLastPage
                    );
                }
            } catch (err) {
                if (isMounted.current) {
                    console.error('Error fetching venues:', err);
                    setError(err.message || 'Failed to load venues');
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchVenues();
    }, [page, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loading &&
                    isMounted.current
                ) {
                    setTimeout(() => {
                        if (isMounted.current) {
                            setPage((prev) => prev + 1);
                        }
                    }, 500);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current && hasMore) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [hasMore, loading]);

    useEffect(() => {
        const applyFilters = () => {
            let results = [...venues];

            if (filters.dateFrom && filters.dateTo) {
                const from = new Date(filters.dateFrom);
                const to = new Date(filters.dateTo);
                results = results.filter((venue) =>
                    venue.bookings.every(
                        (booking) =>
                            new Date(booking.dateTo) < from ||
                            new Date(booking.dateFrom) > to
                    )
                );
            }

            if (filters.priceFrom) {
                results = results.filter(
                    (venue) => venue.price >= Number(filters.priceFrom)
                );
            }
            if (filters.priceTo) {
                results = results.filter(
                    (venue) => venue.price <= Number(filters.priceTo)
                );
            }

            if (filters.location) {
                const locationLower = filters.location.toLowerCase();
                results = results.filter((venue) =>
                    venue.location.city.toLowerCase().includes(locationLower)
                );
            }

            if (filters.guests) {
                results = results.filter(
                    (venue) => venue.maxGuests >= Number(filters.guests)
                );
            }

            if (filters.wifi) {
                results = results.filter((venue) => venue.meta.wifi === true);
            }
            if (filters.parking) {
                results = results.filter(
                    (venue) => venue.meta.parking === true
                );
            }
            if (filters.breakfast) {
                results = results.filter(
                    (venue) => venue.meta.breakfast === true
                );
            }
            if (filters.pets) {
                results = results.filter((venue) => venue.meta.pets === true);
            }

            if (isMounted.current) {
                setFilteredVenues(results);
            }
        };

        applyFilters();
    }, [filters, venues]);

    const handleFilterSubmit = (data) => {
        setFilters(data);
        setVenues([]);
        setFilteredVenues([]);
        setPage(1);
        setHasMore(true);
        seenVenueIds.current.clear();
        setShowFilter(false);
    };

    const handleFilterClear = () => {
        setFilters({});
        setVenues([]);
        setFilteredVenues([]);
        setPage(1);
        setHasMore(true);
        seenVenueIds.current.clear();
        setShowFilter(false);
    };

    return (
        <>
            <title>Holidaze | Home</title>
            <div className="min-h-screen px-8">
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

                {loading && venues.length === 0 && (
                    <p className="text-gray-900 text-center">
                        Loading venues...
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {filteredVenues.length === 0 && !loading && !error && (
                    <p className="text-gray-900 text-center">
                        No venues available.
                    </p>
                )}

                <div className="flex flex-col gap-8 mt-130">
                    {filteredVenues.map((venue) => (
                        <Link key={venue.id} to={`/venue/${venue.id}`}>
                            <VenueCard venue={venue} />
                        </Link>
                    ))}
                </div>

                <div ref={loadMoreRef} className="h-10">
                    {loading && venues.length > 0 && (
                        <p className="text-gray-900 text-center">
                            Loading more venues...
                        </p>
                    )}
                    {!hasMore && filteredVenues.length > 0 && (
                        <p className="text-gray-900 text-center">
                            No more venues to load.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
