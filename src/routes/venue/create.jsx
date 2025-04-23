import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVenue } from '../../hooks/venue/createVenue.jsx';
import { CreateVenueForm } from '../../components/Forms/CreateVenueForm';

export function RenderCreateVenue() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="min-h-screen p-8 bg-gray-50">
            {loading && (
                <p className="text-gray-900 text-center">Creating venue...</p>
            )}
            <CreateVenueForm onSubmit={handleSubmit} error={error} />
        </div>
    );
}
