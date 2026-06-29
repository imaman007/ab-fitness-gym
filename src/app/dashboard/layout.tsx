'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, CreditCard, Target, Activity,
  BarChart3, Dumbbell, LogOut, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/membership', label: 'Membership', icon: CreditCard },
  { href: '/dashboard/goals', label: 'Fitness Goals', icon: Target },
  { href: '/dashboard/log', label: 'Workout Log', icon: Activity },
  { href: '/dashboard/progress', label: 'Progress', icon: BarChart3 },
]

function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <div className="dash-brand-icon"><Dumbbell size={18} /></div>
        <span className="dash-brand-text">AB<span>Fitness</span></span>
      </div>

      {session?.user && (
        <div className="dash-user">
          <div className="dash-user-avatar">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="dash-user-info">
            <div className="dash-user-name">{session.user.name}</div>
            <div className="dash-user-email">{session.user.email}</div>
          </div>
        </div>
      )}

      <nav className="dash-nav">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-nav-item${isActive ? ' active' : ''}`}
              id={`nav-${item.href.split('/').pop()}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="dash-nav-chevron" />}
            </Link>
          )
        })}
      </nav>

      <button
        className="dash-signout"
        onClick={() => signOut({ callbackUrl: '/' })}
        id="dashboard-signout"
      >
        <LogOut size={16} /> Sign Out
      </button>

      <style>{`
        .dash-sidebar {
          width: 260px;
          min-height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          padding: 28px 16px;
          position: sticky;
          top: 0;
          flex-shrink: 0;
        }
        .dash-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px;
          margin-bottom: 32px;
        }
        .dash-brand-icon {
          width: 36px; height: 36px;
          background: var(--gradient-primary);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
        }
        .dash-brand-text {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .dash-brand-text span { color: var(--primary-light); }
        .dash-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 28px;
        }
        .dash-user-avatar {
          width: 40px; height: 40px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem; color: #fff;
          flex-shrink: 0;
        }
        .dash-user-name { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
        .dash-user-email { font-size: 0.75rem; color: var(--text-muted); }
        .dash-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-fast);
          position: relative;
        }
        .dash-nav-item:hover { background: rgba(124, 58, 237, 0.08); color: var(--text-primary); }
        .dash-nav-item.active {
          background: rgba(124, 58, 237, 0.15);
          color: var(--primary-light);
          border: 1px solid rgba(124, 58, 237, 0.2);
          font-weight: 600;
        }
        .dash-nav-chevron { margin-left: auto; }
        .dash-signout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
          width: 100%;
          margin-top: 16px;
          font-family: var(--font-body);
        }
        .dash-signout:hover { background: rgba(239, 68, 68, 0.08); color: #f87171; }
      `}</style>
    </aside>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-layout">
      <DashboardSidebar />
      <main className="dash-main">{children}</main>
      <style>{`
        .dash-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }
        .dash-main {
          flex: 1;
          overflow: hidden;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .dash-sidebar { display: none; }
        }
      `}</style>
    </div>
  )
}
