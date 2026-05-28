import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function LoginPage() {
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
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Backend error response:', errorText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          console.log('Could not parse error as JSON, using raw text');
        }
        
        throw new Error(errorData.message || errorData.error || errorText || 'Login failed');
      }

      const data = await response.json();
      console.log('🔍 Login response data:', data);
      console.log('🔍 Data keys:', Object.keys(data));
      console.log('🔍 Token fields:', {
        token: data.token,
        jwt: data.jwt,
        accessToken: data.accessToken,
        authorization: data.authorization,
        bearer: data.bearer
      });
      
      localStorage.setItem('user', JSON.stringify({
        username: data.username || username,
        role: data.role || 'CUSTOMER',
      }));

      // Check for token in multiple possible fields
      const token = data.token || data.jwt || data.accessToken || data.authorization || data.bearer;
      
      if (token) {
        console.log('🔍 Found token:', token.substring(0, 20) + '...');
        localStorage.setItem('token', token);
        navigate('/home');
      } else {
        console.log('🔍 No token found in response. Full response:', data);
        // Try to proceed without token for now, but warn
        console.warn('⚠️ No token received, proceeding without authentication');
        navigate('/home');
      }
    } catch (err) {
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
      backgroundImage: 'url("https://images.pexels.com/photos/20368188/pexels-photo-20368188.jpeg")',
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
        marginRight: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        animation: 'slideInRight 0.6s ease-out'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#fff',
          fontSize: '28px',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          letterSpacing: '-0.5px',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          Welcome Back
        </h2>
        
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.9))',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            animation: 'shake 0.5s ease-in-out'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: '16px 20px 16px 50px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                width: '100%',
                transition: 'all 0.3s ease',
                outline: 'none',
                backdropFilter: 'blur(5px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(52, 152, 219, 0.8)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <span style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px'
            }}>👤</span>
          </div>
          
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '16px 50px 16px 50px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                width: '100%',
                transition: 'all 0.3s ease',
                outline: 'none',
                backdropFilter: 'blur(5px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(52, 152, 219, 0.8)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <span style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px'
            }}>🔒</span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.3s ease',
                padding: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#fff';
                e.target.style.transform = 'translateY(-50%) scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading 
                ? 'linear-gradient(135deg, rgba(149, 165, 166, 0.8), rgba(127, 140, 141, 0.8))'
                : 'linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9))',
              color: '#fff',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 25px rgba(52, 152, 219, 0.4)',
              outline: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, rgba(41, 128, 185, 0.9), rgba(52, 73, 94, 0.9))';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(52, 152, 219, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9))';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.4)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          animation: 'fadeInUp 1s ease-out'
        }}>
          Don't have an account? 
          <a 
            href="/register" 
            style={{ 
              color: '#3498db',
              textDecoration: 'none',
              fontWeight: '600',
              marginLeft: '5px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#5dade2';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#3498db';
              e.target.style.textDecoration = 'none';
            }}
          >
            Register
          </a>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
