import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateGallery } from '../UI/CreateGallery';
import { RateVenue } from '../UI/RateVenue';

export function CreateVenueForm({ onSubmit, error }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            media: [{ url: '' }],
            price: '',
            maxGuests: '',
            rating: 0,
            meta: {
                wifi: false,
                parking: false,
                breakfast: false,
                pets: false,
            },
            location: {
                address: '',
                city: '',
                zip: '',
                country: '',
                continent: '',
            },
        },
    });

    const navigate = useNavigate();
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const venueManager = localStorage.getItem('venueManager');

        if (!accessToken) {
            setAuthError('You must be logged in to create a venue.');
            navigate('/login');
        } else if (venueManager !== 'true') {
            setAuthError('Only venue managers can create venues.');
            navigate('/login');
        }
    }, [navigate]);

    const onFormSubmit = (data) => {
        const venueManager = localStorage.getItem('venueManager');
        if (venueManager !== 'true') {
            setAuthError('Only venue managers can submit venues.');
            return;
        }

        const formattedData = {
            ...data,
            price: Number(data.price),
            maxGuests: Number(data.maxGuests),
            rating: data.rating ? Number(data.rating) : 0,
            location: {
                ...data.location,
                address: data.location.address || null,
                city: data.location.city || null,
                zip: data.location.zip || null,
                country: data.location.country || null,
                continent: data.location.continent || null,
            },
            media: data.media
                .filter((media) => media.url && media.url.trim() !== '')
                .map((media) => ({ url: media.url, alt: 'venue image' })),
        };
        onSubmit(formattedData);
        reset();
    };

    const nameValue = watch('name') || '';
    const descriptionValue = watch('description') || '';
    const addressValue = watch('location.address') || '';
    const cityValue = watch('location.city') || '';
    const zipValue = watch('location.zip') || '';
    const countryValue = watch('location.country') || '';
    const continentValue = watch('location.continent') || '';

    if (authError) {
        return (
            <div className="flex w-full flex-col gap-4 sm:gap-6 rounded-lg max-w-md sm:max-w-lg mx-auto p-4 sm:p-6">
                <p className="text-red-500 text-center text-sm sm:text-base">
                    {authError}
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2 sm:py-3 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 text-sm sm:text-base">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="p-4 sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
            <div className="max-w-md sm:max-w-lg lg:max-w-4xl mx-auto">
                {error && (
                    <p className="text-red-500 text-center text-sm sm:text-base">
                        {error}
                    </p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
                    <div className="flex w-full flex-col gap-4 sm:gap-6 p-2 sm:p-3 rounded-lg">
                        <div>
                            <div className="flex flex-row gap-2 sm:gap-3 w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-700 focus:outline-none focus:border-gray-900">
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        maxLength: {
                                            value: 100,
                                            message:
                                                'Title cannot exceed 100 characters',
                                        },
                                    })}
                                    className="w-full text-sm sm:text-base text-gray-900"
                                    placeholder="title..."
                                />
                            </div>
                            <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                <span>Enter a title...</span>
                                <span>{nameValue.length}/100</span>
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <textarea
                                {...register('description', {
                                    required: 'Description is required',
                                    maxLength: {
                                        value: 500,
                                        message:
                                            'Description cannot exceed 500 characters',
                                    },
                                })}
                                className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                placeholder="Describe the venue..."
                                rows={4}
                            />
                            <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                <span>Enter a description...</span>
                                <span>{descriptionValue.length}/500</span>
                            </div>
                            {errors.description && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <select
                                {...register('maxGuests', {
                                    required: 'Max guests is required',
                                    min: {
                                        value: 1,
                                        message: 'Must be at least 1 guest',
                                    },
                                    valueAsNumber: true,
                                })}
                                className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900">
                                <option value="" disabled>
                                    Number of guests...
                                </option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                <span>Number of guests...</span>
                            </div>
                            {errors.maxGuests && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">
                                    {errors.maxGuests.message}
                                </p>
                            )}
                        </div>

                        <RateVenue register={register} errors={errors} />

                        <div>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('price', {
                                    required: 'Price is required',
                                    min: {
                                        value: 0,
                                        message: 'Price cannot be negative',
                                    },
                                })}
                                className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                placeholder="Price"
                            />
                            <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                <span>Price per night...</span>
                            </div>
                            {errors.price && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="w-full max-w-full">
                        <CreateGallery
                            register={register}
                            watch={watch}
                            setValue={setValue}
                            errors={errors}
                        />
                    </div>
                </div>

                <div className="flex w-full flex-col gap-4 sm:gap-6 p-2 sm:p-3 rounded-lg mt-4 sm:mt-6 lg:mt-8">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <input
                                    type="text"
                                    {...register('location.address', {
                                        required: 'Address is required',
                                        maxLength: {
                                            value: 100,
                                            message:
                                                'Address cannot exceed 100 characters',
                                        },
                                    })}
                                    className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                    placeholder="Address"
                                />
                                <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                    <span>Enter an address...</span>
                                    <span>{addressValue.length}/100</span>
                                </div>
                                {errors.location?.address && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors.location.address.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    {...register('location.city', {
                                        required: 'City is required',
                                        maxLength: {
                                            value: 50,
                                            message:
                                                'City cannot exceed 50 characters',
                                        },
                                    })}
                                    className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                    placeholder="City"
                                />
                                <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                    <span>Enter a city...</span>
                                    <span>{cityValue.length}/50</span>
                                </div>
                                {errors.location?.city && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors.location.city.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    {...register('location.zip', {
                                        required: 'ZIP code is required',
                                        maxLength: {
                                            value: 20,
                                            message:
                                                'ZIP code cannot exceed 20 characters',
                                        },
                                    })}
                                    className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                    placeholder="ZIP Code"
                                />
                                <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                    <span>Enter a ZIP code...</span>
                                    <span>{zipValue.length}/20</span>
                                </div>
                                {errors.location?.zip && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors.location.zip.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    {...register('location.country', {
                                        required: 'Country is required',
                                        maxLength: {
                                            value: 50,
                                            message:
                                                'Country cannot exceed 50 characters',
                                        },
                                    })}
                                    className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                    placeholder="Country"
                                />
                                <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                    <span>Enter a country...</span>
                                    <span>{countryValue.length}/50</span>
                                </div>
                                {errors.location?.country && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors.location.country.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    {...register('location.continent', {
                                        required: 'Continent is required',
                                        maxLength: {
                                            value: 50,
                                            message:
                                                'Continent cannot exceed 50 characters',
                                        },
                                    })}
                                    className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                                    placeholder="Continent"
                                />
                                <div className="flex justify-between text-gray-900 text-xs sm:text-sm mt-1">
                                    <span>Enter a continent...</span>
                                    <span>{continentValue.length}/50</span>
                                </div>
                                {errors.location?.continent && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors.location.continent.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col gap-2 sm:gap-3 text-gray-900">
                            <label className="flex items-center gap-2 sm:gap-3">
                                <input
                                    type="checkbox"
                                    {...register('meta.wifi')}
                                    className="h-4 sm:h-5 w-4 sm:w-5 bg-gray-100 border border-gray-900 rounded"
                                />
                                WiFi
                            </label>
                            <label className="flex items-center gap-2 sm:gap-3">
                                <input
                                    type="checkbox"
                                    {...register('meta.parking')}
                                    className="h-4 sm:h-5 w-4 sm:w-5 bg-gray-100 border border-gray-900 rounded"
                                />
                                Parking
                            </label>
                            <label className="flex items-center gap-2 sm:gap-3">
                                <input
                                    type="checkbox"
                                    {...register('meta.breakfast')}
                                    className="h-4 sm:h-5 w-4 sm:w-5 bg-gray-100 border border-gray-700 rounded"
                                />
                                Breakfast
                            </label>
                            <label className="flex items-center gap-2 sm:gap-3">
                                <input
                                    type="checkbox"
                                    {...register('meta.pets')}
                                    className="h-4 sm:h-5 w-4 sm:w-5 bg-gray-100 border border-gray-900 rounded"
                                />
                                Pets Allowed
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                        <button
                            type="submit"
                            className="w-full py-2 sm:py-3 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 text-sm sm:text-base">
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="w-full py-2 sm:py-3 bg-gray-900 text-gray-50 border border-gray-50 rounded-lg hover:bg-gray-300 text-sm sm:text-base">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
