import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin, QrCode, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import QRModal from '../components/QRModal';
import { useAuth } from '../context/AuthContext';

export default function MyRegistrationsPage({ onOpenAuth }) {
  const { user, token, isLoggedIn, showToast } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQR, setActiveQR] = useState(null);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [user, token, isLoggedIn]);

  const fetchRegistrations = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('/api/registrations/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error fetching registrations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reg) => {
    if (!window.confirm(`Are you sure you want to cancel your pass for "${reg.event_name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/registrations/${reg.registration_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        if (data.auto_promoted) {
          showToast(`✅ Cancelled. ${data.auto_promoted}`, 'info');
        } else {
          showToast('Registration cancelled successfully.', 'info');
        }
        fetchRegistrations();
      } else {
        showToast(data.message || 'Failed to cancel registration', 'error');
      }
    } catch (err) {
      showToast('Network error while cancelling registration', 'error');
    }
  };

  const confirmedList = registrations.filter(r => r.status === 'confirmed');
  const waitlistedList = registrations.filter(r => r.status === 'waitlisted');

  return (
    <div className="container" style={{ padding: '36px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Ticket size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>My Event Passes &amp; Registrations</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Digital tickets for {user?.name || 'Student'} ({user?.department || 'VESIT'})
          </p>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3>Sign In to Access Your Event Passes</h3>
          <p style={{ marginTop: '6px', fontSize: '0.9rem', marginBottom: '20px' }}>
            Please sign in with your student account to view your confirmed BookMyShow digital tickets and waitlist position.
          </p>
          <button onClick={onOpenAuth} className="btn-primary" style={{ padding: '10px 24px' }}>
            Sign In / Register
          </button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading your passes...
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3>No Active Registrations</h3>
          <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>Browse upcoming campus events and reserve your seat to receive your digital QR pass.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Confirmed Passes */}
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#34d399" />
              Confirmed Passes ({confirmedList.length})
            </h2>

            {confirmedList.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No confirmed events.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {confirmedList.map(reg => {
                  const isPresent = reg.attendance_status === 'present';
                  return (
                    <div key={reg.registration_id} className="glass-panel" style={{
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: isPresent ? '4px solid #10b981' : '4px solid #3b82f6'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <span className="badge badge-workshop">{reg.category}</span>
                          {isPresent ? (
                            <span className="badge badge-success">
                              <CheckCircle2 size={12} /> Present
                            </span>
                          ) : (
                            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                              Awaiting Check-in
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{reg.event_name}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#3b82f6" />
                            {new Date(reg.date).toLocaleDateString()}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} color="#8b5cf6" />
                            {reg.start_time?.slice(0, 5)} - {reg.end_time?.slice(0, 5)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} color="#06b6d4" />
                            {reg.venue}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                          onClick={() => setActiveQR(reg)}
                          className="btn-primary"
                          style={{ flex: 1, fontSize: '0.84rem' }}
                        >
                          <QrCode size={16} /> Show QR Pass
                        </button>
                        <button
                          onClick={() => handleCancel(reg)}
                          className="btn-danger"
                          style={{ fontSize: '0.82rem' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Waitlisted Section */}
          {waitlistedList.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color="#f59e0b" />
                Waitlisted Queue ({waitlistedList.length})
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {waitlistedList.map(reg => (
                  <div key={reg.registration_id} className="glass-panel" style={{
                    padding: '22px',
                    borderLeft: '4px solid #f59e0b',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span className="badge badge-waitlist">Waitlist #{reg.waitlist_position}</span>
                        <span style={{ fontSize: '0.75rem', color: '#fcd34d' }}>Auto-promotes on cancel</span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{reg.event_name}</h3>

                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        The event reached full capacity. You are queue member #{reg.waitlist_position}. You will automatically gain a confirmed seat if someone cancels.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => handleCancel(reg)}
                        className="btn-danger"
                        style={{ width: '100%', fontSize: '0.82rem' }}
                      >
                        Leave Waitlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QR Modal */}
      {activeQR && (
        <QRModal
          registration={activeQR}
          onClose={() => setActiveQR(null)}
        />
      )}
    </div>
  );
}
