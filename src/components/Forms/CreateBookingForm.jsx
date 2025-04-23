import { useForm } from 'react-hook-form';
import { useState } from 'react';

export function CreateBookingForm({ venueId, onSubmit }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            dateFrom: '',
            dateTo: '',
            guests: '',
            venueId,
        },
    });

    const [success, setSuccess] = useState(null);

    const onFormSubmit = async (data) => {
        const formattedData = {
            ...data,
            dateFrom: new Date(data.dateFrom).toISOString(),
            dateTo: new Date(data.dateTo).toISOString(),
            guests: Number(data.guests),
            venueId,
        };

        try {
            await onSubmit(formattedData);
            setSuccess('Booking created successfully!');
            reset();
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setSuccess(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
                Book This Venue
            </h2>
            {success && (
                <p className="text-green-500 text-center mb-4">{success}</p>
            )}
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex flex-col gap-4">
                {/* Date From */}
                <div>
                    <label className="block text-gray-900 text-sm font-medium">
                        Check-in Date *
                    </label>
                    <input
                        type="date"
                        {...register('dateFrom', {
                            required: 'Check-in date is required',
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    />
                    {errors.dateFrom && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.dateFrom.message}
                        </p>
                    )}
                </div>

                {/* Date To */}
                <div>
                    <label className="block text-gray-900 text-sm font-medium">
                        Check-out Date *
                    </label>
                    <input
                        type="date"
                        {...register('dateTo', {
                            required: 'Check-out date is required',
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    />
                    {errors.dateTo && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.dateTo.message}
                        </p>
                    )}
                </div>

                {/* Guests */}
                <div>
                    <label className="block text-gray-900 text-sm font-medium">
                        Number of Guests *
                    </label>
                    <input
                        type="number"
                        min="1"
                        {...register('guests', {
                            required: 'Number of guests is required',
                            min: {
                                value: 1,
                                message: 'Must be at least 1 guest',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Number of guests"
                    />
                    {errors.guests && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.guests.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700">
                        Book Now
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
