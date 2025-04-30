import { LiaStar, LiaStarSolid } from 'react-icons/lia';

export function VenueRating({
    rating,
    maxRating = 5,
    size = 20,
    className = '',
    readOnly = false,
    onRatingChange,
}) {
    const safeRating = isNaN(rating) || rating == null ? 0 : Number(rating);
    const clampedRating = Math.max(0, Math.min(maxRating, safeRating));

    const fullStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating % 1 >= 0.5;

    return (
        <div className={`flex items-center ${className}`}>
            {Array.from({ length: maxRating }, (_, index) => {
                const isFull = index < fullStars;
                const isHalf = !isFull && index === fullStars && hasHalfStar;

                return (
                    <span
                        key={`star-${index}`}
                        onClick={() => !readOnly && onRatingChange?.(index + 1)}
                        onMouseEnter={() =>
                            !readOnly && setHoveredRating(index + 1)
                        }
                        className={readOnly ? '' : 'cursor-pointer'}>
                        {isFull || isHalf ? (
                            <LiaStarSolid
                                size={size}
                                className="text-gray-100"
                            />
                        ) : (
                            <LiaStar size={size} className="text-gray-100" />
                        )}
                    </span>
                );
            })}
        </div>
    );
}
