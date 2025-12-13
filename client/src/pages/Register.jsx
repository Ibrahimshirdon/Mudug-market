import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserTag, FaSpinner } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'buyer'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData.name, formData.email, formData.password, formData.phone, formData.role);
            navigate('/');
        } catch (error) {
            setError('Registration failed. Email might already be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8">
            <div className="max-w-2xl w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-2">Join Galkacyo Market</h2>
                        <p className="opacity-90">Create your account and start trading</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Ahmed Mohamed"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
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
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="252612345678"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-3">I want to:</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'buyer' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="buyer"
                                            checked={formData.role === 'buyer'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">Buy Products</p>
                                            <p className="text-sm text-gray-600">Browse and purchase items</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'seller' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="seller"
                                            checked={formData.role === 'seller'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">Sell Products</p>
                                            <p className="text-sm text-gray-600">Open a shop and sell items</p>
                                        </div>
                                    </label>
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
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-semibold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
