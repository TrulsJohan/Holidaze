import { useEffect, useState } from 'react';
import { getProfile } from '../../hooks/profile/getProfile';

export function RenderProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const name = localStorage.getItem('name');
    if (!name) {
        console.error('Could not find name in localStorage');
    }

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getProfile(name);
                setProfile(response.data);
            } catch (error) {
                console.error('Could not fetch profile:', error.message);
                setError(error.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [name]);

    return (
        <>
            <title>Holidaze | {profile ? profile.name : 'Profile'}</title>
            <div className="min-h-screen bg-gray-100 p-8">
                {loading && (
                    <p className="text-gray-900 text-center">
                        Loading profile...
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!profile && !loading && !error && (
                    <p className="text-gray-900 text-center">No profile found.</p>
                )}
            </div>
        </>
    );
}
