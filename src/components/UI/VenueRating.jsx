import { LiaStar, LiaStarHalf, LiaStarSolid } from 'react-icons/lia';
import { useState } from 'react';

export function VenueRating({
    rating,
    maxRating = 5,
    size = 16,
    className = '',
    readOnly = false,
    onRatingChange,
}) {
    const [hoveredRating, setHoveredRating] = useState(null);
    const clampedRating = Math.max(0, Math.min(maxRating, rating));

    const handleStarClick = (starIndex) => {
        if (readOnly || !onRatingChange) return;
        onRatingChange(starIndex + 1);
    };

    const handleStarHover = (starIndex) => {
        if (readOnly) return;
        setHoveredRating(starIndex + 1);
    };

    const handleMouseLeave = () => {
        if (readOnly) return;
        setHoveredRating(null);
    };

    const displayRating =
        hoveredRating !== null ? hoveredRating : clampedRating;
    const displayFullStars = Math.floor(displayRating);
    const displayHasHalfStar = displayRating % 1 >= 0.5;

    return (
        <div
            className={`flex items-center ${className}`}
            onMouseLeave={handleMouseLeave}>
            {Array.from({ length: maxRating }, (_, index) => {
                const isFull = index < displayFullStars;
                const isHalf =
                    !isFull && index === displayFullStars && displayHasHalfStar;

                return (
                    <span
                        key={`star-${index}`}
                        onClick={() => handleStarClick(index)}
                        onMouseEnter={() => handleStarHover(index)}
                        className={readOnly ? '' : 'cursor-pointer'}>
                        {isFull ? (
                            <LiaStarSolid
                                size={size}
                                className="text-gray-100 fill-current"
                            />
                        ) : isHalf ? (
                            <LiaStarHalf
                                size={size}
                                className="text-gray-100"
                                style={{ clipPath: 'inset(0 50% 0 0)' }}
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
