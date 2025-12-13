import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag, FaWhatsapp, FaHeart, FaEye } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { user } = useContext(AuthContext);

    if (!product) return null;

    const [isLiked, setIsLiked] = useState(false);
    const whatsappLink = `https://wa.me/${product.shop_phone}?text=Asc, I want this product: ${product.name}`;

    useEffect(() => {
        const checkFavorite = async () => {
            if (user) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` }
                    };
                    const { data } = await axios.get(`/api/favorites/check/${product.id}`, config);
                    setIsLiked(data.isFavorite);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        checkFavorite();
    }, [user, product.id]);

    return (
        <div className="group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-hard transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
            {/* Product Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                    src={
                        product.images && product.images.length > 0
                            ? (product.images[0].image_url.startsWith('http') ? product.images[0].image_url : `${product.images[0].image_url}`)
                            : product.image_url
                                ? (product.image_url.startsWith('http') ? product.image_url : `${product.image_url}`)
                                : 'https://via.placeholder.com/400x300?text=No+Image'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Image Count Indicator */}
                {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        {product.images.length}
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                    {product.condition === 'new' && (
                        <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-soft">
                            ✨ NEW
                        </span>
                    )}
                    {!!product.is_black_friday && (
                        <span className="ml-2 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-soft border border-gray-700">
                            🖤 BLACK FRIDAY
                        </span>
                    )}
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!user) {
                                alert('Please login to add favorites');
                                return;
                            }
                            try {
                                const config = {
                                    headers: { Authorization: `Bearer ${user.token}` }
                                };
                                const { data } = await axios.post('/api/favorites/toggle', { productId: product.id }, config);
                                setIsLiked(data.isFavorite);
                            } catch (error) {
                                console.error(error);
                                alert('Error updating favorite. Please try again.');
                            }
                        }}
                        className={`ml-auto p-2 rounded-full backdrop-blur-sm transition-all ${isLiked
                            ? 'bg-red-500 text-white scale-110'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                            }`}
                    >
                        <FaHeart className={isLiked ? 'animate-pulse' : ''} />
                    </button>
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 text-sm">
                            <FaEye />
                            <span>Quick View</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <FaTag className="text-primary-500" />
                        <span className="font-medium">{product.brand}</span>
                        {product.model && <span className="text-gray-400">• {product.model}</span>}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <FaMapMarkerAlt className="text-primary-500" />
                        <span>{product.shop_location || 'Galkacyo'}</span>
                    </div>
                </div>

                {/* Price and Actions */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <div className="flex flex-col">
                                {product.discount_price && Number(product.discount_price) > 0 ? (
                                    <>
                                        <span className="text-xs text-gray-400 line-through">${product.price}</span>
                                        <span className="text-2xl font-bold text-red-600">
                                            ${product.discount_price}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Stock</p>
                            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={`/product/${product.id}`}
                            className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium text-center hover:scale-105"
                        >
                            Details
                        </Link>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-glow transition-all flex items-center justify-center gap-2 font-medium hover:scale-105"
                        >
                            <FaWhatsapp className="text-lg" /> Buy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
