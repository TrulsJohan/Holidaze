import { useForm } from 'react-hook-form';

export function FilterForm({ onSubmit, onClear, onClose }) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            dateFrom: '',
            dateTo: '',
            priceFrom: '',
            priceTo: '',
            location: '',
            guests: '',
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
        },
    });

    const handleClear = () => {
        reset();
        onClear();
    };

    return (
        <div className="absolute top-12 left-0 bg-white p-6 rounded-lg shadow-lg border border-gray-200 z-50 w-80">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-900 text-sm">
                        From Date
                    </label>
                    <input
                        type="date"
                        {...register('dateFrom')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 text-sm">
                        To Date
                    </label>
                    <input
                        type="date"
                        {...register('dateTo')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 text-sm">
                        Price From
                    </label>
                    <input
                        type="number"
                        min="0"
                        {...register('priceFrom')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Min price"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 text-sm">
                        Price To
                    </label>
                    <input
                        type="number"
                        min="0"
                        {...register('priceTo')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Max price"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 text-sm">City</label>
                    <input
                        type="text"
                        {...register('location')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="e.g., Oslo"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 text-sm">
                        Guests
                    </label>
                    <input
                        type="number"
                        min="1"
                        {...register('guests')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder="Number of guests"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('wifi')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        WiFi
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('parking')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        Parking
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('breakfast')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        Breakfast
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('pets')}
                            className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                        />
                        Pets Allowed
                    </label>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700">
                        Find
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                        Clear
                    </button>
                </div>
            </form>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-900 hover:text-gray-700">
                ✕
            </button>
        </div>
    );
}
