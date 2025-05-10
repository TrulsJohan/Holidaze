import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    addDays,
    eachDayOfInterval,
    isWithinInterval,
    parseISO,
} from 'date-fns';

export function CreateBookingForm({
    venueId,
    onSubmit,
    bookings,
    maxGuests,
    isLoggedIn,
}) {
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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const disabledDateIntervals = bookings
        ? bookings.map((booking) => ({
              start: parseISO(booking.dateFrom),
              end: parseISO(booking.dateTo),
          }))
        : [];

    useEffect(() => {
        if (startDate) {
            setValue('dateFrom', startDate.toISOString());
        }
        if (endDate) {
            setValue('dateTo', endDate.toISOString());
        }
    }, [startDate, endDate, setValue]);

    const onFormSubmit = async (data) => {
        if (!isLoggedIn) return;

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
            setStartDate(null);
            setEndDate(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setSuccess(null);
        }
    };

    const validateDateRange = () => {
        if (!startDate || !endDate) {
            return 'Please select a valid date range';
        }
        if (startDate >= endDate) {
            return 'Check-out date must be after check-in date';
        }
        const selectedDates = eachDayOfInterval({
            start: startDate,
            end: endDate,
        });
        const isBooked = selectedDates.some((date) =>
            disabledDateIntervals.some((interval) =>
                isWithinInterval(date, {
                    start: interval.start,
                    end: interval.end,
                })
            )
        );
        if (isBooked) {
            return 'Selected dates are already booked';
        }
        return true;
    };

    return (
        <div className="">
            {!isLoggedIn && (
                <p className="text-red-500 text-center mb-4">
                    Please log in to book this venue
                </p>
            )}
            {success && isLoggedIn && (
                <p className="text-green-500 text-center mb-4">{success}</p>
            )}
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex flex-col"
                disabled={!isLoggedIn}>
                <div className="rounded-lg shadow-md">
                    <div className="w-full h-full p-2 bg-gray-900 rounded-t-lg">
                        <style jsx="true">{`
                            .react-datepicker,
                            .react-datepicker__month-container {
                                width: 100% !important;
                                height: 100% !important;
                            }
                            .react-datepicker__month {
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                            }
                            .react-datepicker__week,
                            .react-datepicker__day-names {
                                display: flex;
                                justify-content: space-between;
                            }
                            .react-datepicker__day,
                            .react-datepicker__day-name {
                                flex: 1;
                                text-align: center;
                            }
                        `}</style>
                        <Controller
                            name="dateRange"
                            control={control}
                            rules={{ validate: validateDateRange }}
                            render={({ field }) => (
                                <div className="flex w-full h-full items-center justify-center">
                                    <DatePicker
                                        selectsRange
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setStartDate(start);
                                            setEndDate(end);
                                            field.onChange({
                                                startDate: start,
                                                endDate: end,
                                            });
                                        }}
                                        excludeDateIntervals={
                                            disabledDateIntervals
                                        }
                                        minDate={new Date()}
                                        inline
                                        className="w-full h-full border border-gray-700 rounded-t-lg bg-white text-gray-900 text-sm"
                                        calendarClassName="bg-white w-full h-full"
                                        popperClassName="w-full"
                                        disabled={!isLoggedIn}
                                    />
                                </div>
                            )}
                        />
                        {errors.dateRange && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.dateRange.message}
                            </p>
                        )}
                    </div>
                    <div className="px-2 pb-2 bg-gray-900">
                        <select
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
                            className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-500 text-sm"
                            disabled={!isLoggedIn}>
                            <option value="" disabled>
                                Number of guests
                            </option>
                            {Array.from({ length: maxGuests }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        {errors.guests && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.guests.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 bg-gray-900 p-2 rounded-b-lg shadow-md">
                    <button
                        type="submit"
                        className={`w-full text-sm py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 ${
                            !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!isLoggedIn}>
                        Book Now
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            setStartDate(null);
                            setEndDate(null);
                        }}
                        className={`w-full text-sm py-2 border border-gray-100 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700 ${
                            !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!isLoggedIn}>
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}
