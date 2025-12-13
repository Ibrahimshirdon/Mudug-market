import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaUsers, FaClipboardList, FaChartLine, FaHistory, FaExternalLinkAlt, FaCheck, FaTimes, FaTrash, FaBan, FaUnlock, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [users, setUsers] = useState([]);
    const [pendingShops, setPendingShops] = useState([]);
    const [allShops, setAllShops] = useState([]);
    const [reports, setReports] = useState([]);
    const [logs, setLogs] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLogUser, setSelectedLogUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const [analyticsRes, usersRes, pendingShopsRes, allShopsRes, reportsRes, logsRes, transactionsRes] = await Promise.all([
                    axios.get('/api/admin/analytics', config),
                    axios.get('/api/admin/users', config),
                    axios.get('/api/shops?status=pending', config),
                    axios.get('/api/shops', config),
                    axios.get('/api/reports', config),
                    axios.get('/api/admin/logs', config),
                    axios.get('/api/admin/transactions', config)
                ]);

                setAnalytics(analyticsRes.data);
                setUsers(usersRes.data);
                setPendingShops(pendingShopsRes.data);
                setAllShops(allShopsRes.data);
                setReports(reportsRes.data);
                setLogs(logsRes.data);
                setTransactions(transactionsRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') fetchData();
    }, [user, authLoading, navigate]);

    // --- Action Handlers ---

    const handleApproveShop = async (shopId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/shops/${shopId}/status`, { status: 'approved' }, config);
            setPendingShops(pendingShops.filter(s => s.id !== shopId));
            setAllShops(allShops.map(s => s.id === shopId ? { ...s, status: 'approved' } : s));
            alert('Shop approved successfully');
        } catch (error) {
            alert('Error approving shop');
        }
    };

    const handleRejectShop = async (shopId) => {
        if (!window.confirm('Are you sure you want to reject this shop?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/shops/${shopId}/status`, { status: 'rejected' }, config);
            setPendingShops(pendingShops.filter(s => s.id !== shopId));
            setAllShops(allShops.map(s => s.id === shopId ? { ...s, status: 'rejected' } : s));
            alert('Shop rejected');
        } catch (error) {
            alert('Error rejecting shop');
        }
    };

    const handleDeactivateShop = async (shopId) => {
        if (!window.confirm('Are you sure you want to deactivate this shop?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/admin/shops/${shopId}/deactivate`, {}, config);
            setAllShops(allShops.map(s => s.id === shopId ? { ...s, status: 'deactivated' } : s));
            alert('Shop deactivated successfully');
        } catch (error) {
            alert('Error deactivating shop');
        }
    };

    const handleActivateShop = async (shopId) => {
        if (!window.confirm('Are you sure you want to activate this shop?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/admin/shops/${shopId}/activate`, {}, config);
            setAllShops(allShops.map(s => s.id === shopId ? { ...s, status: 'approved' } : s));
            alert('Shop activated successfully');
        } catch (error) {
            alert('Error activating shop');
        }
    };

    const handleReportStatus = async (reportId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/reports/${reportId}/status`, { status }, config);
            setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
            alert(`Report marked as ${status}`);
        } catch (error) {
            alert('Error updating report status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/admin/users/${userId}`, config);
            setUsers(users.filter(u => u.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const handleAddFunds = async (shopId) => {
        const amount = prompt("Enter amount to add (e.g., 10 for $10 deposit, -10 for withdrawal):");
        if (amount) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                await axios.post(`/api/admin/shops/${shopId}/balance`, { amount }, config);
                alert('Balance updated successfully');
                // Refresh Data
                const shopsRes = await axios.get('/api/shops', config);
                const transRes = await axios.get('/api/admin/transactions', config);
                setAllShops(shopsRes.data);
                setTransactions(transRes.data);
            } catch (error) {
                console.error(error);
                alert('Failed to update balance');
            }
        }
    };

    // --- Render Helpers ---

    if (loading || authLoading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredShops = allShops.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar / Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                        <FaChartLine /> Admin
                    </h1>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaChartLine /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('shops')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'shops' ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaStore /> Shops Management
                    </button>
                    <button
                        onClick={() => setActiveTab('finance')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'finance' ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaMoneyBillWave /> Finances
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaClipboardList /> Reports Center
                        {reports.filter(r => r.status === 'pending').length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {reports.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaUsers /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logs' ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaHistory /> Activity Logs
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-8">
                {/* Header for Mobile */}
                <div className="md:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="overview">Overview</option>
                        <option value="shops">Shops</option>
                        <option value="finance">Finances</option>
                        <option value="reports">Reports</option>
                        <option value="users">Users</option>
                        <option value="logs">Logs</option>
                    </select>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaUsers className="text-6xl text-blue-500" />
                                </div>
                                <h3 className="text-gray-500 font-medium">Total Users</h3>
                                <p className="text-4xl font-bold text-gray-800">{analytics?.totalUsers || 0}</p>
                                <div className="text-xs text-green-500 font-semibold bg-green-50 px-2 py-1 rounded w-max">Active Community</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaStore className="text-6xl text-purple-500" />
                                </div>
                                <h3 className="text-gray-500 font-medium">Total Shops</h3>
                                <p className="text-4xl font-bold text-gray-800">{analytics?.totalShops || 0}</p>
                                <div className="text-xs text-purple-500 font-semibold bg-purple-50 px-2 py-1 rounded w-max">Marketplace Growth</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaClipboardList className="text-6xl text-orange-500" />
                                </div>
                                <h3 className="text-gray-500 font-medium">Total Products</h3>
                                <p className="text-4xl font-bold text-gray-800">{analytics?.totalProducts || 0}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaExternalLinkAlt className="text-6xl text-green-500" />
                                </div>
                                <h3 className="text-gray-500 font-medium">Link Clicks</h3>
                                <p className="text-4xl font-bold text-gray-800">{analytics?.totalClicks || 0}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-gray-800">Pending Shop Approvals</h3>
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">{pendingShops.length} Pending</span>
                                </div>
                                <div className="p-6">
                                    {pendingShops.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No pending approvals.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingShops.slice(0, 3).map(shop => (
                                                <div key={shop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        {shop.logo_url ? <img src={shop.logo_url} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-gray-200 rounded-full"></div>}
                                                        <div>
                                                            <p className="font-bold text-gray-800">{shop.name}</p>
                                                            <p className="text-xs text-gray-500">{shop.owner_name} • {shop.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleApproveShop(shop.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><FaCheck /></button>
                                                        <button onClick={() => handleRejectShop(shop.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><FaTimes /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {pendingShops.length > 3 && (
                                                <button onClick={() => setActiveTab('shops')} className="w-full py-2 text-center text-primary-600 text-sm font-medium hover:bg-gray-50 rounded-lg">View All Pending</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-gray-800">Recent Reports</h3>
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">{reports.filter(r => r.status === 'pending').length} New</span>
                                </div>
                                <div className="p-6">
                                    {reports.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No reports.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {reports.slice(0, 3).map(report => (
                                                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{report.shop_name}</p>
                                                        <p className="text-xs text-red-500 font-medium">{report.reason}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-200'
                                                        }`}>{report.status}</span>
                                                </div>
                                            ))}
                                            <button onClick={() => setActiveTab('reports')} className="w-full py-2 text-center text-primary-600 text-sm font-medium hover:bg-gray-50 rounded-lg">View All Reports</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'shops' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Shops Management</h2>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search shops..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <FaStore className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Shop Detail</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Balance</th>
                                        <th className="px-6 py-4 font-semibold">Strikes</th>
                                        <th className="px-6 py-4 font-semibold">Link</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredShops.map(shop => (
                                        <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={shop.logo_url?.startsWith('http') ? shop.logo_url : `${shop.logo_url}` || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
                                                    <div>
                                                        <div className="font-bold text-gray-900">{shop.name}</div>
                                                        <div className="text-xs text-gray-500">{shop.owner_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${shop.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    shop.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        shop.status === 'deactivated' ? 'bg-gray-100 text-gray-600' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {shop.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-700 font-medium">
                                                ${Number(shop.balance || 0).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {shop.strikes > 0 ? (
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold text-xs">{shop.strikes}</span>
                                                ) : <span className="text-gray-400">0</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {shop.status === 'approved' ? (
                                                    <a href={`/shop/${shop.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium">
                                                        Visit Shop <FaExternalLinkAlt className="text-xs" />
                                                    </a>
                                                ) : <span className="text-gray-400 text-sm">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                {shop.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleApproveShop(shop.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Approve"><FaCheck /></button>
                                                        <button onClick={() => handleRejectShop(shop.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Reject"><FaTimes /></button>
                                                    </>
                                                )}
                                                {shop.status === 'approved' && (
                                                    <>
                                                        <button onClick={() => handleAddFunds(shop.id)} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" title="Add Funds"><FaMoneyBillWave /></button>
                                                        <button onClick={() => handleDeactivateShop(shop.id)} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200" title="Deactivate"><FaBan /></button>
                                                    </>
                                                )}
                                                {shop.status === 'deactivated' && (
                                                    <>
                                                        <button onClick={() => handleAddFunds(shop.id)} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" title="Add Funds"><FaMoneyBillWave /></button>
                                                        <button onClick={() => handleActivateShop(shop.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Activate"><FaUnlock /></button>
                                                    </>
                                                )}
                                                <button onClick={() => handleDeleteShop(shop.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" title="Delete"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-800">Financial Ledger</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Shop</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Description</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.length > 0 ? transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-500">#{t.id}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                    ${t.type === 'RENT' ? 'bg-blue-100 text-blue-700' :
                                                        t.type === 'FINE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-medium text-gray-800">
                                                ${Number(t.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{t.shop_name}</td>
                                            <td className="px-6 py-4 text-gray-600">{t.description}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{new Date(t.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No transactions recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-800">Reports Center</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Report Details</th>
                                        <th className="px-6 py-4 font-semibold">Reason</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports.map(report => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{report.shop_name}</p>
                                                <p className="text-sm text-gray-500">Reported by: {report.reporter_name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-red-600 block mb-1">{report.reason}</span>
                                                <p className="text-sm text-gray-600 italic">"{report.description}"</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-200'
                                                    }`}>{report.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {report.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleReportStatus(report.id, 'resolved')} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">Resolve</button>
                                                        <button onClick={() => handleReportStatus(report.id, 'dismissed')} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Dismiss</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {reports.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-gray-500">No reports found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">User Directory</h2>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">User Profile</th>
                                        <th className="px-6 py-4 font-semibold">Name</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Joined</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold overflow-hidden border border-gray-200 shadow-sm">
                                                    {user.profile_image ? (
                                                        <img
                                                            src={`${user.profile_image}`}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerText = user.name.charAt(0).toUpperCase(); }}
                                                        />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>{user.role}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selectedLogUser ? `Activity Log: ${selectedLogUser}` : 'User Activity Summary'}
                            </h2>
                            {selectedLogUser && (
                                <button
                                    onClick={() => setSelectedLogUser(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                >
                                    Back to User List
                                </button>
                            )}
                        </div>

                        {!selectedLogUser ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">User Name</th>
                                            <th className="px-6 py-4 font-semibold">Total Actions</th>
                                            <th className="px-6 py-4 font-semibold">Last Active</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {Array.from(new Set(logs.map(l => l.user_name || 'System'))).map((userName, index) => {
                                            const userLogs = logs.filter(l => (l.user_name || 'System') === userName);
                                            const lastActive = new Date(Math.max(...userLogs.map(l => new Date(l.created_at))));
                                            return (
                                                <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLogUser(userName)}>
                                                    <td className="px-6 py-4 font-bold text-gray-900">{userName}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                                            {userLogs.length} Activities
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">{lastActive.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">View History &rarr;</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Time</th>
                                            <th className="px-6 py-4 font-semibold">Action</th>
                                            <th className="px-6 py-4 font-semibold">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.filter(l => (l.user_name || 'System') === selectedLogUser).map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold uppercase">{log.action}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">{log.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
