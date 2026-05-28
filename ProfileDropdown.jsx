import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../services/http';
import './shop.css';

export default function ProfileDropdown({ username: usernameProp }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const username =
    typeof usernameProp === 'string'
      ? usernameProp
      : typeof user?.username === 'string'
        ? user.username
        : 'User';

  const handleLogout = () => {
    // Given snippet:
    // axios.post('/api/logout')
    //   .then(() => window.location.href = '/login')
    //   .catch(...)
    http.post('/logout').catch(() => {});
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <div className="profile-wrap">
      <button
        type="button"
        className="profile-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="avatar" aria-hidden="true">
          {String(username).slice(0, 1).toUpperCase()}
        </span>
        <span className="profile-name">{username}</span>
        <span className="chev" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="profile-menu" role="menu">
          <button type="button" className="menu-item" role="menuitem" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

