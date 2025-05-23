import { useForm } from 'react-hook-form';
import { FaLocationDot } from 'react-icons/fa6';

export function FilterForm({ onSubmit, onClear }) {
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
        <div className="absolute w-full top-18 left-0 bg-gray-900 p-2 rounded-lg z-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2 text-sm bg-gray-50 rounded-t-lg border p-2 items-center">
                        <label className="text-gray-500 w-full text-left">From</label>
                        <input
                            type="date"
                            {...register('dateFrom')}
                            className="w-full bg-transparent text-gray-900"
                        />
                    </div>
                    <div className="flex flex-col gap-2 text-sm bg-gray-50 rounded-b-lg border p-2 items-center">
                        <label className="text-gray-500 w-full text-left">To</label>
                        <input
                            type="date"
                            {...register('dateTo')}
                            className="w-full bg-transparent text-gray-900"
                        />
                    </div>
                </div>

                <div className="flex flex-row w-full">
                    <div className="flex flex-col w-full gap-2 text-sm bg-gray-50 rounded-l-lg border p-2 items-center">
                        <label className="text-gray-500 w-full text-left">From</label>
                        <input
                            type="number"
                            min="0"
                            {...register('priceFrom')}
                            className="w-full bg-transparent text-gray-900"
                            placeholder="Min price"
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2 text-sm bg-gray-50 rounded-r-lg border p-2 items-center">
                        <label className="text-gray-500 w-full text-left">To</label>
                        <input
                            type="number"
                            min="0"
                            {...register('priceTo')}
                            className="w-full bg-transparent text-gray-900"
                            placeholder="Max price"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-4 text-sm bg-gray-50 rounded-lg border p-2 items-center">
                    <FaLocationDot className="text-gray-500" />
                    <input
                        type="text"
                        {...register('location')}
                        className="w-full bg-transparent text-gray-900"
                        placeholder="e.g., Oslo"
                    />
                </div>
                <div>
                    <select
                        {...register('guests')}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-500 text-sm">
                        <option value="" disabled>
                            Number of guests
                        </option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2 text-gray-50 text-sm">
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
                        className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
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
        </div>
    );
}
