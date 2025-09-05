// src/components/common/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Eye, Users, Search, Settings, Home } from "lucide-react";
import "./Navbar.css";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: Home },
    { path: "/clientes", label: "Clientes", icon: Users },
    { path: "/graus", label: "Graus", icon: Search },
    { path: "/servicos", label: "Serviços", icon: Settings },
  ];

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Fechar menu ao clicar fora (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const navbar = document.querySelector(".navbar");

      if (navbar && !navbar.contains(target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevenir scroll quando menu mobile estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Brand/Logo */}
          <Link to="/" className="nav-brand" onClick={closeMenu}>
            <Eye className="brand-icon" size={32} />
            <span className="brand-text">Ótica CRUD</span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-menu desktop">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive(path) ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`nav-menu mobile ${isMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Menu</span>
          </div>

          <div className="mobile-menu-items">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive(path) ? "active" : ""}`}
                onClick={closeMenu}
              >
                <Icon size={20} />
                <span>{label}</span>
                {isActive(path) && <div className="active-indicator" />}
              </Link>
            ))}
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-menu-info">
              <Eye size={16} />
              <span>Ótica CRUD v1.0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="nav-overlay"
          onClick={closeMenu}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
};

export default Navbar;
