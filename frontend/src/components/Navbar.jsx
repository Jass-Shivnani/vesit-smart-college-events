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
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onOpenMobileGateway }) {
  const { user, isLoggedIn, isAdmin, isScanner, logout } = useAuth();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(11, 15, 25, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} 
          onClick={() => setActiveTab('events')}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)'
          }}>
            <Calendar size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>VESIT EventHub</span>
              <span className="glass-pill" style={{ fontSize: '0.7rem', padding: '2px 8px', color: '#60a5fa', fontWeight: 700 }}>
                GROUP 11
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Containerized Smart Event Management &amp; Gate Pass System
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Events Catalog Tab */}
          <button
            onClick={() => setActiveTab('events')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'events' ? 'var(--gradient-primary)' : 'transparent',
              color: activeTab === 'events' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            <Calendar size={16} />
            Events
          </button>

          {/* Student Pass Tab (Accessible when logged in as student or not logged in) */}
          {!isAdmin && !isScanner && (
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  onOpenAuth();
                } else {
                  setActiveTab('registrations');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: activeTab === 'registrations' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'registrations' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <Ticket size={16} />
              My Passes
            </button>
          )}

          {/* Gate Scanner Tab (Accessible by Scanner Staff and Admin) */}
          {(isScanner || isAdmin) && (
            <button
              onClick={() => setActiveTab('scanner')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: activeTab === 'scanner' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'transparent',
                color: activeTab === 'scanner' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <QrCode size={16} />
              Gate Scanner
            </button>
          )}

          {/* Admin Tab (Admin Only) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: activeTab === 'admin' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'admin' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <LayoutDashboard size={16} />
              Admin Portal
            </button>
          )}
        </div>

        {/* Right Section: Mobile Gateway & Authentication */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mobile Gateway Button */}
          <button
            onClick={onOpenMobileGateway}
            title="Open on Mobile Phones via Local Wi-Fi"
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.3)',
              color: '#93c5fd'
            }}
          >
            <Smartphone size={16} />
            <span style={{ display: 'none', mdDisplay: 'inline' }}>Mobile Access</span>
          </button>

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* User Profile Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isAdmin ? '#8b5cf6' : (isScanner ? '#10b981' : '#06b6d4'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isAdmin ? <Shield size={14} color="#fff" /> : (isScanner ? <QrCode size={14} color="#fff" /> : <User size={14} color="#fff" />)}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: isAdmin ? '#c084fc' : (isScanner ? '#34d399' : '#67e8f9'),
                    textTransform: 'capitalize'
                  }}>
                    {user.role} • {user.department || 'VESIT'}
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Sign out of account"
                className="btn-secondary"
                style={{ padding: '8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
