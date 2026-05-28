import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function AdminLoginPage() {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔍 Admin login attempt:', { username, password: '***' });
      
      const requestBody = JSON.stringify({
        username,
        password,
      });
      
      console.log('🔍 Request body:', requestBody);
      console.log('🔍 Request headers:', {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      });
      
      const response = await fetch('http://localhost:9090/admin/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173'
        },
        body: requestBody,
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      console.log('🔍 Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Backend error response:', errorText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          console.log('Could not parse error as JSON, using raw text');
        }
        
        throw new Error(errorData.message || errorData.error || errorText || 'Admin login failed');
      }

      const data = await response.json();
      console.log('🔍 Admin login response data:', data);
      console.log('🔍 Data keys:', Object.keys(data));
      console.log('🔍 Data type:', typeof data);
      console.log('🔍 Is array?:', Array.isArray(data));
      
      // Log all possible token fields with their values
      console.log('🔍 Token fields check:');
      console.log('  - data.token:', data.token);
      console.log('  - data.jwt:', data.jwt);
      console.log('  - data.accessToken:', data.accessToken);
      console.log('  - data.authorization:', data.authorization);
      console.log('  - data.bearer:', data.bearer);
      console.log('  - data.Authorization:', data.Authorization);
      console.log('  - data.Bearer:', data.Bearer);
      
      // Check if response headers contain token (backend sends token in set-cookie header)
      const setCookieHeader = response.headers.get('set-cookie');
      const authHeader = response.headers.get('Authorization');
      const bearerHeader = response.headers.get('Bearer');
      
      console.log('🔍 Response headers:');
      console.log('  - set-cookie header:', setCookieHeader);
      console.log('  - Authorization header:', authHeader);
      console.log('  - Bearer header:', bearerHeader);
      
      // Extract token from set-cookie header
      let token = null;
      if (setCookieHeader) {
        console.log('🔍 Parsing set-cookie header...');
        // set-cookie format: "auth Token=eyJhbGciOiJIUzI1NiIs...;HttpOnly;path=/;Max-Age=360;SameSite=None"
        const tokenMatch = setCookieHeader.match(/auth Token=([^;]+)/);
        if (tokenMatch && tokenMatch[1]) {
          token = tokenMatch[1];
          console.log('🔍 Extracted token from set-cookie:', token.substring(0, 50) + '...');
        }
      }
      
      // Fallback to other header methods
      if (!token) {
        token = data.token || data.jwt || data.accessToken || data.authorization || data.bearer || authHeader || bearerHeader;
        if (token) {
          console.log('🔍 Found token from other source:', token.substring(0, 50) + '...');
        }
      }
      
      // Store admin user info
      localStorage.setItem('adminUser', JSON.stringify({
        username: data.username || username,
        role: data.role || 'ADMIN',
        loginTime: new Date().toISOString()
      }));

      if (token) {
        console.log('🔍 Storing admin token:', token.substring(0, 50) + '...');
        console.log('🔍 Token type:', typeof token);
        localStorage.setItem('adminToken', token);
        navigate('/admin/dashboard');
      } else {
        console.log('🔍 No admin token found in any location. Full response:', data);
        console.log('🔍 Response status:', response.status);
        console.log('🔍 All response headers:', [...response.headers.entries()]);
        console.warn('⚠️ No admin token received, proceeding without authentication');
        // Still proceed without token since backend might not require it for session
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.log('🔍 Admin login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundImage: 'url("https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'Arial, sans-serif',
      paddingRight: '50px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(52, 73, 94, 0.95), rgba(44, 62, 80, 0.95))',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        width: '100%',
        maxWidth: '400px',
        animation: 'slideInRight 0.6s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#fff',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Admin Login
          </h1>
          <p style={{
            color: '#b0c4de',
            fontSize: '14px',
            margin: 0,
            fontWeight: '500'
          }}>
            Access your admin dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            animation: 'shake 0.5s ease-in-out'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#b0c4de',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your admin username"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid rgba(176, 196, 222, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(176, 196, 222, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#b0c4de',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your admin password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  paddingRight: '50px',
                  border: '1px solid rgba(176, 196, 222, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(176, 196, 222, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#b0c4de',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '5px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#fff';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#b0c4de';
                  e.target.style.background = 'transparent';
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(59, 130, 246, 0.7)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Authenticating...
              </span>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(176, 196, 222, 0.2)'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#b0c4de',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#b0c4de';
            }}
          >
            Back to User Login
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        input::placeholder {
          color: rgba(176, 196, 222, 0.6);
        }

        input:focus::placeholder {
          color: rgba(176, 196, 222, 0.4);
        }
      `}</style>
    </div>
  );
}

export default AdminLoginPage;
