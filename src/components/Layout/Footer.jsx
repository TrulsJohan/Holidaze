import { useState } from 'react';

export function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    const handleTouchToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            <footer
                className={`fixed bottom-0 left-0 w-full bg-gray-900 text-gray-50 rounded-t-lg px-8 transition-transform duration-300 z-50 ${
                    isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-20px)]'
                }`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}>
                <div
                    className="absolute top-0 left-0 w-full h-8 bg-gray-900 flex items-center justify-center cursor-pointer pointer-events-auto"
                    onClick={handleTouchToggle}>
                    <span className="text-xs text-gray-50 flex items-center gap-1">
                        {isOpen ? (
                            <div className="w-8 h-1 rounded-lg bg-gray-500 hover:w-12"></div>
                        ) : (
                            <div className="w-8 h-1 rounded-lg bg-gray-500"></div>
                        )}
                    </span>
                </div>

                <div className="max-w-3xl mx-auto p-4 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Contact
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href=""
                                        className="hover:text-gray-300 transition-colors">
                                        support@holidaze.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href=""
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-gray-300 transition-colors">
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href=""
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-gray-300 transition-colors">
                                        Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Venue Manager
                            </h3>
                            <p className="text-sm">
                                In order to rent out venues, become a Venue
                                Manager. Todo so, you can update your profile
                                with the Venue Manger option checked.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                About
                            </h3>
                            <p className="text-sm">
                                Holidaze is your go-to platform for finding and
                                managing unique venues for every occasion.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-700 pt-4 text-center">
                        <p className="text-sm">
                            © {new Date().getFullYear()} Holidaze. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
