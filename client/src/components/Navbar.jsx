import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaStore, FaShoppingBag, FaSignOutAlt, FaCog, FaHeart, FaBell, FaHome } from 'react-icons/fa';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/notifications/unread', config);
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/notifications', config);
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    const handleNotificationClick = () => {
        if (!showNotifications) {
            fetchNotifications();
        }
        setShowNotifications(!showNotifications);
        setShowDropdown(false);
    };

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/notifications/${id}/read`, {}, config);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white shadow-medium'
            : 'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className={`text-2xl font-bold transition-colors flex items-center gap-3 ${scrolled ? 'text-primary-600' : 'text-white'
                            }`}
                    >
                        <img src="/logo.png" alt="Galkacyo Market" className="h-12 w-auto" />
                        <span className="hidden sm:inline">Galkacyo Market</span>
                        <span className="sm:hidden">GM</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4 md:space-x-6">

                        {/* Home Link (Always Visible) */}
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${scrolled
                                ? 'text-primary-600 hover:bg-primary-50'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            <FaHome />
                            <span className="hidden md:inline">Home</span>
                        </Link>

                        {user ? (
                            <>
                                {/* Favorites Link */}
                                <Link
                                    to="/favorites"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${scrolled
                                        ? 'text-primary-600 hover:bg-primary-50'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <FaHeart />
                                    <span className="hidden md:inline">Favorites</span>
                                </Link>

                                {/* Seller Dashboard Link */}
                                {(user.role === 'seller' || user.role === 'shop_owner' || user.role === 'admin') && (
                                    <Link
                                        to="/seller/dashboard"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${scrolled
                                            ? 'text-primary-600 hover:bg-primary-50'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <FaStore />
                                        <span className="hidden md:inline">My Shop</span>
                                    </Link>
                                )}

                                {/* Admin Dashboard Link */}
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${scrolled
                                            ? 'text-primary-600 hover:bg-primary-50'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <FaCog />
                                        <span className="hidden md:inline">Admin</span>
                                    </Link>
                                )}

                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={handleNotificationClick}
                                        className={`relative p-2 rounded-lg transition-all hover:scale-105 ${scrolled
                                            ? 'text-primary-600 hover:bg-primary-50'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <FaBell className="text-xl" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-hard py-2 animate-scale-in z-50 max-h-96 overflow-y-auto">
                                            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                                <h3 className="font-bold text-gray-800">Notifications</h3>
                                                <button onClick={fetchUnreadCount} className="text-xs text-primary-600 hover:underline">Refresh</button>
                                            </div>
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                                            ) : (
                                                <div className="divide-y divide-gray-100">
                                                    {notifications.map(notification => (
                                                        <div
                                                            key={notification.id}
                                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
                                                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                                                        >
                                                            <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                                                            <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* User Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${scrolled
                                            ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold overflow-hidden border border-white/20">
                                            {user.profile_image ? (
                                                <img
                                                    src={`${user.profile_image}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="hidden md:inline font-medium">{user.name}</span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-hard py-2 animate-scale-in">
                                            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                                                    {user.profile_image ? (
                                                        <img
                                                            src={`${user.profile_image}`}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                    <p className="text-[10px] uppercase font-bold text-primary-500 mt-0.5">{user.role}</p>
                                                </div>
                                            </div>

                                            <Link
                                                to="/profile"
                                                onClick={() => setShowDropdown(false)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors"
                                            >
                                                <FaUser /> My Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition-colors"
                                            >
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${scrolled
                                        ? 'text-primary-600 hover:bg-primary-50'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <FaStore />
                                    <span className="hidden sm:inline">Sell</span>
                                </Link>
                                <Link
                                    to="/login"
                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 shadow-soft ${scrolled
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-glow'
                                        : 'bg-white text-primary-600 hover:shadow-medium'
                                        }`}
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
