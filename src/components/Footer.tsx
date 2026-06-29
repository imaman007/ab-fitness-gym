'use client'

import Link from 'next/link'
import { Dumbbell, Instagram, Twitter, Youtube, Facebook, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-icon"><Dumbbell size={20} /></div>
              <span className="footer-logo-text">AB<span style={{ color: 'var(--primary-light)' }}>Fitness</span></span>
            </Link>
            <p className="footer-tagline">
              Transforming lives across India with premium fitness experiences, expert coaching, and cutting-edge facilities.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Instagram" id="footer-instagram">
                <Instagram size={17} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter" id="footer-twitter">
                <Twitter size={17} />
              </a>
              <a href="#" className="social-link" aria-label="YouTube" id="footer-youtube">
                <Youtube size={17} />
              </a>
              <a href="#" className="social-link" aria-label="Facebook" id="footer-facebook">
                <Facebook size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              <li><Link href="/workouts">Workout Plans</Link></li>
              <li><Link href="/exercises">Exercise Library</Link></li>
              <li><Link href="/locations">Find a Gym</Link></li>
              <li><Link href="/tips">Fitness Tips</Link></li>
            </ul>
          </div>

          {/* Membership */}
          <div className="footer-col">
            <h4 className="footer-col-title">Membership</h4>
            <ul className="footer-links">
              <li><Link href="/#pricing">Silver Plan</Link></li>
              <li><Link href="/#pricing">Gold Plan</Link></li>
              <li><Link href="/#pricing">Platinum Plan</Link></li>
              <li><Link href="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <ul className="footer-contact">
              <li><MapPin size={14} /><span>HQ: Bandra-Kurla Complex, Mumbai</span></li>
              <li><Phone size={14} /><span>+91 1800-AB-FITNS</span></li>
              <li><Mail size={14} /><span>hello@abfitness.in</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} AB Fitness. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-light);
          padding: 80px 0 0;
          margin-top: 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          margin-bottom: 60px;
        }
        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 16px;
        }
        .footer-logo-icon {
          width: 36px;
          height: 36px;
          background: var(--gradient-primary);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .footer-logo-text {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .footer-tagline {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .footer-social {
          display: flex;
          gap: 10px;
        }
        .social-link {
          width: 38px;
          height: 38px;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .social-link:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
          transform: translateY(-2px);
        }
        .footer-col-title {
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--text-primary);
          padding-left: 4px;
        }
        .footer-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-contact li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .footer-contact li svg { flex-shrink: 0; margin-top: 2px; color: var(--primary-light); }
        .footer-bottom {
          border-top: 1px solid var(--border-light);
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-bottom p { font-size: 0.85rem; color: var(--text-muted); }
        .footer-bottom-links { display: flex; gap: 24px; }
        .footer-bottom-links a { font-size: 0.85rem; color: var(--text-muted); text-decoration: none; }
        .footer-bottom-links a:hover { color: var(--text-secondary); }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .footer-bottom-links { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>
    </footer>
  )
}
