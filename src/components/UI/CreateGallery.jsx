import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { FaTrash } from 'react-icons/fa';

export function CreateGallery({ register, watch, setValue, errors }) {
    const [mediaFields, setMediaFields] = useState([
        { id: Date.now(), url: '' },
    ]);
    const [imageStatus, setImageStatus] = useState({});
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const mediaValues = watch('media') || [{ url: '' }];
    const sliderRef = useRef(null);

    const validImages = mediaValues
        .map((media, index) => ({
            url: media.url,
            alt: 'venue image',
            id: mediaFields[index]?.id || index,
        }))
        .filter((image) => image.url && image.url.trim() !== '');

    useEffect(() => {
        const newMediaValues = mediaFields.map((field, index) => ({
            url: mediaValues[index]?.url || '',
        }));
        setValue('media', newMediaValues, { shouldValidate: true });
    }, [mediaFields, setValue]);

    const addMediaField = () => {
        const newField = { id: Date.now(), url: '' };
        const newMediaFields = [...mediaFields, newField];
        setMediaFields(newMediaFields);
    };

    const removeMediaField = (index) => {
        if (mediaFields.length > 1) {
            const newFields = mediaFields.filter((_, i) => i !== index);
            setMediaFields(newFields);
            setImageStatus((prev) => {
                const newStatus = { ...prev };
                delete newStatus[mediaFields[index].id];
                return newStatus;
            });
            setActiveImageIndex(0);
        }
    };

    const handleImageLoad = (id) => {
        setImageStatus((prev) => ({ ...prev, [id]: 'loaded' }));
    };

    const handleImageError = (id) => {
        setImageStatus((prev) => ({ ...prev, [id]: 'failed' }));
    };

    const [debouncedMediaValues] = useDebounce(mediaValues, 500);

    useEffect(() => {
        setImageStatus((prev) => {
            const newStatus = { ...prev };
            debouncedMediaValues.forEach((media, index) => {
                const id = mediaFields[index]?.id || index;
                if (media.url && media.url.trim() !== '') {
                    if (!newStatus[id] || newStatus[id] === 'loading') {
                        newStatus[id] = 'loading';
                    }
                } else {
                    delete newStatus[id];
                }
            });
            Object.keys(newStatus).forEach((id) => {
                if (!mediaFields.some((field) => field.id === Number(id))) {
                    delete newStatus[id];
                }
            });
            return newStatus;
        });
    }, [debouncedMediaValues, mediaFields]);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const imageWidth = 240;
            const gap = 16;
            const index = Math.round(scrollLeft / (imageWidth + gap));
            setActiveImageIndex(index);
        };

        slider.addEventListener('scroll', handleScroll);
        return () => slider.removeEventListener('scroll', handleScroll);
    }, [validImages.length]);

    const handleDotClick = (index) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const imageWidth = 240;
        const gap = 16;
        const scrollPosition = index * (imageWidth + gap);
        slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        setActiveImageIndex(index);
    };

    return (
        <div className="bg-gray-900 flex w-full flex-col gap-4 p-2 rounded-lg">
            <div>
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-4 py-2 snap-x snap-mandatory">
                    {validImages.length > 0 ? (
                        validImages.map((image) => (
                            <div
                                key={image.id}
                                className="w-[240px] h-[240px] flex-shrink-0 snap-center">
                                {imageStatus[image.id] === 'loading' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                                        <span className="text-gray-900">
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        src={
                                            imageStatus[image.id] === 'failed'
                                                ? 'https://placehold.co/400x240?text=Image+Failed'
                                                : image.url
                                        }
                                        alt={image.alt}
                                        className="w-full h-full object-cover rounded-md"
                                        onLoad={() => handleImageLoad(image.id)}
                                        onError={() =>
                                            handleImageError(image.id)
                                        }
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <img
                            src="https://placehold.co/400x240?text=No+Image"
                            alt="Placeholder image"
                            className="w-[240px] h-[240px] object-cover rounded-md flex-shrink-0"
                        />
                    )}
                </div>
                {validImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-2">
                        {validImages.map((_, index) => (
                            <span
                                key={index}
                                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                    index === activeImageIndex
                                        ? 'bg-gray-50'
                                        : 'bg-gray-700 hover:bg-gray-500'
                                }`}
                                onClick={() => handleDotClick(index)}
                            />
                        ))}
                    </div>
                )}
                <div className="flex flex-col gap-2 mt-4">
                    {mediaFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 mb-2">
                            <div className="w-full">
                                <input
                                    type="url"
                                    {...register(`media.${index}.url`, {
                                        maxLength: {
                                            value: 200,
                                            message:
                                                'Image URL cannot exceed 200 characters',
                                        },
                                        pattern: {
                                            value: /^https?:\/\/.+/i,
                                            message: 'Must be a valid URL',
                                        },
                                    })}
                                    className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                                    placeholder="Image URL"
                                />
                                <div className="flex justify-between text-gray-50 text-xs mt-1">
                                    <span>Enter image URL...</span>
                                    <span>
                                        {(mediaValues[index]?.url?.length ||
                                            0) + '/200'}
                                    </span>
                                </div>
                                {errors.media?.[index]?.url && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.media[index].url.message}
                                    </p>
                                )}
                            </div>
                            {mediaFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMediaField(index)}
                                    className="px-2 py-2 h-fit bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    <FaTrash className="text-2xl" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMediaField}
                        className="mt-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-700">
                        Add Image
                    </button>
                </div>
            </div>
        </div>
    );
}
