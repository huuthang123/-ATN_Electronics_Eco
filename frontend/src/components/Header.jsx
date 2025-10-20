// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Thêm state cho ô search
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/");
    };

    // ✅ Xử lý Enter để chuyển trang tìm kiếm embedding
    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <div className="logo">
                        <Link to="/">
                            <img
                                src="/images/TMKLogo2020Xanh.png"
                                alt="Thai Market Logo"
                                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                            />
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

                    {/* ✅ Ô search */}
                    <div className="flex-1 px-6">
                        <input
                            type="text"
                            placeholder="🔍 Tìm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="search-input"
                        />
                    </div>

                    {/* User Actions */}
                    <div className="user-actions">
                        {user && !user.isGuest ? (
                            <div className="user-dropdown">
                                <div className="user-info" onClick={toggleDropdown}>
                                    <span className="username">Chào, {user.username}</span>
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
                            <Link to="/sign-in" className="sign-in-btn">
                                Đăng Nhập
                            </Link>
                        )}
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
