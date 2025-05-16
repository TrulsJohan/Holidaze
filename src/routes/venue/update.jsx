import { UpdateVenueForm } from '../../components/Forms/UpdateVenueForm';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export function RenderUpdateVenue() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(`/venue/${id}`);
    }

    return (
        <div className="min-h-screen px-8 py-12">
            <title>Holidaze | Update venue</title>
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-start mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-gray-900 text-sm font-semibold hover:underline">
                        <span>
                            <IoIosArrowBack />
                        </span>{' '}
                        Back to Venue
                    </button>
                </div>
                <UpdateVenueForm />
            </div>
        </div>
    );
}
