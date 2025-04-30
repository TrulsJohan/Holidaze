import { VenueRating } from '../UI/VenueRating';
import { FaUser } from 'react-icons/fa';
import { FaWifi } from 'react-icons/fa6';
import { LuCircleParking } from 'react-icons/lu';
import { MdFreeBreakfast } from 'react-icons/md';
import { MdOutlinePets } from 'react-icons/md';

export function VenueCard({ venue }) {
    return (
        <div className="rounded-lg hover:shadow-lg transition">
            <div className="relative">
                <div className="absolute top-4 left-4 bg-gray-900 w-fit p-1 rounded-sm">
                    <VenueRating rating={venue.rating || 0} readOnly={true} />
                </div>
                {venue.media && venue.media[0] && (
                    <img
                        src={
                            venue.media[0].url ||
                            'https://via.placeholder.com/400x240?text=No+Image'
                        }
                        alt={venue.media[0].alt || 'Venue image'}
                        className="w-full h-[240px] object-cover rounded-md"
                    />
                )}
            </div>

            <div className="flex flex-row justify-between items-center w-full py-2 px-2">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <FaUser className="text-gray-700" />
                    <p className="text-gray-700">{venue.maxGuests}</p>
                </div>
                <div className="flex flex-row gap-4 items-center justify-center">
                    {venue.meta.wifi && <FaWifi className="text-gray-700" />}
                    {venue.meta.parking && (
                        <LuCircleParking className="text-gray-700" />
                    )}
                    {venue.meta.breakfast && (
                        <MdFreeBreakfast className="text-gray-700" />
                    )}
                    {venue.meta.pets && (
                        <MdOutlinePets className="text-gray-700" />
                    )}
                </div>
            </div>

            <div className="flex flex-col py-2 gap-1 w-full px-2">
                <h2 className="text-xl text-gray-900 overflow-hidden text-nowrap">
                    {venue.name}
                </h2>
                <p className="text-sm text-gray-900 overflow-hidden">
                    {(venue.location?.city || 'Unknown') +
                        (venue.location?.country
                            ? `, ${venue.location.country}`
                            : '')}
                </p>
            </div>
            <p className="text-gray-900 font-semibold text-xl my-1 px-2 pb-2">
                {venue.price} Kr
            </p>
        </div>
    );
}
