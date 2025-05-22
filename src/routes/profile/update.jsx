import { UpdateProfileForm } from '../../components/Forms/UpdateProfileForm';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

export function RenderUpdateProfile() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
            <title>Holidaze | Update profile</title>
            <div className="max-w-md sm:max-w-lg lg:max-w-4xl mx-auto">
                <div className="flex justify-start mb-4 sm:mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 sm:gap-2 text-gray-900 text-sm sm:text-base font-semibold hover:underline">
                        <span>
                            <IoIosArrowBack />
                        </span>
                        Back to Profile
                    </button>
                </div>
                <UpdateProfileForm />
            </div>
        </div>
    );
}
