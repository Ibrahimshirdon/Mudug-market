import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { FaSpinner, FaExclamationTriangle, FaShoppingBag, FaRocket, FaTags, FaFire, FaStore, FaShieldAlt, FaTruck, FaHeadset, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [featuredShops, setFeaturedShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        condition: '',
        sort: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, products]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, shopsRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/shops')
            ]);

            setProducts(productsRes.data);
            setFilteredProducts(productsRes.data);

            // Extract unique categories
            const uniqueCategories = [...new Set(productsRes.data.map(p => p.category_id?.name).filter(Boolean))];
            setCategories(uniqueCategories);

            // Get featured shops (active shops, limited to 4)
            const activeShops = shopsRes.data.filter(s => s.status === 'approved');
            setFeaturedShops(activeShops.slice(0, 4));

            setError(null);
        } catch (error) {
            console.error(error);
            setError('Failed to load marketplace data. Please check connection.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (filters.search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.model?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.category) {
            filtered = filtered.filter(p => p.category_id?.name === filters.category);
        }

        if (filters.condition) {
            filtered = filtered.filter(p => p.condition === filters.condition);
        }

        if (filters.sort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (filters.sort === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        setFilteredProducts(filtered);
    };

    const handleSearch = (searchTerm) => {
        setFilters({ ...filters, search: searchTerm });
    };

    const handleFilterChange = (filterType, value) => {
        setFilters({ ...filters, [filterType]: value });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <FaShoppingBag className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-primary-600" />
                </div>
                <p className="text-xl text-gray-600 mt-6 font-medium animate-pulse">Loading amazing deals...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
                <div className="bg-red-50 p-8 rounded-3xl text-center max-w-md border border-red-100 shadow-sm">
                    <FaExclamationTriangle className="text-6xl text-red-500 mb-4 mx-auto" />
                    <p className="text-xl text-gray-800 font-semibold mb-2">Connection Error</p>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchData}
                        className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn space-y-16 pb-12">

            {/* HER SECTION */}
            <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-800 text-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden mt-4 mx-2 md:mx-0">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                            <FaRocket className="text-yellow-300 animate-bounce" />
                            <span className="text-sm font-semibold tracking-wide">The #1 Marketplace in Galkacyo</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            Buy & Sell in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
                                Digital Speed
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed">
                            Join thousands of trusted sellers and happy buyers. From electronics to fashion, find everything you need locally.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-primary-800 rounded-xl font-bold hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg flex items-center gap-2">
                                Start Shopping <FaArrowRight />
                            </button>
                            <button onClick={() => navigate('/seller/dashboard')} className="px-8 py-4 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center gap-2 backdrop-blur-sm">
                                Open Your Shop <FaStore />
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        {/* Abstract Illustration Placeholder or specific graphic */}
                        <div className="bg-gradient-to-tr from-white/10 to-transparent p-8 rounded-3xl backdrop-blur-sm border border-white/10 relative transform rotate-3 hover:rotate-0 transition-all duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                {products.slice(0, 4).map((p, idx) => {
                                    const imgUrl = p.images?.[0]?.image_url || p.image_url;
                                    return (
                                        <div key={p.id} className={`bg-white p-3 rounded-xl shadow-lg transform ${idx % 2 === 0 ? 'translate-y-4' : '-translate-y-4'}`}>
                                            {imgUrl ? <img src={imgUrl.startsWith('http') ? imgUrl : `${imgUrl}`} className="w-full h-32 object-cover rounded-lg mb-2" /> : <div className="w-full h-32 bg-gray-100 rounded-lg mb-2"></div>}
                                            <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-2 w-12 bg-primary-200 rounded"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES SECTION */}
            {categories.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                        <button
                            onClick={() => handleFilterChange('category', '')}
                            className={`flex flex-col items-center justify-center min-w-[100px] h-28 rounded-2xl transition-all ${!filters.category ? 'bg-primary-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            <FaTags className="text-2xl mb-2" />
                            <span className="font-medium">All</span>
                        </button>
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleFilterChange('category', cat)}
                                className={`flex flex-col items-center justify-center min-w-[100px] h-28 rounded-2xl transition-all ${filters.category === cat ? 'bg-primary-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                            >
                                <FaShoppingBag className="text-2xl mb-2" />
                                <span className="font-medium text-sm px-2 text-center break-words w-full">{cat}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* FEATURED SHOPS */}
            {featuredShops.length > 0 && (
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FaStore className="text-primary-500" /> Featured Shops
                            </h2>
                            <p className="text-gray-500">Top rated sellers in your area</p>
                        </div>
                        <button className="text-primary-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredShops.map(shop => (
                            <a href={`/shop/${shop.id}`} key={shop.id} className="group block bg-gray-50 hover:bg-white border invalid:border-gray-200 hover:border-primary-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg text-center">
                                <div className="w-20 h-20 mx-auto mb-4 relative">
                                    <img
                                        src={shop.logo_url ? (shop.logo_url.startsWith('http') ? shop.logo_url : `${shop.logo_url}`) : 'https://via.placeholder.com/150'}
                                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-110 transition-transform"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary-600">{shop.name}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">{shop.location}</p>
                                <span className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
                                    Visit Shop
                                </span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* ABOUT WEBSITE SECTION */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <div className="inline-block bg-primary-100 text-primary-700 font-bold px-4 py-2 rounded-full text-sm">
                        About Galkacyo Market
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        Revolutionizing Digital Commerce in <span className="text-primary-600">Mudug</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Galkacyo Digital Market is the region's premier online platform designed to bridge the gap between local sellers and buyers.
                        We empower small businesses by providing them with a digital storefront while offering customers a seamless shopping experience
                        from the comfort of their homes.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Whether you are looking for the latest electronics, fashion, or home essentials, our platform ensures quality, trust, and speed.
                    </p>
                    <button onClick={() => navigate('/register')} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
                        Join Our Community
                    </button>
                </div>
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-secondary-500/20 rounded-3xl transform rotate-3"></div>
                    <img
                        src="/community-marketplace.jpg"
                        alt="Galkacyo Digital Market Community"
                        className="relative rounded-3xl shadow-xl w-full object-cover h-80 md:h-[400px]"
                    />
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                <div className="bg-blue-50 p-6 rounded-2xl flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <FaShieldAlt className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Secure Payments</h3>
                        <p className="text-sm text-gray-600">Your transactions are 100% safe and encrypted.</p>
                    </div>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                        <FaTruck className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Local Delivery</h3>
                        <p className="text-sm text-gray-600">Fast delivery from shops right in your neighborhood.</p>
                    </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                        <FaHeadset className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">24/7 Support</h3>
                        <p className="text-sm text-gray-600">We are here to help you anytime, anywhere.</p>
                    </div>
                </div>
            </section>

            {/* MAIN PRODUCTS GRID - with Search/Filter integration */}
            <section id="products-section" className="scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FaFire className="text-orange-500 animate-pulse" /> Trending Deals
                        </h2>
                        <p className="text-gray-500 mt-1">Found {filteredProducts.length} amazing items for you</p>
                    </div>

                    {/* Integrated Search Bar Component would ideally be here or above. 
                        Since we have SearchBar component, let's render it here or stick to top?
                        The design usually puts Search near Hero. 
                        Let's place SearchBar nicely _above_ this section or just below Hero.
                        For now, I will render SearchBar below Hero in the layout flow or keep it here? 
                        The previous layout had it under Hero. I'll put it just above this section or inside it.
                    */}
                </div>

                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => (
                            <div key={product.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <FaShoppingBag className="text-6xl text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-800">No products found</h3>
                        <p className="text-gray-500 mb-6">Try different keywords or filters</p>
                        <button onClick={() => setFilters({ search: '', category: '', condition: '', sort: '' })} className="text-primary-600 font-semibold hover:underline">
                            Clear all filters
                        </button>
                    </div>
                )}
            </section>

            {/* Footer CTA */}
            <section className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to scale your business?</h2>
                    <p className="text-gray-400 text-lg">Create your shop today and reach thousands of customers in Galkacyo instantly.</p>
                    <button onClick={() => navigate('/seller/dashboard')} className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-600/30">
                        Start Selling for Free
                    </button>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </section>

        </div>
    );
};

export default Home;
