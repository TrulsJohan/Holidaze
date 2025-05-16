import { Link, useLocation } from 'react-router-dom';
import { LoginButton } from '../Buttons/LoginButton';

export function Menu({ isMenuOpen, setIsMenuOpen, token }) {
    const location = useLocation();

    return (
        <div
            className={`absolute top-full left-0 w-full bg-gray-900/95 text-gray-50 flex flex-col items-center py-4 rounded-b-lg shadow-lg pointer-events-auto transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            } lg:hidden`}
            role="menu">
            <Link
                to="/"
                className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-current={location.pathname === '/' ? 'page' : undefined}>
                Home
            </Link>
            {token && (
                <div className="flex flex-col w-full items-center">
                    <Link
                        to="/profile"
                        className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                        aria-current={
                            location.pathname === '/profile'
                                ? 'page'
                                : undefined
                        }>
                        Profile
                    </Link>
                    <Link
                        to="/venue/create"
                        className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                        aria-current={
                            location.pathname === '/venue/create'
                                ? 'page'
                                : undefined
                        }>
                        Venue
                    </Link>
                </div>
            )}
            <LoginButton onClose={() => setIsMenuOpen(false)} />
        </div>
    );
}
