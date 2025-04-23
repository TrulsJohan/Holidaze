import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMenu } from 'react-icons/io';
import logo from '../../assets/HD.svg';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="sticky top-0 bg-transparent z-10">
            <nav className="flex flex-row justify-between items-center py-4 px-8 bg-transparent">
                <Link to="/">
                    <img src={logo} alt="Holidaze logo" className="" />
                </Link>
                <div className="bg-gray-900 p-1 rounded-full">
                    <button
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        className="focus:outline-none p-1 rounded-full">
                        <IoIosMenu className="text-2xl text-white" />
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
                        role="menuitem">
                        Home
                    </Link>
                    <Link
                        to="/profile"
                        className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem">
                        Profile
                    </Link>
                    <Link
                        to="/create-post"
                        className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem">
                        Create Post
                    </Link>
                    <Link
                        to="/login"
                        className="py-2 px-4 hover:bg-gray-800 w-full text-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem">
                        Login
                    </Link>
                </div>
            )}
        </header>
    );
}
