import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const SearchBar = ({ onSearch, onFilterChange }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        condition: '',
        sort: ''
    });

    const handleFilterChange = (type, value) => {
        const newFilters = { ...activeFilters, [type]: value };
        setActiveFilters(newFilters);
        onFilterChange(type, value);
    };

    const clearFilters = () => {
        setActiveFilters({ category: '', condition: '', sort: '' });
        onFilterChange('category', '');
        onFilterChange('condition', '');
        onFilterChange('sort', '');
    };

    const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

    return (
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 animate-slide-up">
            <div className="flex flex-col gap-4">
                {/* Search Input with Filter Toggle */}
                <div className="flex gap-3">
                    <div className="flex-1 relative group">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products, brands, models..."
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-6 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2 ${showFilters || hasActiveFilters
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FaFilter />
                        <span className="hidden sm:inline">Filters</span>
                        {hasActiveFilters && (
                            <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {Object.values(activeFilters).filter(v => v !== '').length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl animate-scale-in">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                value={activeFilters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white"
                            >
                                <option value="">All Categories</option>
                                <option value="Electronics">📱 Electronics</option>
                                <option value="Phones">📞 Phones</option>
                                <option value="Laptops">💻 Laptops</option>
                                <option value="Clothing">👕 Clothing</option>
                                <option value="Home">🏠 Home & Garden</option>
                            </select>
                        </div>

                        {/* Condition Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                            <select
                                value={activeFilters.condition}
                                onChange={(e) => handleFilterChange('condition', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white"
                            >
                                <option value="">Any Condition</option>
                                <option value="new">✨ New</option>
                                <option value="used">♻️ Used</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                            <select
                                value={activeFilters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white"
                            >
                                <option value="">Default</option>
                                <option value="price_asc">💰 Price: Low to High</option>
                                <option value="price_desc">💎 Price: High to Low</option>
                                <option value="newest">🆕 Newest First</option>
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
                                >
                                    <FaTimes /> Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
