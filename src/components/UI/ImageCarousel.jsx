import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export function ImageCarousel({ media }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images =
        media && media.length > 0
            ? media
            : [
                  {
                      url: 'https://via.placeholder.com/400x240?text=No+Image',
                      alt: 'No image available',
                  },
              ];

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-[240px]">
            <img
                src={images[currentIndex].url}
                alt={images[currentIndex].alt || 'Venue image'}
                className="w-full h-full object-cover rounded-md"
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 text-white p-2 rounded-full hover:bg-gray-900"
                        aria-label="Previous image">
                        <FaArrowLeft />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 text-white p-2 rounded-full hover:bg-gray-900"
                        aria-label="Next image">
                        <FaArrowRight />
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index === currentIndex
                                        ? 'bg-white'
                                        : 'bg-gray-400'
                                }`}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
