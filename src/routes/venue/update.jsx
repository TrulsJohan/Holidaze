import { UpdateVenueForm } from '../../components/Forms/UpdateVenueForm';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export function RenderUpdateVenue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(`/venue/${id}`);
    };

    return (
        <div className="min-h-screen sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
            <title>Holidaze | Update venue</title>
            <div className="max-w-md sm:max-w-lg lg:max-w-4xl mx-auto">
                <div className="flex justify-start mb-4 sm:mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 sm:gap-2 text-gray-900 text-sm sm:text-base font-semibold hover:underline">
                        <span>
                            <IoIosArrowBack />
                        </span>
                        Back to Venue
                    </button>
                </div>
                <UpdateVenueForm />
            </div>
        </div>
    );
}
