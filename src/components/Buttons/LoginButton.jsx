import { Link, useNavigate } from 'react-router-dom';

export function LoginButton({ onClose }) {
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.clear();
        onClose();
        navigate('/');
    };

    return (
        <>
            {!token ? (
                <Link
                    to="/login"
                    className="py-2 px-4 hover:text-gray-400 w-full text-center font-semibold"
                    onClick={onClose}
                    role="menuitem">
                    Sign In
                </Link>
            ) : (
                <button
                    onClick={handleSignOut}
                    className="py-2 px-4 hover:text-gray-400 w-full text-center font-semibold"
                    role="menuitem">
                    Sign Out
                </button>
            )}
        </>
    );
}
