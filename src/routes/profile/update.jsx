import { UpdateProfileForm } from '../../components/Forms/UpdateProfileForm';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

export function RenderUpdateProfile() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <div className="min-h-screen px-8 pt-12">
            <title>Holidaze | Update profile</title>
            <div className="w-full mx-auto">
                <div className="flex justify-start mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-gray-900 text-sm font-semibold hover:underline">
                        <span>
                            <IoIosArrowBack />
                        </span>{' '}
                        Back to Profile
                    </button>
                </div>
                <UpdateProfileForm />
            </div>
        </div>
    );
}
