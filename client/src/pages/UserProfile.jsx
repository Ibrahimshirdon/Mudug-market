import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSpinner } from 'react-icons/fa';

const UserProfile = () => {
    const { user, login } = useContext(AuthContext); // Re-using login to update context user? Ideally need update function
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
            if (user.profile_image) {
                setPreview(`${user.profile_image}`);
            }
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        if (image) {
            formData.append('profile_image', image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put('/api/users/profile', formData, config);

            // Update local storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.name = data.name;
            userInfo.phone = data.phone;
            userInfo.profile_image = data.profile_image;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // Force reload to update context (or better: add update function to context)
            window.location.reload();

            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-hard animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 mb-4">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-4xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label htmlFor="profile-image" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-primary-600 cursor-pointer hover:bg-gray-50 transition-colors">
                            <FaCamera />
                        </label>
                        <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    <p className="text-sm text-gray-500">Click camera icon to change photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email (Cannot be changed)</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold shadow-soft hover:shadow-glow transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {loading && <FaSpinner className="animate-spin" />}
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
