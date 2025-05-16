import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { LoginButton } from '../Buttons/LoginButton';
import { Menu } from '../UI/Menu';
import logo from '../../assets/HD.svg';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('accessToken'));
        };

        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(() => {
            const newToken = localStorage.getItem('accessToken');
            if (newToken !== token) {
                setToken(newToken);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [token]);

    return (
        <header className="sticky top-0 backdrop-blur-sm z-20 w-full max-w-full">
            <nav className="flex flex-row justify-between items-center py-4 px-4 sm:px-8 lg:px-12">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Holidaze logo"
                        className="h-6 w-auto"
                    />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <Link
                            to="/"
                            className="text-gray-900 hover:text-gray-300 transition-colors">
                            Home
                        </Link>
                        {token && (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-900 hover:text-gray-300 transition-colors">
                                    Profile
                                </Link>
                                <Link
                                    to="/venue/create"
                                    className="text-gray-900 hover:text-gray-300 transition-colors">
                                    Venue
                                </Link>
                            </>
                        )}
                        <LoginButton />
                    </div>
                    <div className="bg-gray-900 p-1 rounded-full md:hidden">
                        <button
                            onClick={toggleMenu}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                            className="focus:outline-none p-1 rounded-full">
                            {isMenuOpen ? (
                                <HiOutlineMenuAlt1 className="text-2xl text-gray-50" />
                            ) : (
                                <HiOutlineMenu className="text-2xl text-gray-50" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>
            <Menu
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                token={token}
            />
        </header>
    );
}
