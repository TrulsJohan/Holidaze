import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMenu } from 'react-icons/io';
import logo from '../../assets/HD.svg';
import glassEffect from '../../assets/classEffect.png';
import greenTop from '../../assets/greenTop.png';
import greenBottom from '../../assets/greenBottom.png';
import yellowTop from '../../assets/yellowTop.png';
import yellowBottom from '../../assets/yellowBottom.png';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 bg-transparent">
            <img
                src={glassEffect}
                alt="Glass effect background"
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
            />
            <img
                src={greenTop}
                alt="Green top dot decoration"
                className="absolute top-0 right-0 translate-x-[20%] translate-y-[-30%] z-[-1]"
            />
            <img
                src={greenBottom}
                alt="Green bottom dot decoration"
                className="absolute top-[382px] left-0 translate-x-[-30%] z-[-1]"
            />
            <img
                src={yellowTop}
                alt="Yellow top dot decoration"
                className="absolute top-[84px] left-9 z-[-1]"
            />
            <img
                src={yellowBottom}
                alt="Yellow bottom dot decoration"
                className="absolute top-[332px] right-0 translate-x-[30%] z-[-1]"
            />
            <nav className="flex flex-row justify-between items-center py-4 px-8 z-20 relative bg-transparent">
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
                    className="absolute top-full left-0 w-full bg-gray-900 text-white z-50 flex flex-col items-center py-4 rounded-b-lg shadow-lg pointer-events-auto"
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
