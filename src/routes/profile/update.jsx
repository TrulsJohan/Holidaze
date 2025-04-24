import { UpdateProfileForm } from '../../components/Forms/UpdateProfileForm';

export function RenderUpdateProfile() {
    return (
        <div className="min-h-screen px-8 py-12 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                    Edit Your Profile
                </h1>
                <UpdateProfileForm />
            </div>
        </div>
    );
}
