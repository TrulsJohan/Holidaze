import PropTypes from 'prop-types';

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
        <div className="w-full h-[240px] rounded-lg overflow-hidden border border-gray-200 relative">
            {hasValidCoordinates ? (
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
            ) : hasValidAddress ? (
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
            ) : (
                <div className="absolute inset-0 bg-gray-200/80 flex items-center justify-center text-gray-600 text-lg font-medium rounded-lg border border-gray-200">
                    Invalid location
                </div>
            )}
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
