import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportPopup from './components/SupportPopup';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductDetails from './pages/ProductDetails';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ShopProfile from './pages/ShopProfile';
import Favorites from './pages/Favorites';
import UserProfile from './pages/UserProfile';
import VerifyOTP from './pages/VerifyOTP';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Help from './pages/Help';

function AppContent() {
    const location = useLocation();

    // Only show footer on home page
    const showFooter = location.pathname === '/';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main key={location.pathname} className="container mx-auto px-4 py-8 flex-grow animate-fadeIn">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/shop/:id" element={<ShopProfile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/seller/dashboard" element={<SellerDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<Help />} />

                    {/* Catch all invalid routes and redirections */}
                    <Route path="/dashboard" element={<Navigate to="/seller/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            {showFooter && <Footer />}
            <SupportPopup />
        </div>
    );
}

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Toaster position="top-center" reverseOrder={false} />
                    <AppContent />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
