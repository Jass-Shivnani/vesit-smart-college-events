import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function BookTicketModal({ event, isOpen, onClose, onSuccess, onOpenAuth }) {
  const { user, isLoggedIn, token, showToast } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  if (!isOpen || !event) return null;

  const isFull = (event.registered_count || 0) >= event.capacity;
  const isFrozen = !!event.is_frozen;

  const handleConfirmBooking = async () => {
    if (!isLoggedIn) {
      onClose();
      onOpenAuth();
      showToast('Please sign in or register to book your ticket', 'info');
      return;
    }

    setIsSubmitting(true);
    setConflictError(null);

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
        // Schedule conflict detected
        setConflictError(data);
        showToast('⚠️ Registration blocked: Time overlap conflict detected!', 'error');
        return;
      }

      if (!res.ok) {
        showToast(data.message || 'Registration failed.', 'error');
        return;
      }

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast(data.message || 'Ticket booked successfully!', 'success');
      onSuccess(data.registration);
      onClose();
    } catch (err) {
      showToast('Network error while processing registration', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Bottom Sheet Handle */}
        <div className="sheet-drag-handle" />
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '18px' }}>
          <span className="badge badge-info" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
            {event.category}
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', lineHeight: 1.3 }}>
            {event.event_name}
          </h2>
        </div>

        {/* Event Timing & Venue */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '18px',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--color-primary)" />
            <span>{event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--color-primary)" />
            <span>{event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
            <MapPin size={16} color="var(--color-primary)" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Live Seat Availability Gauge */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Seat Availability</span>
            <span style={{ fontWeight: 600 }}>
              {event.registered_count || 0} / {event.capacity} Confirmed
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.round(((event.registered_count || 0) / event.capacity) * 100))}%`,
              background: isFull ? '#f59e0b' : 'var(--color-primary)',
              borderRadius: '4px'
            }} />
          </div>

          {isFrozen ? (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              <span>Registrations have been closed by college administration.</span>
            </div>
          ) : isFull ? (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fcd34d',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              <span>
                Event is at full capacity! You will be placed on the <strong>Waitlist</strong>. If a confirmed student cancels, you will be automatically promoted.
              </span>
            </div>
          ) : (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>Seats Available! Guaranteed confirmed entry pass will be generated.</span>
            </div>
          )}
        </div>

        {/* Schedule Conflict Warning */}
        {conflictError && (
          <div style={{
            marginBottom: '18px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.82rem'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Overlapping Event Conflict
            </div>
            <div>
              You are already registered for <strong>{conflictError.conflicting_event?.event_name}</strong> (
              {conflictError.conflicting_event?.start_time?.slice(0, 5)} - {conflictError.conflicting_event?.end_time?.slice(0, 5)}) on this date.
            </div>
          </div>
        )}

        {/* Attendee Details Summary */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            TICKET HOLDER DETAILS
          </div>
          {isLoggedIn ? (
            <div style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>
              <strong>{user?.name}</strong> • {user?.email} • <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{user?.department}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
              Not signed in. You will be prompted to sign in to confirm this reservation.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, padding: '12px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting || isFrozen}
            className="btn-primary"
            style={{
              flex: 2,
              padding: '12px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={18} />
            {isSubmitting ? 'Reserving...' : isFull ? 'Join Waitlist Queue' : 'Confirm & Generate Pass'}
          </button>
        </div>
      </div>
    </div>
  );
}
