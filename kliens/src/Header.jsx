import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  // Ellenőrizzük, van-e token (be van-e lépve a felhasználó)
  const isAuthenticated = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: '15px 40px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to={isAuthenticated ? "/dashboard" : "/"} style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
        🛡️ Gyerek Tracker
      </Link>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {isAuthenticated ? (
          // Ha be van lépve
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/admin" style={linkStyle}>Admin Panel</Link>
            <button onClick={logout} style={buttonStyle}>
              Kijelentkezés
            </button>
          </>
        ) : (
          // Ha nincs belépve
          <>
            <Link to="/" style={linkStyle}>Regisztráció</Link>
            <Link to="/login" style={linkStyle}>Belépés</Link>
          </>
        )}
        
      </div>
    </div>
  );
}

const linkStyle = {
  color: '#99b8cf',
  textDecoration: 'none',
  padding: '5px 0',
  transition: 'color 0.3s'
};

const buttonStyle = {
    background: 'transparent',
    color: '#ff4d4d',
    border: '1px solid #ff4d4d',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default Header;
