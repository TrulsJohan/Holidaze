import { UpdateProfileForm } from '../../components/Forms/UpdateProfileForm';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

export function RenderUpdateProfile() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <div className="min-h-screen px-8 py-12 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-start mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-gray-900 text-sm font-semibold hover:underline">
                        <span>
                            <IoIosArrowBack />
                        </span>{' '}
                        Back home
                    </button>
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                    Edit Your Profile
                </h1>
                <UpdateProfileForm />
            </div>
        </div>
    );
}
