export function VenueCard({ venue }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
            <h2 className="text-xl font-medium text-gray-900">{venue.name}</h2>
            {venue.media && venue.media[0] && (
                <img
                    src={venue.media[0].url}
                    alt={venue.media[0].alt || 'Venue image'}
                    className="w-full h-48 object-cover rounded-md mt-2"
                />
            )}
            <p className="text-gray-700 mt-2">{venue.description}</p>
            <p className="text-gray-900 font-semibold mt-2">
                ${venue.price} / night
            </p>
            <p className="text-gray-600">Max Guests: {venue.maxGuests}</p>
            <p className="text-gray-600">Rating: {venue.rating || 'N/A'}</p>
        </div>
    );
}
