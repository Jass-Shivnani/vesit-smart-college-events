import React from 'react';
import { Calendar, Clock, MapPin, Ticket, CheckCircle2, AlertCircle, Settings, Users } from 'lucide-react';

export default function EventCard({
  event,
  isAdmin = false,
  isRegistered,
  isWaitlisted,
  waitlistPos,
  onRegister,
  onViewDetails,
  onManage
}) {
  const isFull = event.is_full || event.registered_count >= event.capacity;
  const availableSeats = Math.max(0, event.capacity - (event.registered_count || 0));
  const fillPercentage = Math.min(100, Math.round(((event.registered_count || 0) / (event.capacity || 1)) * 100));

  const categoryBadges = {
    Workshop: 'badge-workshop',
    Bootcamp: 'badge-bootcamp',
    Hackathon: 'badge-hackathon',
    Cultural: 'badge-cultural'
  };

  const badgeClass = categoryBadges[event.category] || 'badge-workshop';

  return (
    <div 
      className="glass-panel" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: isRegistered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-card)',
        position: 'relative',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Event Photography Banner */}
      <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden', background: '#1c2331' }}>
        <img
          src={event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.event_name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(12, 16, 23, 0.95) 0%, rgba(12, 16, 23, 0.1) 65%)'
        }} />

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${badgeClass}`}>
            {event.category}
          </span>
        </div>

        {/* Confirmed / Waitlist Status Pill */}
        {isRegistered && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <CheckCircle2 size={13} /> You're Going
          </div>
        )}

        {isWaitlisted && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(245, 158, 11, 0.9)',
            color: '#000',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <AlertCircle size={13} /> Waitlist #{waitlistPos || 1}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          marginBottom: '8px',
          color: '#fff',
          lineHeight: 1.3
        }}>
          {event.event_name}
        </h3>

        <p style={{
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          marginBottom: '14px',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </p>

        {/* Human Meta: Date, Time, Venue */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Calendar size={14} color="var(--color-primary)" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Clock size={14} color="#a855f7" />
            <span>
              {event.start_time?.slice(0, 5)} – {event.end_time?.slice(0, 5)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MapPin size={14} color="#0ea5e9" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.venue}
            </span>
          </div>
        </div>

        {/* Capacity Indicator Bar */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Seats Remaining</span>
            <span style={{ fontWeight: 600, color: isFull ? 'var(--color-warning)' : 'var(--color-success)' }}>
              {isFull ? 'Queueing in Waitlist' : `${availableSeats} of ${event.capacity} left`}
            </span>
          </div>
          <div style={{
            height: '4px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${fillPercentage}%`,
              background: isFull ? 'var(--color-warning)' : (fillPercentage > 75 ? '#f97316' : 'var(--color-success)'),
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Ticket Perforated Separator Line */}
        <div style={{
          position: 'relative',
          margin: '0 -18px 14px',
          borderTop: '1px dashed var(--border-subtle)'
        }}>
          <div className="ticket-notch-left" style={{ top: '-12px' }} />
          <div className="ticket-notch-right" style={{ top: '-12px' }} />
        </div>

        {/* Bottom Action Button (Apple/BookMyShow style) */}
        <div style={{ marginTop: 'auto' }}>
          {event.is_frozen ? (
            <button
              disabled
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-muted)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'not-allowed'
              }}
            >
              Passes Closed
            </button>
          ) : isAdmin ? (
            <button
              onClick={() => onManage ? onManage(event) : null}
              className="btn-secondary"
              style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem' }}
            >
              <Settings size={14} /> Coordinator Controls
            </button>
          ) : isRegistered || isWaitlisted ? (
            <button
              onClick={() => onViewDetails(event)}
              className="btn-secondary"
              style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem' }}
            >
              <Ticket size={14} /> View My Entry Pass
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className={isFull ? 'btn-secondary' : 'btn-primary'}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.86rem'
              }}
            >
              {isFull ? 'Join Waitlist' : 'Reserve Pass'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
