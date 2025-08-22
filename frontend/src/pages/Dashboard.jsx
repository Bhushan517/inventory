import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import Layout from '../components/Layout';
import api from '../utils/api';

const Dashboard = () => {
  const userRole = getUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalTransactions: 0,
    lowStockItems: 0,
    recentTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // All authenticated users can access dashboard summary
      const response = await api.get('/reports/dashboard-summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data
      setStats({
        totalProducts: 0,
        totalTransactions: 0,
        lowStockItems: 0,
        recentTransactions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'Admin':
        return '🎉 Welcome, Administrator! You have full access to all system features.';
      case 'Manager':
        return '🎉 Welcome, Manager! You can manage products, transactions, and view reports.';
      case 'Staff':
        return '🎉 Welcome, Staff! You can manage transactions and inventory movements.';
      default:
        return '🎉 Welcome to the Inventory Management System!';
    }
  };

  const getAvailableFeatures = () => {
    switch (userRole) {
      case 'Admin':
        return [
          { name: 'User Management', description: 'Add, edit, and delete user accounts', icon: '👥' },
          { name: 'Product Management', description: 'Manage product catalog and inventory', icon: '📦' },
          { name: 'Transaction Management', description: 'Handle stock movements and transactions', icon: '📊' },
          { name: 'Reports & Analytics', description: 'View comprehensive reports and analytics', icon: '📈' }
        ];
      case 'Manager':
        return [
          { name: 'Product Management', description: 'Manage product catalog and inventory', icon: '📦' },
          { name: 'Transaction Management', description: 'Handle stock movements and transactions', icon: '📊' },
          { name: 'Reports & Analytics', description: 'View reports and analytics', icon: '📈' }
        ];
      case 'Staff':
        return [
          { name: 'Transaction Management', description: 'Handle stock movements and transactions', icon: '📊' }
        ];
      default:
        return [];
    }
  };

  const features = getAvailableFeatures();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden shadow-xl rounded-2xl">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome Back! 👋
                </h1>
                <p className="text-indigo-100 text-lg">
                  {getWelcomeMessage()}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalTransactions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Low Stock Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.lowStockItems}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Recent Activity
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.recentTransactions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(userRole === 'Admin' || userRole === 'Manager') && (
                <button
                  onClick={() => navigate('/users')}
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <span className="text-2xl mr-3">👥</span>
                  <span className="font-medium text-blue-900">
                    {userRole === 'Manager' ? 'Manage Staff' : 'Manage Users'}
                  </span>
                </button>
              )}
              {(userRole === 'Admin' || userRole === 'Manager') && (
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <span className="text-2xl mr-3">📦</span>
                  <span className="font-medium text-green-900">Manage Products</span>
                </button>
              )}
              <button
                onClick={() => navigate('/transactions')}
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
              >
                <span className="text-2xl mr-3">📊</span>
                <span className="font-medium text-purple-900">New Transaction</span>
              </button>
              {(userRole === 'Admin' || userRole === 'Manager') && (
                <button
                  onClick={() => navigate('/reports')}
                  className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  <span className="text-2xl mr-3">📈</span>
                  <span className="font-medium text-orange-900">View Reports</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
