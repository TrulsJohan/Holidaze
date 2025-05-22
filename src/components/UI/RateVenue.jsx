export function RateVenue({ register, errors }) {
    return (
        <div>
            <select
                {...register('rating', {
                    valueAsNumber: true,
                })}
                className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900">
                <option value={0} disabled>
                    Select rating...
                </option>
                {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
            <div className="flex justify-between text-gray-50 text-xs mt-1">
                <span>Venue rating...</span>
            </div>
            {errors.rating && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.rating.message}
                </p>
            )}
        </div>
    );
}
