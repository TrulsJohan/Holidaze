import PropTypes from 'prop-types';
import { FiInfo } from 'react-icons/fi';

const GoogleMap = ({ venue }) => {
    const isAddressValid = (address) => {
        if (!address || !address.trim()) return false;
        const trimmed = address.trim();
        if (trimmed.length < 5) return false;
        const hasLetters = /[a-zA-Z]/.test(trimmed);
        const hasVowelsOrSpaces = /[aeiouAEIOU\s]/.test(trimmed);
        if (!hasLetters || !hasVowelsOrSpaces) return false;
        const words = trimmed.split(/[\s,]+/).filter((word) => word.length > 1);
        if (words.length < 2) return false;
        const consonantRun = /[^aeiou\s]{4,}/i.test(trimmed);
        if (consonantRun) return false;
        return true;
    };

    const getVenueAddress = () => {
        if (!venue || !venue.location) return null;
        const { address, city } = venue.location;
        const parts = [];
        if (address && address.trim()) parts.push(address.trim());
        if (city && city.trim()) parts.push(city.trim());
        const fullAddress = parts.join(', ');
        return fullAddress.trim() && isAddressValid(fullAddress)
            ? fullAddress
            : null;
    };

    const venueAddress = getVenueAddress();
    const hasValidAddress = !!venueAddress;
    const encodedAddress = hasValidAddress
        ? encodeURIComponent(venueAddress)
        : null;

    const hasValidCoordinates =
        venue &&
        venue.location &&
        typeof venue.location.lat === 'number' &&
        typeof venue.location.lng === 'number' &&
        !isNaN(venue.location.lat) &&
        !isNaN(venue.location.lng) &&
        venue.location.lat !== 0 &&
        venue.location.lng !== 0;

    console.log(
        'VenueMap coordinates:',
        venue?.location?.lat,
        venue?.location?.lng
    );
    console.log('VenueMap has valid coordinates:', hasValidCoordinates);
    console.log('VenueMap address:', venueAddress);
    console.log('VenueMap encoded address:', encodedAddress);

    return (
        <div className="w-full border-b rounded-t-lg bg-gray-100">
            <p className="text-gray-900 flex felx-row w-full overflow-hidden p-3 text-sm font-semibold items-center">
                <span className="relative inline-block group mr-1">
                    <FiInfo className="h-4 w-4 text-gray-900" />
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 shadow-lg min-w-max z-10">
                        If the location is not marked on the map, the venue has
                        an invalid address.
                    </span>
                </span>
                Location:{' '}
                <span className="flex flex-row text-nowrap overflow-hidden pl-1 font-normal text-sm">
                    {!venue.location
                        ? 'No valid address'
                        : hasValidCoordinates || hasValidAddress
                        ? `${venue.location.city}, ${venue.location.address}`
                        : 'Invalid location'}
                </span>
            </p>
            <div className="w-full h-[240px] overflow-hidden relative">
                {hasValidCoordinates ? (
                    <div className="h-full overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${venue.location.lat},${venue.location.lng}&z=14&output=embed`}
                            title={`Map showing location of ${venue.name}`}
                            aria-label={`Map showing location of ${venue.name}`}></iframe>
                    </div>
                ) : hasValidAddress ? (
                    <div className="h-full overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
                            title={`Map showing location of ${venue.name}`}
                            aria-label={`Map showing location of ${venue.name}`}></iframe>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gray-200/80 flex items-center justify-center text-gray-600 text-lg font-medium rounded-t-lg border border-gray-200">
                        Invalid location
                    </div>
                )}
            </div>
        </div>
    );
};

GoogleMap.propTypes = {
    venue: PropTypes.shape({
        name: PropTypes.string.isRequired,
        location: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
            address: PropTypes.string,
            city: PropTypes.string,
            zip: PropTypes.string,
            country: PropTypes.string,
        }).isRequired,
    }).isRequired,
};

export default GoogleMap;
