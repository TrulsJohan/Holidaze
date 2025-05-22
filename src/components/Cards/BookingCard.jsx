import PropTypes from 'prop-types';
import { deleteBooking } from '../../hooks/booking/deleteBooking';
import EventEmitter from 'events';

export function BookingCard({ booking, formatDate, venue, profile }) {
    const calculateTotalPrice = () => {
        const dateFrom = new Date(booking.dateFrom);
        const dateTo = new Date(booking.dateTo);
        const nights = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
        return nights * venue.price;
    };

    const customer = booking.customer || {
        name: profile?.name || 'Unknown',
        email: profile?.email || 'N/A',
        avatar: profile?.avatar || {
            url: 'https://via.placeholder.com/150',
            alt: 'Default avatar',
        },
    };

    const handleCancelBooking = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await deleteBooking(booking.id);
                const emitter = new EventEmitter();
                emitter.emit('bookingDeleted', booking.id);
            } catch (error) {}
        }
    };

    return (
        <div className="flex flex-col bg-gray-900 p-2 sm:p-3 rounded-lg text-gray-50">
            <div className="flex flex-row bg-gray-100 rounded-t-lg border-b border-gray-900 justify-between items-center w-full p-2 sm:p-3 gap-4 sm:gap-6">
                <div className="w-12 sm:w-16">
                    <img
                        className="rounded-full w-10 sm:w-12 h-10 sm:h-12"
                        src={customer.avatar.url}
                        alt={customer.avatar.alt || 'Owner avatar'}
                    />
                </div>
                <div className="flex flex-col w-full text-xs sm:text-sm text-gray-900 overflow-hidden">
                    <p>{customer.name}</p>
                    <p>{customer.email}</p>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col bg-gray-100 border-r text-xs sm:text-sm text-gray-900 w-full p-2 sm:p-3">
                    <p className="text-gray-700">From</p>
                    {formatDate(booking.dateFrom)}
                </div>
                <div className="flex flex-col bg-gray-100 text-xs sm:text-sm text-gray-900 w-full p-2 sm:p-3">
                    <p className="text-gray-700">To</p>
                    {formatDate(booking.dateTo)}
                </div>
            </div>
            <div className="flex flex-row border-t border-gray-900">
                <div className="flex flex-col bg-gray-100 border-r text-xs sm:text-sm rounded-bl-lg text-gray-900 w-full p-2 sm:p-3">
                    <p className="text-gray-700">Guests</p>
                    <p>
                        {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex flex-col bg-gray-100 text-xs sm:text-sm rounded-br-lg text-gray-900 w-full p-2 sm:p-3">
                    <p className="text-gray-700">Booked on</p>
                    {formatDate(booking.created)}
                </div>
            </div>
            <div className="mt-2 flex flex-row justify-between">
                <div>
                    <p className="text-gray-300 mt-2">Total Price</p>
                    <p>${calculateTotalPrice()}</p>
                </div>
                <button
                    onClick={handleCancelBooking}
                    className="mt-2 w-fit h-fit px-3 py-2 bg-red-500 text-gray-50 rounded hover:bg-gray-600 text-sm sm:text-base">
                    Cancel
                </button>
            </div>
        </div>
    );
}

BookingCard.propTypes = {
    booking: PropTypes.shape({
        id: PropTypes.string.isRequired,
        dateFrom: PropTypes.string.isRequired,
        dateTo: PropTypes.string.isRequired,
        guests: PropTypes.number.isRequired,
        created: PropTypes.string.isRequired,
        customer: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            avatar: PropTypes.shape({
                url: PropTypes.string.isRequired,
                alt: PropTypes.string,
            }).isRequired,
        }),
    }).isRequired,
    formatDate: PropTypes.func.isRequired,
    venue: PropTypes.shape({
        price: PropTypes.number.isRequired,
    }).isRequired,
    profile: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.shape({
            url: PropTypes.string,
            alt: PropTypes.string,
        }),
    }),
};
