import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { FaEnvelope, FaLock, FaSpinner, FaUser } from 'react-icons/fa';

const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userData = await login(email, password);
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (userData.role === 'seller') {
                navigate('/seller/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            setError('Invalid email/username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-md w-full relative z-10">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-in">
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 p-10 text-white text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                                <FaUser className="text-4xl" />
                            </div>
                            <h2 className="text-4xl font-black mb-2 text-shadow">Welcome Back!</h2>
                            <p className="opacity-90 text-lg">Login to continue shopping</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <ErrorMessage message={error} type="inline" />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">Email Address or Username</label>
                                <div className="relative group">
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-modern w-full pl-12 pr-4 py-3.5 text-gray-700 font-medium"
                                        placeholder="your@email.com or Your Name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-modern w-full pl-12 pr-4 py-3.5 text-gray-700 font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="text-right mt-2">
                                    <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-bold hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg hover:scale-105"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2 text-xl" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
