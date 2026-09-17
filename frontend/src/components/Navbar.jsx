import React from 'react';
import { 
  Calendar, 
  Ticket, 
  LayoutDashboard, 
  Shield, 
  User, 
  LogOut, 
  Smartphone, 
  QrCode, 
  Sparkles,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onOpenMobileGateway }) {
  const { user, isLoggedIn, isAdmin, isScanner, logout } = useAuth();

  return (
    <>
      {/* Top Header (Slim & Clean on Mobile, Rich on Desktop) */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(12, 16, 23, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Brand */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
            onClick={() => setActiveTab('events')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(244, 63, 94, 0.35)',
              flexShrink: 0
            }}>
              <Ticket size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  VESIT EventHub
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)'
                }}>
                  CAMPUS
                </span>
              </div>
              <div className="navbar-brand-subtext" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Official Campus Events &amp; Passes
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile) */}
          <div className="desktop-nav-tabs" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: activeTab === 'events' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'events' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.86rem',
                transition: 'all 0.15s'
              }}
            >
              <Compass size={15} />
              Discover
            </button>

            {!isAdmin && !isScanner && (
              <button
                onClick={() => {
                  if (!isLoggedIn) onOpenAuth();
                  else setActiveTab('registrations');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: activeTab === 'registrations' ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === 'registrations' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  transition: 'all 0.15s'
                }}
              >
                <Ticket size={15} />
                My Passes
              </button>
            )}

            {(isScanner || isAdmin) && (
              <button
                onClick={() => setActiveTab('scanner')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: activeTab === 'scanner' ? 'var(--color-success)' : 'transparent',
                  color: activeTab === 'scanner' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  transition: 'all 0.15s'
                }}
              >
                <QrCode size={15} />
                Gate Scanner
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: activeTab === 'admin' ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === 'admin' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  transition: 'all 0.15s'
                }}
              >
                <LayoutDashboard size={15} />
                Admin Portal
              </button>
            )}
          </div>

          {/* Right Action: Wi-Fi QR modal & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenMobileGateway}
              title="Pair with phone via Wi-Fi"
              className="btn-secondary"
              style={{
                padding: '6px 10px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '8px'
              }}
            >
              <Smartphone size={14} />
              <span>Wi-Fi QR</span>
            </button>

            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isAdmin ? '#8b5cf6' : (isScanner ? '#10b981' : '#f43f5e'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isAdmin ? <Shield size={12} color="#fff" /> : (isScanner ? <QrCode size={12} color="#fff" /> : <User size={12} color="#fff" />)}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  style={{
                    background: 'none',
                    padding: '6px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '8px' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Ergonomic Mobile Bottom Navigation Bar (Fixed for thumb reach) */}
      <div 
        className="mobile-bottom-nav" 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(15, 20, 29, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-subtle)',
          zIndex: 9990,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Tab 1: Discover Events */}
        <button
          onClick={() => setActiveTab('events')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            background: 'none',
            color: activeTab === 'events' ? 'var(--color-primary)' : 'var(--text-muted)',
            padding: '6px 0',
            transition: 'color 0.15s'
          }}
        >
          <Compass size={20} strokeWidth={activeTab === 'events' ? 2.5 : 1.8} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'events' ? 700 : 500 }}>
            Discover
          </span>
        </button>

        {/* Tab 2: My Passes */}
        <button
          onClick={() => {
            if (!isLoggedIn) onOpenAuth();
            else setActiveTab('registrations');
          }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            background: 'none',
            color: activeTab === 'registrations' ? 'var(--color-primary)' : 'var(--text-muted)',
            padding: '6px 0',
            transition: 'color 0.15s'
          }}
        >
          <Ticket size={20} strokeWidth={activeTab === 'registrations' ? 2.5 : 1.8} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'registrations' ? 700 : 500 }}>
            My Passes
          </span>
        </button>

        {/* Tab 3: Scanner (if staff) or Admin (if admin) */}
        {(isScanner || isAdmin) && (
          <button
            onClick={() => setActiveTab(isScanner ? 'scanner' : 'admin')}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              color: (activeTab === 'scanner' || activeTab === 'admin') ? 'var(--color-success)' : 'var(--text-muted)',
              padding: '6px 0',
              transition: 'color 0.15s'
            }}
          >
            {isScanner ? (
              <QrCode size={20} strokeWidth={activeTab === 'scanner' ? 2.5 : 1.8} />
            ) : (
              <LayoutDashboard size={20} strokeWidth={activeTab === 'admin' ? 2.5 : 1.8} />
            )}
            <span style={{ fontSize: '0.68rem', fontWeight: (activeTab === 'scanner' || activeTab === 'admin') ? 700 : 500 }}>
              {isScanner ? 'Gate' : 'Admin'}
            </span>
          </button>
        )}

        {/* Tab 4: Account / Profile */}
        <button
          onClick={() => {
            if (!isLoggedIn) onOpenAuth();
            else logout();
          }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            background: 'none',
            color: 'var(--text-muted)',
            padding: '6px 0',
            transition: 'color 0.15s'
          }}
        >
          <User size={20} strokeWidth={1.8} />
          <span style={{ fontSize: '0.68rem', fontWeight: 500 }}>
            {isLoggedIn ? 'Sign Out' : 'Sign In'}
          </span>
        </button>
      </div>
    </>
  );
}
