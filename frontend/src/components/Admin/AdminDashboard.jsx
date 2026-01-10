import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <AdminLayout>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Dashboard Overview</h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Welcome back, {user.name}!</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
            }}>
                <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '0.5rem' }}>120</h3>
                    <span style={{ color: '#6c757d' }}>Total Users</span>
                </div>
                <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: '#27ae60', marginBottom: '0.5rem' }}>$4,500</h3>
                    <span style={{ color: '#6c757d' }}>Total Revenue</span>
                </div>
                <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: '#e67e22', marginBottom: '0.5rem' }}>15</h3>
                    <span style={{ color: '#6c757d' }}>Pending Orders</span>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
