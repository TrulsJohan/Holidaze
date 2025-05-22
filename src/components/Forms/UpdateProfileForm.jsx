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
    const [venueManagerError, setVenueManagerError] = useState(null);
    const [attemptedUncheck, setAttemptedUncheck] = useState(false);
    const name = localStorage.getItem('name');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        clearErrors,
    } = useForm({
        defaultValues: {
            bio: '',
            avatar: { url: '' },
            banner: { url: '' },
            venueManager: false,
        },
    });

    const bioValue = watch('bio') || '';
    const venueManagerValue = watch('venueManager');

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
                localStorage.setItem(
                    'venueManager',
                    String(profileData.venueManager)
                );
            } catch (error) {
                console.error('Could not fetch profile:', error.message);
                setError(error.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [name, reset]);

    useEffect(() => {
        const checkVenues = async () => {
            if (venueManagerValue === false) {
                try {
                    const venuesResponse = await getProfile(name);
                    if (
                        venuesResponse.data &&
                        venuesResponse.data.venues.length > 0
                    ) {
                        setVenueManagerError(
                            'You can’t uncheck because you have venues for rent'
                        );
                        setAttemptedUncheck(true);
                        setTimeout(() => {
                            setValue('venueManager', true, {
                                shouldValidate: false,
                            });
                            localStorage.setItem('venueManager', 'true');
                        }, 0);
                    } else {
                        setVenueManagerError(null);
                        setAttemptedUncheck(false);
                        localStorage.setItem('venueManager', 'false');
                    }
                } catch (error) {
                    console.error('Could not check venues:', error.message);
                    setVenueManagerError('Failed to verify venues');
                    setAttemptedUncheck(true);
                }
            } else if (!attemptedUncheck) {
                setVenueManagerError(null);
                localStorage.setItem('venueManager', 'true');
            }
        };

        if (profile) {
            checkVenues();
        }
    }, [venueManagerValue, name, setValue, profile]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setVenueManagerError(null);
        setAttemptedUncheck(false);
        clearErrors();

        try {
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
            localStorage.setItem(
                'venueManager',
                String(profileData.venueManager)
            );
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
        clearErrors();
        setError(null);
        setSuccess(null);
        setVenueManagerError(null);
        setAttemptedUncheck(false);
        localStorage.setItem(
            'venueManager',
            String(profile?.venueManager || false)
        );
    };

    if (!name || authError) {
        return (
            <div className="flex w-full flex-col gap-4 sm:gap-6 rounded-lg max-w-md sm:max-w-lg mx-auto p-4 sm:p-6">
                <p className="text-red-500 text-center text-sm sm:text-base">
                    Please log in to update your profile.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2 sm:py-3 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 text-sm sm:text-base">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full">
            <div className="max-w-md sm:max-w-lg lg:max-w-4xl mx-auto">
                {loading && (
                    <p className="text-gray-900 text-center text-sm sm:text-base">
                        Loading profile...
                    </p>
                )}
                {error && (
                    <p className="text-red-500 text-center text-sm sm:text-base">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-center text-sm sm:text-base">
                        {success}
                    </p>
                )}
                <div className="bg-gray-900 flex w-full flex-col gap-4 sm:gap-6 p-2 sm:p-3 rounded-lg">
                    <div>
                        <textarea
                            {...register('bio', {
                                required: 'Bio is required',
                                maxLength: {
                                    value: 500,
                                    message: 'Bio cannot exceed 500 characters',
                                },
                            })}
                            className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                            placeholder="Tell us more about you"
                            rows="4"
                        />
                        {errors.bio && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                {errors.bio.message}
                            </p>
                        )}
                        <div className="flex justify-between text-gray-50 text-xs sm:text-sm mt-1">
                            <span>Enter your bio...</span>
                            <span>{bioValue.length}/500</span>
                        </div>
                    </div>
                    <div>
                        {profile?.avatar?.url ? (
                            <img
                                src={profile.avatar.url}
                                alt="Avatar"
                                className="w-full h-40 sm:h-48 rounded-lg object-cover mb-2 sm:mb-3"
                            />
                        ) : (
                            <p className="text-gray-50 text-sm sm:text-base mb-2 sm:mb-3">
                                No avatar set
                            </p>
                        )}
                        <input
                            type="url"
                            {...register('avatar.url', {
                                required: 'Avatar URL is required',
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: 'Please enter a valid URL',
                                },
                            })}
                            className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                            placeholder="Enter avatar URL"
                        />
                        {errors.avatar?.url && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                {errors.avatar.url.message}
                            </p>
                        )}
                        <div className="flex justify-between text-gray-50 text-xs sm:text-sm mt-1">
                            <span>Enter avatar URL...</span>
                        </div>
                    </div>
                    <div>
                        {profile?.avatar?.url ? (
                            <img
                                src={profile.banner.url}
                                alt="Banner"
                                className="w-full h-40 sm:h-48 rounded-lg object-cover mb-2 sm:mb-3"
                            />
                        ) : (
                            <p className="text-gray-50 text-sm sm:text-base mb-2 sm:mb-3">
                                No banner set
                            </p>
                        )}
                        <input
                            type="url"
                            {...register('banner.url', {
                                required: 'Banner URL is required',
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: 'Please enter a valid URL',
                                },
                            })}
                            className="w-full p-2 sm:p-3 bg-gray-100 border border-gray-700 rounded-lg text-sm sm:text-base text-gray-900"
                            placeholder="Enter banner URL"
                        />
                        {errors.banner?.url && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                {errors.banner.url.message}
                            </p>
                        )}
                        <div className="flex justify-between text-gray-50 text-xs sm:text-sm mt-1">
                            <span>Enter banner URL...</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <label className="flex items-center gap-2 sm:gap-3 text-gray-50 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                {...register('venueManager')}
                                className="h-4 sm:h-5 w-4 sm:w-5 bg-gray-100 border border-gray-900 rounded"
                            />
                            <span>
                                Become a Venue Manager to rent out venues.
                            </span>
                        </label>
                        {errors.venueManager && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                {errors.venueManager.message}
                            </p>
                        )}
                        {venueManagerError && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                {venueManagerError}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 sm:py-3 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 disabled:bg-gray-500 text-sm sm:text-base">
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading || !profile}
                            className="w-full py-2 sm:py-3 bg-gray-900 text-gray-50 border border-gray-50 rounded-lg hover:bg-gray-300 disabled:bg-gray-500 text-sm sm:text-base">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
