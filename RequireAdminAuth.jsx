import { Navigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function RequireAdminAuth({ children }) {
  const { theme } = useTheme();
  
  // Check for admin authentication (only require adminUser, not adminToken)
  const adminUser = localStorage.getItem('adminUser');
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminUser) {
    console.log('🔍 No admin user found, redirecting to admin login...');
    return <Navigate to="/admin" replace />;
  }

  // Log authentication status
  console.log('🔍 Admin authentication check:');
  console.log('  - adminUser exists:', !!adminUser);
  console.log('  - adminToken exists:', !!adminToken);
  console.log('  - Proceeding with admin authentication...');

  try {
    const user = JSON.parse(adminUser);
    
    // Simple session timeout check (2 hours)
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    if (now - loginTime > sessionTimeout) {
      console.log('🔍 Admin session expired, redirecting to admin login...');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      return <Navigate to="/admin" replace />;
    }
    
    return children;
  } catch (error) {
    console.log('🔍 Error parsing admin user:', error);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin" replace />;
  }
}

export default RequireAdminAuth;
