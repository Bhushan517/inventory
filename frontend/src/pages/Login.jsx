import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { setToken, setUserRole } from '../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, role, user, companyId } = response.data;

      setToken(token);
      setUserRole(role);
      // Store user info for profile display
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      localStorage.setItem('companyId', companyId);
      localStorage.setItem('companyName', user.company.name);

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📦</span>
              </div>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Welcome Back! 👋
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your <span className="font-semibold text-indigo-600">Inventory Pro</span> account
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-lg">📧</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-lg">🔒</span>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Sign in</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
                  >
                    Create account here
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Admin:</span>
                    <span className="font-mono">admin / admin123</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Beautiful Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white bg-opacity-10 rounded-full animate-bounce"></div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <span className="text-6xl">📊</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">
                  Inventory Management
                </h1>
                <p className="text-xl text-indigo-100 mb-8 max-w-md mx-auto">
                  Streamline your inventory operations with our powerful management system
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <div className="flex items-center text-indigo-100">
                  <span className="text-2xl mr-3">✨</span>
                  <span>Real-time inventory tracking</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <span className="text-2xl mr-3">📈</span>
                  <span>Advanced analytics & reports</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <span className="text-2xl mr-3">🔐</span>
                  <span>Multi-user role management</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <span className="text-2xl mr-3">⚡</span>
                  <span>Lightning fast performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
