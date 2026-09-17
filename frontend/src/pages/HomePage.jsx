import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import EventCard from '../components/EventCard';
import ConflictModal from '../components/ConflictModal';
import QRModal from '../components/QRModal';
import BookTicketModal from '../components/BookTicketModal';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function HomePage({ onViewRegistrations, onNavigateToAdmin, onOpenAuth }) {
  const { user, token, isAdmin, isLoggedIn, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [conflictModalData, setConflictModalData] = useState(null);
  const [activeQRPass, setActiveQRPass] = useState(null);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  const categories = ['All', 'Workshop', 'Bootcamp', 'Hackathon', 'Cultural'];

  useEffect(() => {
    fetchEvents();
    fetchUserRegistrations();
  }, [user, token]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }

      // Fetch recommendations if token present
      if (token) {
        const recRes = await fetch('/api/events/recommendations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const recData = await recRes.json();
        if (recData.success) {
          setRecommendations(recData.recommendations || []);
        }
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    const token = localStorage.getItem('college_token');
    if (!token) return;
    try {
      const res = await fetch('/api/registrations/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserRegistrations(data.registrations);
      }
    } catch (err) {
      console.error('Failed to fetch user registrations', err);
    }
  };

  const handleRegister = async (event) => {
    const token = localStorage.getItem('college_token');
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ event_id: event.event_id })
      });

      const data = await res.json();

      if (res.status === 409 && data.conflict) {
        // 🚨 SCHEDULE CONFLICT DETECTED!
        setConflictModalData({
          targetEvent: event,
          conflicting_event: data.conflicting_event,
          message: data.message
        });
        showToast('⚠️ Registration blocked: Schedule Conflict Detected!', 'error');
        return;
      }

      if (!res.ok) {
        showToast(data.message || 'Registration failed', 'error');
        return;
      }

      if (data.status === 'confirmed') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        showToast(data.message || 'Registration confirmed! Digital pass generated.', 'success');
      } else if (data.status === 'waitlisted') {
        showToast(data.message || 'Added to waitlist queue!', 'warning');
      }

      // Refresh data
      fetchEvents();
      fetchUserRegistrations();
    } catch (err) {
      showToast('Network error while processing registration', 'error');
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <div style={{
        marginTop: '36px',
        marginBottom: '40px',
        padding: '40px 32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
              VESIT D17A MINI-PROJECT
            </span>
            <span className="badge badge-success">
              CI/CD & DOCKER READY
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', lineHeight: 1.2, marginBottom: '14px', letterSpacing: '-0.03em' }}>
            Smart College Event Management System
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            Intelligently manages student event registrations with automated{' '}
            <strong style={{ color: '#fb7185' }}>Schedule Conflict Detection</strong>,{' '}
            <strong style={{ color: '#f59e0b' }}>Queue-based Waitlisting</strong>, and{' '}
            <strong style={{ color: '#34d399' }}>QR-code Attendance Verification</strong>.
          </p>

          {/* Action Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {isAdmin ? (
              <button
                onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '10px 20px' }}
              >
                <Sparkles size={16} /> Open Admin Management Portal
              </button>
            ) : isLoggedIn ? (
              <button
                onClick={() => onViewRegistrations && onViewRegistrations()}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '10px 20px' }}
              >
                <Sparkles size={16} /> View My Booked Passes
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '10px 20px' }}
              >
                <Sparkles size={16} /> Sign In to Reserve Seats
              </button>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-pill" style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#93c5fd' }}>
                Instant Scannable QR Pass
              </span>
              <span className="glass-pill" style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#6ee7b7' }}>
                Automated Waitlist Queue
              </span>
              <span className="glass-pill" style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#c084fc' }}>
                Schedule Conflict Protection
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div style={{
          position: 'absolute',
          right: '-60px',
          top: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Smart Recommendations Section */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={20} color="#8b5cf6" />
            <h2 style={{ fontSize: '1.4rem' }}>Recommended for {user?.name || 'You'}</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              (Based on {user?.department || 'CMPN'} &amp; {user?.interests || 'Cloud'})
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}>
            {recommendations.slice(0, 2).map(event => {
              const reg = userRegistrations.find(r => r.event_id === event.event_id);
              return (
                <EventCard
                  key={`rec-${event.event_id}`}
                  event={event}
                  isAdmin={isAdmin}
                  isRegistered={reg?.status === 'confirmed'}
                  isWaitlisted={reg?.status === 'waitlisted'}
                  waitlistPos={reg?.waitlist_position}
                  onRegister={handleRegister}
                  onViewDetails={() => onViewRegistrations()}
                  onManage={() => onNavigateToAdmin && onNavigateToAdmin(event)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '44px' }}
            placeholder="Search events by title, venue, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{
                fontSize: '0.84rem',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '18px' }}>
          Upcoming Campus Events ({filteredEvents.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            No events found matching your filter criteria.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {filteredEvents.map(event => {
              const reg = userRegistrations.find(r => r.event_id === event.event_id);
              return (
                <EventCard
                  key={event.event_id}
                  event={event}
                  isAdmin={isAdmin}
                  isRegistered={reg?.status === 'confirmed'}
                  isWaitlisted={reg?.status === 'waitlisted'}
                  waitlistPos={reg?.waitlist_position}
                  onRegister={() => {
                    if (!isLoggedIn) {
                      onOpenAuth();
                      showToast('Please sign in or register to book your ticket', 'info');
                    } else {
                      setSelectedEventForBooking(event);
                    }
                  }}
                  onViewDetails={() => onViewRegistrations()}
                  onManage={() => onNavigateToAdmin && onNavigateToAdmin(event)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Book Ticket Modal */}
      {selectedEventForBooking && (
        <BookTicketModal
          event={selectedEventForBooking}
          isOpen={!!selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onOpenAuth={onOpenAuth}
          onSuccess={(registration) => {
            fetchEvents();
            fetchUserRegistrations();
            if (registration) {
              setActiveQRPass({
                ...registration,
                event_name: selectedEventForBooking.event_name,
                venue: selectedEventForBooking.venue,
                date: selectedEventForBooking.date,
                start_time: selectedEventForBooking.start_time,
                end_time: selectedEventForBooking.end_time,
                student_name: user?.name,
                department: user?.department
              });
            }
          }}
        />
      )}

      {/* Conflict Modal */}
      {conflictModalData && (
        <ConflictModal
          conflictData={conflictModalData}
          onClose={() => setConflictModalData(null)}
        />
      )}

      {/* BookMyShow QR Code Pass Modal */}
      {activeQRPass && (
        <QRModal
          registration={activeQRPass}
          onClose={() => setActiveQRPass(null)}
        />
      )}
    </div>
  );
}
