// Authentication utilities
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('companyId');
  localStorage.removeItem('companyName');
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const hasRole = (requiredRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  return userRole === requiredRoles;
};

export const logout = () => {
  removeToken();
  window.location.href = '/';
};
