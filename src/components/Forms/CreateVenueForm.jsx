import { useForm } from 'react-hook-form';
import { useState } from 'react';

export function CreateVenueForm({ onSubmit, error }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            media: [{ url: '', alt: '' }],
            price: '',
            maxGuests: '',
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

    const [mediaFields, setMediaFields] = useState([{ url: '', alt: '' }]);

    const addMediaField = () => {
        setMediaFields([...mediaFields, { url: '', alt: '' }]);
    };

    const removeMediaField = (index) => {
        if (mediaFields.length > 1) {
            setMediaFields(mediaFields.filter((_, i) => i !== index));
        }
    };

    const onFormSubmit = (data) => {
        const formattedData = {
            ...data,
            price: Number(data.price),
            maxGuests: Number(data.maxGuests),
            rating: data.rating ? Number(data.rating) : 0,
            location: {
                ...data.location,
                lat: data.location.lat ? Number(data.location.lat) : 0,
                lng: data.location.lng ? Number(data.location.lng) : 0,
                address: data.location.address || null,
                city: data.location.city || null,
                zip: data.location.zip || null,
                country: data.location.country || null,
                continent: data.location.continent || null,
            },
            media: data.media.filter((media) => media.url),
        };
        onSubmit(formattedData);
        reset();
        setMediaFields([{ url: '', alt: '' }]);
    };

    return (
        <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-3xl mx-auto">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Name *
                </label>
                <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    placeholder="Venue name"
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Description *
                </label>
                <textarea
                    {...register('description', {
                        required: 'Description is required',
                    })}
                    className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    placeholder="Describe the venue"
                    rows={4}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Images
                </label>
                {mediaFields.map((_, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="url"
                            {...register(`media.${index}.url`)}
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
            </div>

            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Price per Night ($)*
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', {
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' },
                    })}
                    className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    placeholder="Price"
                />
                {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.price.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        {...register('location.address')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Address"
                    />
                    <input
                        type="text"
                        {...register('location.city')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="City"
                    />
                    <input
                        type="text"
                        {...register('location.zip')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="ZIP Code"
                    />
                    <input
                        type="text"
                        {...register('location.country')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Country"
                    />
                    <input
                        type="text"
                        {...register('location.continent')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Continent"
                    />
                    <input
                        type="number"
                        step="any"
                        {...register('location.lat')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Latitude"
                    />
                    <input
                        type="number"
                        step="any"
                        {...register('location.lng')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Longitude"
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Max Guests *
                </label>
                <input
                    type="number"
                    min="1"
                    {...register('maxGuests', {
                        required: 'Max guests is required',
                        min: { value: 1, message: 'Must be at least 1 guest' },
                    })}
                    className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    placeholder="Number of guests"
                />
                {errors.maxGuests && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.maxGuests.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-900 text-sm font-medium">
                    Amenities
                </label>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('meta.wifi')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        WiFi
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('meta.parking')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        Parking
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('meta.breakfast')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        Breakfast
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('meta.pets')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        Pets Allowed
                    </label>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700">
                    Create Venue
                </button>
                <button
                    type="button"
                    onClick={() => reset()}
                    className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                    Reset
                </button>
            </div>
        </form>
    );
}
