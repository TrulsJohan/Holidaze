import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getProfile } from '../../hooks/profile/getProfile';
import { updateProfile } from '../../hooks/profile/updateProfile';

export function UpdateProfileForm() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const name = localStorage.getItem('name');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            bio: '',
            avatar: { url: '' },
            banner: { url: '' },
            venueManager: false,
        },
    });

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
                if (venuesResponse.data && venuesResponse.data.venues.length > 0) {
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

    if (!name) {
        return (
            <p className="text-red-500 text-center">
                Please log in to update your profile.
            </p>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Update Profile
            </h2>
            {loading && <p className="text-gray-900 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && (
                <p className="text-green-500 text-center mb-4">{success}</p>
            )}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Bio
                    </label>
                    <textarea
                        {...register('bio', {
                            maxLength: {
                                value: 500,
                                message: 'Bio cannot exceed 500 characters',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={profile?.bio || 'Tell us more about you'}
                        rows="4"
                    />
                    {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.bio.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Avatar URL
                    </label>
                    <input
                        type="url"
                        {...register('avatar.url', {
                            pattern: {
                                value: /^https?:\/\/.+/i,
                                message: 'Please enter a valid URL',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={profile?.avatar?.url || 'No avatar set'}
                    />
                    {errors.avatar?.url && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.avatar.url.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-900 text-sm mb-1">
                        Banner URL
                    </label>
                    <input
                        type="url"
                        {...register('banner.url', {
                            pattern: {
                                value: /^https?:\/\/.+/i,
                                message: 'Please enter a valid URL',
                            },
                        })}
                        className="w-full p-2 bg-gray-100 border border-gray-700 rounded-lg text-gray-900"
                        placeholder={profile?.banner?.url || 'No banner set'}
                    />
                    {errors.banner?.url && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.banner.url.message}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register('venueManager')}
                        className="h-4 w-4 bg-gray-100 border border-gray-900 rounded"
                    />
                    <label className="text-gray-900 text-sm">
                        Venue Manager
                    </label>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700 disabled:bg-gray-500">
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading || !profile}
                        className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:bg-gray-300">
                        Reset Form
                    </button>
                </div>
            </form>
        </div>
    );
}
