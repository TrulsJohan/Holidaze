import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVenue } from '../../hooks/venue/createVenue.jsx';
import { CreateVenueForm } from '../../components/Forms/CreateVenueForm';
import { IoIosArrowBack } from 'react-icons/io';

export function RenderCreateVenue() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    const handleSubmit = async (venueData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createVenue(venueData);
            console.log('Venue created successfully:', response);
            navigate(`/venue/${response.data.id}`);
        } catch (error) {
            console.error('Error creating venue:', error);
            setError(error.message || 'Failed to create venue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
            <title>Holidaze | Create venue</title>
            {loading && (
                <p className="text-gray-900 text-center text-sm sm:text-base">
                    Creating venue...
                </p>
            )}
            <div className="flex justify-start mb-4 sm:mb-6 max-w-md sm:max-w-lg lg:max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1 sm:gap-2 text-gray-900 text-sm sm:text-base font-semibold hover:underline">
                    <span>
                        <IoIosArrowBack />
                    </span>
                    Back home
                </button>
            </div>
            <CreateVenueForm onSubmit={handleSubmit} error={error} />
        </div>
    );
}
