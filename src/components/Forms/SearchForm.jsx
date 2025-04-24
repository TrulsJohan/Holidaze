import { CiSearch } from 'react-icons/ci';

export function SearchForm({ onChange }) {
    const handleInputChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="flex flex-row gap-3 w-full p-3 rounded-lg bg-gray-100 border border-gray-700 focus-within:border-gray-900">
            <CiSearch className="text-2xl text-gray-500" />
            <input
                id="searchQuery"
                type="text"
                onChange={handleInputChange}
                className="w-full text-gray-900 bg-transparent outline-none"
                placeholder="Search venues..."
            />
        </div>
    );
}
