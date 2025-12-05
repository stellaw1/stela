// src/components/Layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={`app-header ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="header-content">
                <h1 className="header-title">when2boulder</h1>
                <button 
                    className="hamburger-menu"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>
            <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/" className="nav-link" onClick={closeMenu}>
                    Schedule
                </Link>
                <Link to="/event" className="nav-link" onClick={closeMenu}>
                    Events
                </Link>
            </nav>
        </header>
    );
}

export default Header;
