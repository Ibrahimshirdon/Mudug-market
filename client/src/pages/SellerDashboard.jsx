import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShopPolicies from '../components/ShopPolicies';
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

const SellerDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Form state for new shop
    const [newShop, setNewShop] = useState({
        name: '', description: '', location: '', phone: '', license: '', logo: null
    });
    const [agreedToPolicies, setAgreedToPolicies] = useState(false);

    const [categories, setCategories] = useState([]);

    // Form state for new product
    const [newProduct, setNewProduct] = useState({
        name: '', brand: '', model: '', description: '', price: '', discount_price: '', stock: '', condition: 'new', category_id: 1, delivery_info: '', delivery_fee: '', is_black_friday: false, images: []
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditShop, setShowEditShop] = useState(false);
    const [editShopData, setEditShopData] = useState({
        name: '', description: '', location: '', phone: '', license: '', logo: null
    });

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                // Get Shop
                try {
                    const { data: shopData } = await axios.get('/api/shops/my-shop', config);
                    setShop(shopData);

                    if (shopData && shopData.status === 'approved') {
                        // Get Products only if shop is approved
                        const { data: prodData } = await axios.get('/api/products');
                        setProducts(prodData.filter(p => {
                            // Handle populated shop_id (it's an object now)
                            const pShopId = typeof p.shop_id === 'object' ? (p.shop_id.id || p.shop_id._id) : p.shop_id;
                            return String(pShopId) === String(shopData.id);
                        }));

                        // Get Categories
                        const { data: catData } = await axios.get('/api/categories');
                        setCategories(catData);
                    }
                } catch (err) {
                    // No shop found
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, authLoading, navigate]);

    const handleCreateShop = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const formData = new FormData();
            formData.append('name', newShop.name);
            formData.append('description', newShop.description);
            formData.append('location', newShop.location);
            formData.append('phone', newShop.phone);
            formData.append('license', newShop.license);
            if (newShop.logo) {
                formData.append('logo', newShop.logo);
            }

            const { data } = await axios.post('/api/shops', formData, config);
            setShop(data);
            alert('Shop created! Please wait for admin approval.');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error creating shop');
        }
    };

    const handleUpdateShop = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const formData = new FormData();
            formData.append('name', editShopData.name);
            formData.append('description', editShopData.description);
            formData.append('location', editShopData.location);
            formData.append('phone', editShopData.phone);
            formData.append('license', editShopData.license);
            if (editShopData.logo) {
                formData.append('logo', editShopData.logo);
            }

            const { data } = await axios.put('/api/shops/my-shop', formData, config);
            setShop(data);
            setShowEditShop(false);
            alert('Shop updated successfully!');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error updating shop');
        }
    };

    const openEditShop = () => {
        setEditShopData({
            name: shop.name,
            description: shop.description,
            location: shop.location,
            phone: shop.phone,
            license: shop.license || '',
            logo: null
        });
        setShowEditShop(true);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imagePreviews.length + existingImages.length > 5) {
            alert('Maximum 5 images allowed per product');
            return;
        }

        const newImages = [...newProduct.images, ...files];
        setNewProduct({ ...newProduct, images: newImages });

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImagePreview = (index) => {
        const newImages = newProduct.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, images: newImages });
        setImagePreviews(newPreviews);
    };

    const removeExistingImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`/api/products/${editingProduct.id}/images/${imageId}`, config);
            setExistingImages(existingImages.filter(img => img.id !== imageId));
            alert('Image deleted successfully');
        } catch (error) {
            console.error(error);
            alert('Error deleting image');
        }
    };



    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (Number(newProduct.discount_price) >= Number(newProduct.price)) {
            alert('Discount price must be less than the original price.');
            return;
        }

        if (!editingProduct && newProduct.images.length === 0) {
            alert('Please add at least one product image');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const formData = new FormData();
            formData.append('shop_id', shop.id);
            formData.append('name', newProduct.name);
            formData.append('brand', newProduct.brand);
            formData.append('model', newProduct.model);
            formData.append('description', newProduct.description);
            formData.append('price', newProduct.price);
            formData.append('discount_price', newProduct.discount_price || 0);
            formData.append('stock', newProduct.stock || 0);
            formData.append('condition', newProduct.condition);
            formData.append('category_id', newProduct.category_id);
            formData.append('delivery_info', newProduct.delivery_info);
            formData.append('delivery_fee', newProduct.delivery_fee || 0);
            formData.append('is_black_friday', newProduct.is_black_friday ? 1 : 0);

            // Append multiple images
            newProduct.images.forEach(image => {
                formData.append('images', image);
            });

            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.id}`, formData, config);
                alert('Product updated!');
            } else {
                await axios.post('/api/products', formData, config);
                alert('Product added!');
            }

            // Refresh products
            const { data: prodData } = await axios.get('/api/products');
            setProducts(prodData.filter(p => p.shop_id === shop.id));
            setNewProduct({ name: '', brand: '', model: '', description: '', price: '', discount_price: '', stock: '', condition: 'new', category_id: 1, delivery_info: '', delivery_fee: '', is_black_friday: false, images: [] });
            setImagePreviews([]);
            setExistingImages([]);
            setEditingProduct(null);
            setShowAddProduct(false);
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            brand: product.brand || '',
            model: product.model || '',
            description: product.description,
            price: product.price,
            discount_price: product.discount_price || '',
            stock: product.stock || '',
            condition: product.condition || 'new',
            category_id: product.category_id || 1,
            delivery_info: product.delivery_info || '',
            delivery_fee: product.delivery_fee || '',
            is_black_friday: product.is_black_friday,
            images: [] // New images to upload
        });
        setExistingImages(product.images || []);
        setImagePreviews([]);
        setShowAddProduct(true);
        window.scrollTo(0, 0);
    };

    if (authLoading || loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!shop) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Shop</h2>

                <ShopPolicies />

                <form onSubmit={handleCreateShop} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                        <input required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={newShop.name} onChange={e => setNewShop({ ...newShop, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={newShop.description} onChange={e => setNewShop({ ...newShop, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={newShop.location} onChange={e => setNewShop({ ...newShop, location: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                            <input required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={newShop.phone} onChange={e => setNewShop({ ...newShop, phone: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business License</label>
                        <input required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            placeholder="License Number or URL"
                            value={newShop.license} onChange={e => setNewShop({ ...newShop, license: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Logo (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            onChange={e => setNewShop({ ...newShop, logo: e.target.files[0] })}
                        />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToPolicies}
                                onChange={(e) => setAgreedToPolicies(e.target.checked)}
                                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                required
                            />
                            <span className="text-sm text-gray-700">
                                I have read and agree to the <strong>platform policies</strong> and understand the <strong>$10/month subscription fee</strong>.
                            </span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={!agreedToPolicies}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Create Shop
                    </button>
                </form>
            </div>
        );
    }

    if (shop.status === 'pending') {
        return (
            <div className="max-w-3xl mx-auto mt-10 space-y-6">
                <div className="p-8 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
                    <div className="text-yellow-600 text-5xl mb-4">⏳</div>
                    <h2 className="text-2xl font-bold text-yellow-800 mb-2">Waiting for Approval</h2>
                    <p className="text-yellow-700">
                        Your shop <strong>{shop.name}</strong> has been created successfully and is currently under review by the admin.
                        <br />You will be able to add products once approved.
                    </p>
                </div>

                <div className="p-8 bg-blue-50 rounded-xl border-2 border-blue-300">
                    <div className="text-center mb-6">
                        <div className="text-blue-600 text-4xl mb-3">💳</div>
                        <h3 className="text-2xl font-bold text-blue-900 mb-2">Complete Your Payment</h3>
                        <p className="text-blue-700 mb-4">Monthly subscription fee: <span className="text-3xl font-bold">$10</span></p>
                    </div>

                    <div className="bg-white rounded-lg p-6 space-y-4">
                        <h4 className="font-bold text-gray-800 text-lg mb-4">📞 Contact Us to Complete Payment & Activate Your Shop</h4>

                        <div className="space-y-3">
                            <a
                                href="https://wa.me/252666251592"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                            >
                                <FaWhatsapp className="text-2xl text-green-600" />
                                <div>
                                    <p className="font-semibold text-gray-800">WhatsApp</p>
                                    <p className="text-sm text-gray-600">+252 66 625 1592</p>
                                </div>
                            </a>

                            <a
                                href="tel:+252666251592"
                                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                            >
                                <FaPhone className="text-2xl text-blue-600" />
                                <div>
                                    <p className="font-semibold text-gray-800">Phone</p>
                                    <p className="text-sm text-gray-600">+252 66 625 1592</p>
                                </div>
                            </a>

                            <a
                                href="mailto:ibra090shirdon@gmail.com"
                                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                            >
                                <FaEnvelope className="text-2xl text-purple-600" />
                                <div>
                                    <p className="font-semibold text-gray-800">Email</p>
                                    <p className="text-sm text-gray-600">ibra090shirdon@gmail.com</p>
                                </div>
                            </a>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700">
                                <strong>Next Steps:</strong>
                            </p>
                            <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
                                <li>Contact us via WhatsApp, phone, or email</li>
                                <li>Complete the $10 monthly payment</li>
                                <li>We'll approve your shop within 24 hours</li>
                                <li>Start adding products and selling!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (shop.status === 'rejected') {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-red-50 rounded-xl border border-red-200 text-center">
                <div className="text-red-600 text-5xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-red-800 mb-2">Shop Rejected</h2>
                <p className="text-red-700">
                    Your shop application was rejected. Please contact support.
                </p>
            </div>
        );
    }


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <div className="flex gap-4 items-center">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                        Shop Status: <span className="font-bold uppercase">{shop.status}</span>
                    </div>
                    <button
                        onClick={() => {
                            setShowAddProduct(!showAddProduct);
                            setEditingProduct(null);
                            setNewProduct({ name: '', brand: '', model: '', description: '', price: '', discount_price: '', stock: '', condition: 'new', category_id: 1, delivery_info: '', delivery_fee: '', is_black_friday: false, images: [] });
                            setImagePreviews([]);
                            setExistingImages([]);
                        }}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                        {showAddProduct ? 'Cancel' : 'Add New Product'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <img
                            src={shop.logo_url ? (shop.logo_url.startsWith('http') ? shop.logo_url : `${shop.logo_url}`) : 'https://via.placeholder.com/100'}
                            alt={shop.name}
                            className="w-24 h-24 rounded-full object-cover mr-6 border-2 border-gray-100"
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{shop.name}</h2>
                            <p className="text-gray-600 mt-1">{shop.description}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                <span>📍 {shop.location}</span>
                                <span>📞 {shop.phone}</span>
                                {shop.license && <span>📜 Lic: {shop.license}</span>}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={openEditShop}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Edit Shop
                    </button>
                </div>

                {/* Edit Shop Modal */}
                {showEditShop && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Shop Details</h2>
                            <form onSubmit={handleUpdateShop}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Shop Name</label>
                                    <input
                                        type="text"
                                        value={editShopData.name}
                                        onChange={(e) => setEditShopData({ ...editShopData, name: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        value={editShopData.description}
                                        onChange={(e) => setEditShopData({ ...editShopData, description: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={editShopData.location}
                                        onChange={(e) => setEditShopData({ ...editShopData, location: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                    <input
                                        type="text"
                                        value={editShopData.phone}
                                        onChange={(e) => setEditShopData({ ...editShopData, phone: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">License Number</label>
                                    <input
                                        type="text"
                                        value={editShopData.license}
                                        onChange={(e) => setEditShopData({ ...editShopData, license: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">New Logo (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setEditShopData({ ...editShopData, logo: e.target.files[0] })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditShop(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {showAddProduct && (
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />

                                <div className="grid grid-cols-2 gap-2">
                                    <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Brand" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                                    <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Model" value={newProduct.model} onChange={e => setNewProduct({ ...newProduct, model: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Price" type="number" value={newProduct.price} onChange={e => {
                                        const newPrice = e.target.value;
                                        const updates = { ...newProduct, price: newPrice };
                                        if (newProduct.is_black_friday) {
                                            updates.discount_price = newPrice * 0.5;
                                        }
                                        setNewProduct(updates);
                                    }} />
                                    <input
                                        className={`w-full p-2 border border-gray-200 rounded-lg ${newProduct.is_black_friday ? 'bg-gray-100' : ''}`}
                                        placeholder="Discount Price"
                                        type="number"
                                        value={newProduct.discount_price}
                                        onChange={e => setNewProduct({ ...newProduct, discount_price: e.target.value })}
                                        disabled={newProduct.is_black_friday}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                    <select
                                        className="w-full p-2 border border-gray-200 rounded-lg"
                                        value={newProduct.category_id}
                                        onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <select className="w-full p-2 border border-gray-200 rounded-lg" value={newProduct.condition} onChange={e => setNewProduct({ ...newProduct, condition: e.target.value })}>
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                </select>

                                <div className="grid grid-cols-2 gap-2">
                                    <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Delivery Info" value={newProduct.delivery_info} onChange={e => setNewProduct({ ...newProduct, delivery_info: e.target.value })} />
                                    <input className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Delivery Fee ($)" type="number" value={newProduct.delivery_fee} onChange={e => setNewProduct({ ...newProduct, delivery_fee: e.target.value })} />
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" id="bf" className="mr-2 rounded text-primary-600 focus:ring-primary-500" checked={newProduct.is_black_friday} onChange={e => {
                                        const isChecked = e.target.checked;
                                        const updates = { ...newProduct, is_black_friday: isChecked };
                                        if (isChecked) {
                                            updates.discount_price = newProduct.price * 0.5;
                                        } else {
                                            updates.discount_price = 0;
                                        }
                                        setNewProduct(updates);
                                    }} />
                                    <label htmlFor="bf" className="text-sm font-medium text-gray-700">Black Friday Deal</label>
                                </div>
                                <textarea className="w-full p-2 border border-gray-200 rounded-lg" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Images (Max 5) {editingProduct && '- Add more or delete existing'}
                                    </label>

                                    {/* Existing Images */}
                                    {existingImages.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-600 mb-2">Existing Images:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {existingImages.map((img, index) => (
                                                    <div key={img.id} className="relative group">
                                                        <img
                                                            src={img.image_url.startsWith('http') ? img.image_url : `${img.image_url}`}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(img.id)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-600 mb-2">New Images to Upload:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border-2 border-primary-300"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImagePreview(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    {(imagePreviews.length + existingImages.length) < 5 && (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="w-full p-2 border border-gray-200 rounded-lg cursor-pointer"
                                                onChange={handleImageChange}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {imagePreviews.length + existingImages.length} / 5 images selected
                                            </p>
                                        </div>
                                    )}

                                    {(imagePreviews.length + existingImages.length) >= 5 && (
                                        <p className="text-sm text-orange-600 font-medium">
                                            Maximum 5 images reached. Delete some to add more.
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddProduct(false)}
                                        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className={showAddProduct ? "lg:col-span-2" : "lg:col-span-3"}>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Products</h2>
                    <div className="space-y-4">
                        {products.map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    {p.image_url && (
                                        <img
                                            src={p.image_url.startsWith('http') ? p.image_url : `${p.image_url}`}
                                            alt={p.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{p.name}</h3>
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{p.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-primary-600 text-lg">${p.price}</span>
                                    <button
                                        onClick={() => handleEditProduct(p)}
                                        className="text-gray-500 hover:text-primary-600 transition-colors"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this product?')) {
                                                try {
                                                    const config = {
                                                        headers: { Authorization: `Bearer ${user.token}` }
                                                    };
                                                    await axios.delete(`/api/products/${p.id}`, config);
                                                    setProducts(products.filter(prod => prod.id !== p.id));
                                                    alert('Product deleted');
                                                } catch (error) {
                                                    console.error(error);
                                                    alert('Error deleting product');
                                                }
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No products yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
