import React from 'react';
import { AlertOctagon, Clock, Calendar, MapPin, X, ArrowRight } from 'lucide-react';

export default function ConflictModal({ conflictData, onClose }) {
  if (!conflictData) return null;

  const { targetEvent, conflicting_event, message } = conflictData;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '540px',
        width: '100%',
        background: '#131926',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        boxShadow: '0 0 40px rgba(244, 63, 94, 0.25)',
        padding: '28px',
        borderRadius: '20px',
        position: 'relative',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertOctagon size={26} color="#fb7185" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fda4af' }}>Schedule Conflict Detected!</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Backend Logic Conflict Prevention Rule</p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '20px', lineHeight: 1.5 }}>
          {message || 'You cannot register for this event because it clashes with an event you are already confirmed for.'}
        </p>

        {/* Conflict Comparison Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {/* Confirmed Existing Event */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', marginBottom: '6px' }}>
              Current Registration
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '6px' }}>
              {conflicting_event?.event_name || 'Existing Event'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} color="#fb7185" />
              {conflicting_event?.time || '10:00 - 12:00'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <MapPin size={13} color="#fb7185" />
              {conflicting_event?.venue || 'Campus'}
            </div>
          </div>

          {/* Target Event */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '6px' }}>
              Attempted Registration
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '6px' }}>
              {targetEvent?.event_name || 'Requested Event'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} color="#60a5fa" />
              {targetEvent?.start_time?.slice(0,5)} - {targetEvent?.end_time?.slice(0,5)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <MapPin size={13} color="#60a5fa" />
              {targetEvent?.venue || 'Campus'}
            </div>
          </div>
        </div>

        {/* Algorithm Viva Note */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '20px'
        }}>
          💡 <strong style={{ color: '#cbd5e1' }}>Algorithm Insight:</strong> Backend checks existing registrations with condition{' '}
          <code style={{ color: '#93c5fd', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px' }}>
            StartA &lt; EndB &amp;&amp; EndA &gt; StartB
          </code>{' '}
          on the same date to prevent dual booking.
        </div>

        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Understood, Close
        </button>
      </div>
    </div>
  );
}
