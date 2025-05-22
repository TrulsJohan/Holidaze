import { useNavigate } from 'react-router-dom';

export function VenueManagerPopup({ isOpen, onClose, onGoToProfile }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-900 text-gray-50 rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">
                        Venue Manager Required
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close popup"
                        className="text-gray-50 hover:text-gray-300 focus:outline-none">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-sm sm:text-base mb-6">
                    You must be a venue manager to rent out venues. To become a
                    venue manager, update your profile and check the venue
                    manager box.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            onGoToProfile();
                            onClose();
                        }}
                        className="py-2 px-4 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-700 text-sm sm:text-base">
                        Go to Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
