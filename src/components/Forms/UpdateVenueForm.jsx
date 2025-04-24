import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVenue } from '../../hooks/venue/getVenue';
import { updateVenue } from '../../hooks/venue/updateVenue';

export function UpdateVenueForm() {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [mediaFields, setMediaFields] = useState([{ url: '', alt: '' }]);
    const name = localStorage.getItem('name');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            media: [{ url: '', alt: '' }],
            price: 1,
            maxGuests: 1,
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
                lat: 0,
                lng: 0,
            },
        },
    });

    const addMediaField = () => {
        setMediaFields([...mediaFields, { url: '', alt: '' }]);
    };

    const removeMediaField = (index) => {
        if (mediaFields.length > 1) {
            setMediaFields(mediaFields.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        const fetchVenue = async () => {
            if (!name) {
                setError('User name not found. Please log in.');
                return;
            }
            if (!id) {
                setError('Venue ID not found.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const venueResponse = await getVenue(id);
                const venueData = venueResponse.data;
                setVenue(venueData);

                if (venueData.owner.name !== name) {
                    setError('You are not authorized to edit this venue.');
                    setIsOwner(false);
                    return;
                }
                setIsOwner(true);

                const media =
                    venueData.media?.length > 0
                        ? venueData.media.map((url) => ({ url, alt: '' }))
                        : [{ url: '', alt: '' }];
                setMediaFields(media);

                reset({
                    name: venueData.name || '',
                    description: venueData.description || '',
                    media,
                    price: venueData.price || 1,
                    maxGuests: venueData.maxGuests || 1,
                    rating: venueData.rating || 0,
                    meta: {
                        wifi: venueData.meta?.wifi || false,
                        parking: venueData.meta?.parking || false,
                        breakfast: venueData.meta?.breakfast || false,
                        pets: venueData.meta?.pets || false,
                    },
                    location: {
                        address: venueData.location?.address || '',
                        city: venueData.location?.city || '',
                        zip: venueData.location?.zip || '',
                        country: venueData.location?.country || '',
                        continent: venueData.location?.continent || '',
                        lat: venueData.location?.lat || 0,
                        lng: venueData.location?.lng || 0,
                    },
                });
            } catch (error) {
                console.error('Could not fetch venue:', error.message);
                setError(error.message || 'Failed to fetch venue');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [id, name, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const mediaArray = data.media
                .filter((media) => media.url)
                .map((media) => ({
                    url: media.url,
                    alt: media.alt || '',
                }));

            const venueData = {
                name: data.name,
                description: data.description,
                media: mediaArray,
                price: Number(data.price),
                maxGuests: Number(data.maxGuests),
                rating: Number(data.rating),
                meta: {
                    wifi: data.meta.wifi,
                    parking: data.meta.parking,
                    breakfast: data.meta.breakfast,
                    pets: data.meta.pets,
                },
                location: {
                    address: data.location.address || null,
                    city: data.location.city || null,
                    zip: data.location.zip || null,
                    country: data.location.country || null,
                    continent: data.location.continent || null,
                    lat: Number(data.location.lat) || 0,
                    lng: Number(data.location.lng) || 0,
                },
            };

            await updateVenue(id, venueData);
            setSuccess('Venue updated successfully!');
            const response = await getVenue(id);
            const updatedVenue = response.data;
            setVenue(updatedVenue);

            const media =
                updatedVenue.media?.length > 0
                    ? updatedVenue.media.map((url) => ({ url, alt: '' }))
                    : [{ url: '', alt: '' }];
            setMediaFields(media);

            reset({
                name: updatedVenue.name || '',
                description: updatedVenue.description || '',
                media,
                price: updatedVenue.price || 1,
                maxGuests: updatedVenue.maxGuests || 1,
                rating: updatedVenue.rating || 0,
                meta: {
                    wifi: updatedVenue.meta?.wifi || false,
                    parking: updatedVenue.meta?.parking || false,
                    breakfast: updatedVenue.meta?.breakfast || false,
                    pets: updatedVenue.meta?.pets || false,
                },
                location: {
                    address: updatedVenue.location?.address || '',
                    city: updatedVenue.location?.city || '',
                    zip: updatedVenue.location?.zip || '',
                    country: updatedVenue.location?.country || '',
                    continent: updatedVenue.location?.continent || '',
                    lat: updatedVenue.location?.lat || 0,
                    lng: updatedVenue.location?.lng || 0,
                },
            });
        } catch (error) {
            console.error('Could not update venue:', error.message);
            setError(error.message || 'Failed to update venue');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        const media =
            venue?.media?.length > 0
                ? venue.media.map((url) => ({ url, alt: '' }))
                : [{ url: '', alt: '' }];
        setMediaFields(media);
        reset({
            name: venue?.name || '',
            description: venue?.description || '',
            media,
            price: venue?.price || 1,
            maxGuests: venue?.maxGuests || 1,
            rating: venue?.rating || 0,
            meta: {
                wifi: venue?.meta?.wifi || false,
                parking: venue?.meta?.parking || false,
                breakfast: venue?.meta?.breakfast || false,
                pets: venue?.meta?.pets || false,
            },
            location: {
                address: venue?.location?.address || '',
                city: venue?.location?.city || '',
                zip: venue?.location?.zip || '',
                country: venue?.location?.country || '',
                continent: venue?.location?.continent || '',
                lat: venue?.location?.lat || 0,
                lng: venue?.location?.lng || 0,
            },
        });
        setError(null);
        setSuccess(null);
    };

    if (!name) {
        return (
            <p className="text-red-500 text-center">
                Please log in to update a venue.
            </p>
        );
    }

    if (!id) {
        return <p className="text-red-500 text-center">Venue ID not found.</p>;
    }

    if (!isOwner && error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Update Venue
            </h2>
            {loading && <p className="text-gray-900 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && (
                <p className="text-green-500 text-center mb-4">{success}</p>
            )}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        {...register('name', {
                            required: 'Name is required',
                            maxLength: {
                                value: 100,
                                message: 'Name cannot exceed 100 characters',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={venue?.name || 'Enter venue name'}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Description
                    </label>
                    <textarea
                        {...register('description', {
                            required: 'Description is required',
                            maxLength: {
                                value: 1000,
                                message:
                                    'Description cannot exceed 1000 characters',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={venue?.description || 'Describe the venue'}
                        rows="4"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Images
                    </label>
                    {mediaFields.map((field, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="url"
                                {...register(`media.${index}.url`, {
                                    validate: (value) =>
                                        !value ||
                                        /^https?:\/\/.+/i.test(value) ||
                                        'Invalid URL',
                                })}
                                className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                                placeholder="Image URL"
                            />
                            <input
                                type="text"
                                {...register(`media.${index}.alt`)}
                                className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                                placeholder="Alt text"
                            />
                            {mediaFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMediaField(index)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMediaField}
                        className="mt-2 px-4 py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700">
                        Add Image
                    </button>
                    {errors.media && errors.media[index] && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.media[index].url?.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Price (per night)
                    </label>
                    <input
                        type="number"
                        {...register('price', {
                            required: 'Price is required',
                            min: {
                                value: 1,
                                message: 'Price must be at least 1',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={venue?.price || 'Enter price'}
                    />
                    {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.price.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Max Guests
                    </label>
                    <input
                        type="number"
                        {...register('maxGuests', {
                            required: 'Max guests is required',
                            min: {
                                value: 1,
                                message: 'Max guests must be at least 1',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={venue?.maxGuests || 'Enter max guests'}
                    />
                    {errors.maxGuests && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.maxGuests.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Rating (0-5)
                    </label>
                    <input
                        type="number"
                        {...register('rating', {
                            min: {
                                value: 0,
                                message: 'Rating cannot be less than 0',
                            },
                            max: {
                                value: 5,
                                message: 'Rating cannot exceed 5',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={venue?.rating || 'Enter rating'}
                    />
                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.rating.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Amenities
                    </label>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('meta.wifi')}
                                className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                            />
                            <label className="text-gray-900 text-sm">
                                WiFi
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('meta.parking')}
                                className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                            />
                            <label className="text-gray-900 text-sm">
                                Parking
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('meta.breakfast')}
                                className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                            />
                            <label className="text-gray-900 text-sm">
                                Breakfast
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('meta.pets')}
                                className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                            />
                            <label className="text-gray-900 text-sm">
                                Pets Allowed
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        {...register('location.address')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900 mb-2"
                        placeholder={
                            venue?.location?.address || 'Enter address'
                        }
                    />
                    <input
                        type="text"
                        {...register('location.city')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900 mb-2"
                        placeholder={venue?.location?.city || 'Enter city'}
                    />
                    <input
                        type="text"
                        {...register('location.zip')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900 mb-2"
                        placeholder={venue?.location?.zip || 'Enter zip code'}
                    />
                    <input
                        type="text"
                        {...register('location.country')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900 mb-2"
                        placeholder={
                            venue?.location?.country || 'Enter country'
                        }
                    />
                    <input
                        type="text"
                        {...register('location.continent')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900 mb-2"
                        placeholder={
                            venue?.location?.continent || 'Enter continent'
                        }
                    />
                    <input
                        type="number"
                        {...register('location.lat')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900 mb-2"
                        placeholder={venue?.location?.lat || 'Enter latitude'}
                    />
                    <input
                        type="number"
                        {...register('location.lng')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={venue?.location?.lng || 'Enter longitude'}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700 disabled:bg-gray-500">
                        {loading ? 'Updating...' : 'Update Venue'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading || !venue}
                        className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:bg-gray-300">
                        Reset Form
                    </button>
                </div>
            </form>
        </div>
    );
}
