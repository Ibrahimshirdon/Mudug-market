import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

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
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                        <p className="opacity-90">Login to continue shopping</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="text-right mt-1">
                                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary font-semibold hover:underline">
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
