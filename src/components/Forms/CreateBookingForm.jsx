import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import {
    addDays,
    eachDayOfInterval,
    isWithinInterval,
    parseISO,
} from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export function CreateBookingForm({ venueId, onSubmit, bookings, maxGuests }) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
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
    const [range, setRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ]);

    const disabledDates = bookings
        ? bookings
              .map((booking) => {
                  const start = parseISO(booking.dateFrom);
                  const end = parseISO(booking.dateTo);
                  return eachDayOfInterval({ start, end });
              })
              .flat()
        : [];

    useEffect(() => {
        if (range[0].startDate && range[0].endDate) {
            setValue('dateFrom', range[0].startDate.toISOString());
            setValue('dateTo', range[0].endDate.toISOString());
        }
    }, [range, setValue]);

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
            setRange([{ startDate: null, endDate: null, key: 'selection' }]);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setSuccess(null);
        }
    };

    const validateDateRange = () => {
        if (!range[0].startDate || !range[0].endDate) {
            return 'Please select a valid date range';
        }
        if (range[0].startDate >= range[0].endDate) {
            return 'Check-out date must be after check-in date';
        }
        const selectedDates = eachDayOfInterval({
            start: range[0].startDate,
            end: range[0].endDate,
        });
        const isBooked = selectedDates.some((date) =>
            disabledDates.some(
                (disabled) => disabled.toDateString() === date.toDateString()
            )
        );
        if (isBooked) {
            return 'Selected dates are already booked';
        }
        return true;
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
                <div>
                    <label className="block text-gray-900 text-sm font-medium">
                        Select Date Range *
                    </label>
                    <Controller
                        name="dateRange"
                        control={control}
                        rules={{ validate: validateDateRange }}
                        render={({ field }) => (
                            <DateRange
                                editableDateInputs={true}
                                onChange={(item) => {
                                    setRange([item.selection]);
                                    field.onChange(item.selection);
                                }}
                                moveRangeOnFirstSelection={false}
                                ranges={range}
                                disabledDates={disabledDates}
                                minDate={new Date()}
                                className="w-full border border-gray-700 rounded-lg overflow-scroll"
                            />
                        )}
                    />
                    {errors.dateRange && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.dateRange.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-900 text-sm font-medium">
                        Number of Guests *
                    </label>
                    <input
                        type="number"
                        min="1"
                        max={maxGuests}
                        {...register('guests', {
                            required: 'Number of guests is required',
                            min: {
                                value: 1,
                                message: 'Must be at least 1 guest',
                            },
                            max: {
                                value: maxGuests,
                                message: `Maximum ${maxGuests} guests allowed`,
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

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700">
                        Book Now
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            setRange([
                                {
                                    startDate: null,
                                    endDate: null,
                                    key: 'selection',
                                },
                            ]);
                        }}
                        className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
