'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Dumbbell, Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { href: '/workouts', label: 'Workouts' },
    { href: '/exercises', label: 'Exercises' },
    { href: '/locations', label: 'Locations' },
    { href: '/tips', label: 'Tips' },
  ]

  return (
    <>
      <nav className={`navbar${isScrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link href="/" className="navbar-logo">
            <div className="logo-icon">
              <Dumbbell size={22} />
            </div>
            <span className="logo-text">AB<span className="logo-accent">Fitness</span></span>
          </Link>

          <ul className="navbar-links">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">{link.label}</Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {session?.user ? (
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  id="user-menu-trigger"
                >
                  <div className="user-avatar">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{session.user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={userMenuOpen ? 'rotated' : ''} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown" id="user-dropdown">
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link href="/dashboard/membership" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={15} /> My Membership
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={() => signOut({ callbackUrl: '/' })}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          <button
            className="burger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu-panel">
            <div className="mobile-nav-links">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mobile-nav-actions">
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link href="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 0;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(5, 5, 15, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(124, 58, 237, 0.15);
          padding: 14px 0;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: var(--gradient-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .logo-accent { color: var(--primary-light); }
        .navbar-links {
          display: flex;
          list-style: none;
          gap: 4px;
          flex: 1;
        }
        .nav-link {
          padding: 8px 14px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(124, 58, 237, 0.1);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .user-menu-wrapper { position: relative; }
        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          cursor: pointer;
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-fast);
        }
        .user-menu-btn:hover { background: rgba(124, 58, 237, 0.2); border-color: var(--primary); }
        .user-avatar {
          width: 28px;
          height: 28px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
        }
        .user-name { font-family: var(--font-heading); }
        .rotated { transform: rotate(180deg); transition: transform 0.2s; }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 8px;
          min-width: 200px;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.15s ease;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--font-body);
        }
        .dropdown-item:hover { background: rgba(124, 58, 237, 0.1); color: var(--text-primary); }
        .dropdown-item.danger:hover { background: rgba(239, 68, 68, 0.1); color: #f87171; }
        .dropdown-divider { height: 1px; background: var(--border-light); margin: 4px 0; }
        .burger-btn {
          display: none;
          background: none;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
          transition: var(--transition-fast);
        }
        .burger-btn:hover { background: rgba(124, 58, 237, 0.1); border-color: var(--primary); }
        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 200;
        }
        .mobile-menu-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5, 5, 15, 0.8);
          backdrop-filter: blur(8px);
        }
        .mobile-menu-panel {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(320px, 90vw);
          background: var(--bg-card);
          border-left: 1px solid var(--border);
          padding: 80px 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: slideFromRight 0.3s ease;
        }
        @keyframes slideFromRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .mobile-nav-links { display: flex; flex-direction: column; gap: 4px; }
        .mobile-nav-link {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition-fast);
          border: 1px solid transparent;
        }
        .mobile-nav-link:hover { background: rgba(124, 58, 237, 0.1); color: var(--text-primary); border-color: var(--border); }
        .mobile-nav-actions { display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
        @media (max-width: 768px) {
          .navbar-links, .navbar-actions { display: none; }
          .burger-btn { display: flex; }
        }
      `}</style>
    </>
  )
}
