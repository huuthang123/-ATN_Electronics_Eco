// src/components/Header.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  // Toggle user dropdown
  const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);

  // Logout
  const handleLogout = useCallback(() => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  }, [logout, navigate]);

  // ⭐ THAY THẾ: handleSearchSubmit
  const handleSearchSubmit = useCallback((e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  }, [searchTerm, navigate]);

  // ⭐ THAY THẾ: handleSearchInput
  const handleSearchInput = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Info user (nếu đã đăng nhập)
  const userInfo = useMemo(() => {
    if (!user || user.isGuest) return null;
    return {
      id: user.id || user.userId,
      username: user.username,
    };
  }, [user]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">

          {/* Logo */}
          <div className="logo">
            <Link to="/" className="logo-text">
              <span className="logo-icon">⚡</span>
              <span className="logo-name">TechStore</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <ul style={{ justifyContent: 'flex-start' }}>
              <li>
                <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                  Trang Chủ
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Search bar */}
          <div className="flex-1 px-6">
            <input
              type="text"
              placeholder="🔍 Tìm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleSearchSubmit}
              className="search-input"
            />
          </div>

          {/* User actions */}
          <div className="user-actions">

            {/* Nếu đã đăng nhập */}
            {userInfo ? (
              <div className="user-dropdown">
                <div className="user-info" onClick={toggleDropdown}>
                  <span className="username">Chào, {userInfo.username}</span>
                  <span className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>
                    <i className="fas fa-caret-down"></i>
                  </span>
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Thông tin tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-btn"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Nếu chưa đăng nhập
              <Link to="/sign-in" className="sign-in-btn">
                Đăng Nhập
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="menu-toggle" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
