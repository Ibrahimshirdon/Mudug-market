import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

import { AuthProvider } from './context/AuthContext';

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop/:id" element={<ShopProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
