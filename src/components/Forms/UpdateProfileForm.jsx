import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getProfile } from '../../hooks/profile/getProfile';
import { updateProfile } from '../../hooks/profile/updateProfile';
import { useNavigate } from 'react-router-dom';

export function UpdateProfileForm() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [success, setSuccess] = useState(null);
    const name = localStorage.getItem('name');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            bio: '',
            avatar: { url: '' },
            banner: { url: '' },
            venueManager: false,
        },
    });

    const bioValue = watch('bio') || '';

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || !name) {
            setAuthError('You must be logged in to update your profile.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!name) {
                setError('User name not found. Please log in.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await getProfile(name);
                const profileData = response.data;
                setProfile(profileData);
                reset({
                    bio: profileData.bio || '',
                    avatar: { url: profileData.avatar?.url || '' },
                    banner: { url: profileData.banner?.url || '' },
                    venueManager: profileData.venueManager || false,
                });
            } catch (error) {
                console.error('Could not fetch profile:', error.message);
                setError(error.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [name, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (!data.venueManager) {
                const venuesResponse = await getProfile(name);
                if (
                    venuesResponse.data &&
                    venuesResponse.data.venues.length > 0
                ) {
                    throw new Error(
                        'Cannot disable Venue Manager while you have active venues'
                    );
                }
            }

            await updateProfile(name, data);
            setSuccess('Profile updated successfully!');
            const response = await getProfile(name);
            const profileData = response.data;
            setProfile(profileData);
            reset({
                bio: profileData.bio || '',
                avatar: { url: profileData.avatar?.url || '' },
                banner: { url: profileData.banner?.url || '' },
                venueManager: profileData.venueManager || false,
            });
        } catch (error) {
            console.error('Could not update profile:', error.message);
            setError(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        reset({
            bio: profile?.bio || '',
            avatar: { url: profile?.avatar?.url || '' },
            banner: { url: profile?.banner?.url || '' },
            venueManager: profile?.venueManager || false,
        });
        setError(null);
        setSuccess(null);
    };

    if (!name || authError) {
        return (
            <div className="flex w-full flex-col gap-4 rounded-lg max-w-3xl mx-auto p-4">
                <p className="text-red-500 text-center">
                    Please log in to update your profile.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4 rounded-lg mx-auto">
            {loading && (
                <p className="text-gray-900 text-center">Loading profile...</p>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-4 rounded-lg">
                <div className="bg-gray-900 flex w-full flex-col gap-6 p-2 rounded-lg">
                    <div>
                        <textarea
                            {...register('bio', {
                                maxLength: {
                                    value: 500,
                                    message: 'Bio cannot exceed 500 characters',
                                },
                            })}
                            className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                            placeholder="Tell us more about you"
                            rows="4"
                        />
                        <div className="flex justify-between text-gray-50 text-xs mt-1">
                            <span>Enter your bio...</span>
                            <span>{bioValue.length}/500</span>
                        </div>
                        {errors.bio && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.bio.message}
                            </p>
                        )}
                    </div>
                    <div>
                        {profile?.avatar?.url ? (
                            <img
                                src={profile.avatar.url}
                                alt="Avatar"
                                className="w-full h-[200px] rounded-lg object-cover mb-2"
                            />
                        ) : (
                            <p className="text-gray-50 text-sm mb-2">
                                No avatar set
                            </p>
                        )}
                        <input
                            type="url"
                            {...register('avatar.url', {
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: 'Please enter a valid URL',
                                },
                            })}
                            className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                            placeholder="Enter avatar URL"
                        />
                        <div className="flex justify-between text-gray-50 text-xs mt-1">
                            <span>Enter avatar URL...</span>
                        </div>
                        {errors.avatar?.url && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.avatar.url.message}
                            </p>
                        )}
                    </div>
                    <div>
                        {profile?.banner?.url ? (
                            <img
                                src={profile.banner.url}
                                alt="Banner"
                                className="w-full h-[200px] rounded-lg object-cover mb-2"
                            />
                        ) : (
                            <p className="text-gray-50 text-sm mb-2">
                                No banner set
                            </p>
                        )}
                        <input
                            type="url"
                            {...register('banner.url', {
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: 'Please enter a valid URL',
                                },
                            })}
                            className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                            placeholder="Enter banner URL"
                        />
                        <div className="flex justify-between text-gray-50 text-xs mt-1">
                            <span>Enter banner URL...</span>
                        </div>
                        {errors.banner?.url && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.banner.url.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-4 text-gray-50 text-sm">
                            <input
                                type="checkbox"
                                {...register('venueManager')}
                                className="h-5 w-5 bg-gray-100 border border-gray-900 rounded"
                            />
                            <span>Become a Venue Manager to rent out venues.</span>
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 disabled:bg-gray-500">
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading || !profile}
                            className="w-full py-2 bg-gray-900 text-gray-50 border border-gray-50 rounded-lg hover:bg-gray-300 disabled:bg-gray-500">
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
