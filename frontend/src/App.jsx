import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <ProtectedRoute requiredRoles={['Admin', 'Manager']}>
                <Products />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRoles={['Admin', 'Manager']}>
                <Users />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute requiredRoles={['Admin', 'Manager']}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
