import { VenueRating } from '../UI/VenueRating';
import { FaUser } from 'react-icons/fa';
import { FaWifi } from 'react-icons/fa6';
import { LuCircleParking } from 'react-icons/lu';
import { MdFreeBreakfast } from 'react-icons/md';
import { MdOutlinePets } from 'react-icons/md';
import { ImageCarousel } from '../UI/ImageCarousel';
import PlaceholderImage from '../../assets/No-Image-Placeholder.svg.png';

export function VenueCard({ venue, useCarousel = false }) {
    return (
        <div className="rounded-lg hover:shadow-lg transition w-full max-w-full">
            <div className="relative w-full max-w-full">
                <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-gray-900 w-fit p-1 sm:p-2 rounded-sm z-10">
                    <VenueRating rating={venue.rating || 0} readOnly={true} />
                </div>
                {useCarousel ? (
                    <ImageCarousel media={venue.media} />
                ) : (
                    <img
                        src={venue.media?.[0]?.url || PlaceholderImage}
                        alt={venue.media?.[0]?.alt || 'Venue image'}
                        className="w-full h-60 sm:h-72 object-cover rounded-md"
                    />
                )}
            </div>

            <div className="flex flex-row justify-between items-center w-full py-2 sm:py-3 px-2 sm:px-3">
                <div className="flex flex-row gap-2 sm:gap-3 items-center justify-center">
                    <FaUser className="text-gray-700 text-lg sm:text-xl" />
                    <p className="text-gray-700 text-sm sm:text-base">
                        {venue.maxGuests}
                    </p>
                </div>
                <div className="flex flex-row gap-2 sm:gap-4 items-center justify-center">
                    {venue.meta.wifi && (
                        <FaWifi className="text-gray-700 text-lg sm:text-xl" />
                    )}
                    {venue.meta.parking && (
                        <LuCircleParking className="text-gray-700 text-lg sm:text-xl" />
                    )}
                    {venue.meta.breakfast && (
                        <MdFreeBreakfast className="text-gray-700 text-lg sm:text-xl" />
                    )}
                    {venue.meta.pets && (
                        <MdOutlinePets className="text-gray-700 text-lg sm:text-xl" />
                    )}
                </div>
            </div>

            <div className="flex flex-col py-2 sm:py-3 gap-1 sm:gap-2 w-full px-2 sm:px-3">
                <h2 className="text-lg sm:text-xl text-gray-900 truncate">
                    {venue.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-900 truncate">
                    {(venue.location?.city || 'Unknown') +
                        (venue.location?.country
                            ? `, ${venue.location.country}`
                            : '')}
                </p>
            </div>
            <p className="text-gray-900 font-semibold text-lg sm:text-xl my-1 sm:my-2 px-2 sm:px-3 pb-2 sm:pb-3">
                {venue.price} Kr
            </p>
        </div>
    );
}
