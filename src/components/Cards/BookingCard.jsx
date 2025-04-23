import { VenueRating } from '../UI/VenueRating';
import { FaUser } from 'react-icons/fa';
import { FaWifi } from 'react-icons/fa6';
import { LuCircleParking } from 'react-icons/lu';
import { MdFreeBreakfast } from 'react-icons/md';
import { MdOutlinePets } from 'react-icons/md';

export function BookingCard({ venue, dateFrom, dateTo }) {
    const calculateTotalPrice = (dateFrom, dateTo, pricePerNight) => {
        const days =
            (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24);
        return Math.round(days * pricePerNight);
    };

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
                            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fno-image-available&psig=AOvVaw2cUIubb78IsjznXUptlDHE&ust=1745418511936000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJjIk-fs64wDFQAAAAAdAAAAABAE'
                        }
                        alt={venue.media[0].alt || 'Venue image'}
                        className="w-full h-[240px] object-cover rounded-md"
                    />
                )}
            </div>

            <div className="flex flex-row justify-between items-center w-full py-2">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <FaUser className="text-gray-700" />
                    <p className="text-gray-700">{venue.maxGuests}</p>
                </div>
                <div className="flex flex-row gap-4 items-center justify-center">
                    {venue.meta.wifi === true ? (
                        <FaWifi className="text-gray-700" />
                    ) : (
                        <p className="hidden"></p>
                    )}
                    {venue.meta.parking === true ? (
                        <LuCircleParking className="text-gray-700" />
                    ) : (
                        <p className="hidden"></p>
                    )}
                    {venue.meta.breakfast === true ? (
                        <MdFreeBreakfast className="text-gray-700" />
                    ) : (
                        <p className="hidden"></p>
                    )}
                    {venue.meta.pets === true ? (
                        <MdOutlinePets className="text-gray-700" />
                    ) : (
                        <p className="hidden"></p>
                    )}
                </div>
            </div>

            <div className="flex flex-col py-2 gap-1 w-full">
                <h2 className="text-xl text-gray-900 overflow-hidden text-nowrap">
                    {venue.name}
                </h2>
                <p className="text-sm text-gray-900 overflow-hidden">
                    {venue.location.city}, {venue.location.country}
                </p>
            </div>
            <div className="flex flex-row justify-between w-full text-gray-900 my-1">
                <p>Total price:</p>
                <p className='text-xl font-semibold'>{calculateTotalPrice(dateFrom, dateTo, venue.price)}kr</p>
            </div>
        </div>
    );
}
