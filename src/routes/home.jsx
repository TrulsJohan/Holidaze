import { getVenues } from '../hooks/venue/getVenues';
import { searchVenues } from '../hooks/venue/searchVenues';
import { useState, useEffect, useRef } from 'react';
import { VenueCard } from '../components/Cards/VenueCard';
import { FilterForm } from '../components/Forms/FilterForm';
import { SearchForm } from '../components/Forms/SearchForm';
import { MdOutlineFilterAlt } from 'react-icons/md';
import { IoIosArrowUp } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

export function RenderHome() {
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const filterRef = useRef(null);
    const loadMoreRef = useRef(null);
    const isMounted = useRef(true);
    const seenVenueIds = useRef(new Set());
    const limit = 20;

    const debouncedSetSearchQuery = useRef(
        debounce((query) => {
            if (isMounted.current) {
                setSearchQuery(query);
                setVenues([]);
                setFilteredVenues([]);
                setPage(1);
                setHasMore(true);
                seenVenueIds.current.clear();
            }
        }, 300)
    ).current;

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
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 100);
        };
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
            isMounted.current = false;
            debouncedSetSearchQuery.cancel();
        };
    }, []);

    useEffect(() => {
        const fetchVenues = async () => {
            if (!hasMore || loading || !isMounted.current) return;

            setLoading(true);
            setError(null);

            try {
                const response = searchQuery
                    ? await searchVenues(page, limit, searchQuery)
                    : await getVenues(page, limit);
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
    }, [page, hasMore, searchQuery]);

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
                results = results.filter(
                    (venue) =>
                        venue.location?.city &&
                        venue.location.city
                            .toLowerCase()
                            .includes(locationLower)
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

    const handleSearchChange = (query) => {
        debouncedSetSearchQuery(query.trim());
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <title>Holidaze | Home</title>
            <div className="min-h-screen px-8">
                <div className="flex flex-col justify-between items-center mb-6">
                    <h1 className="flex flex-col w-full text-[28px] font-light my-6">
                        <span className="flex w-full justify-end pr-9">
                            FIND
                        </span>
                        <span>VENUES FOR EVERY</span>
                        <span className="w-full font-medium pl-3">
                            OCCASION
                        </span>
                    </h1>
                    <div
                        className="relative flex items-center gap-2 p-2 bg-gray-900 rounded-lg"
                        ref={filterRef}>
                        <SearchForm onChange={handleSearchChange} />
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="flex items-center p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-700">
                            <MdOutlineFilterAlt className="text-2xl" />
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

                <div className="w-full max-w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 md:px-20 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 lg:mt-8 w-full max-w-full mx-auto">
                        {filteredVenues.map((venue) => (
                            <Link key={venue.id} to={`/venue/${venue.id}`}>
                                <VenueCard venue={venue} />
                            </Link>
                        ))}
                    </div>
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

                {showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-7 right-9 bg-gray-900 text-gray-100 p-2 rounded-full z-40 hover:bg-gray-700 md:bottom-16"
                        aria-label="Scroll to top">
                        <IoIosArrowUp className="text-xl" />
                    </button>
                )}
            </div>
        </>
    );
}
