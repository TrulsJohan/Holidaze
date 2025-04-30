import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { LoginButton } from '../Buttons/LoginButton';
import logo from '../../assets/HD.svg';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const token = localStorage.getItem('accessToken');

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <header className="sticky top-0 backdrop-blur-sm z-10">
            <nav className="flex flex-row justify-between items-center py-4 px-8">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Holidaze logo"
                        className="h-6 w-auto"
                    />
                </Link>
                <div className="bg-gray-900 p-1 rounded-full">
                    <button
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        className="focus:outline-none p-1 rounded-full">
                        {!isMenuOpen === true ? (
                            <HiOutlineMenu className="text-2xl text-white" />
                        ) : (
                            <HiOutlineMenuAlt1 className="text-2xl text-white" />
                        )}
                    </button>
                </div>
            </nav>
            {isMenuOpen && (
                <div
                    className="absolute top-full left-0 w-full bg-gray-900 text-white flex flex-col items-center py-4 rounded-b-lg shadow-lg pointer-events-auto"
                    role="menu">
                    <Link
                        to="/"
                        className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                        aria-current={
                            location.pathname === '/' ? 'page' : undefined
                        }>
                        Home
                    </Link>
                    {!token ? (
                        <></>
                    ) : (
                        <div className="flex flex-col items-center">
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
                                Create Post
                            </Link>
                        </div>
                    )}
                    <LoginButton onClose={() => setIsMenuOpen(false)} />
                </div>
            )}
        </header>
    );
}
