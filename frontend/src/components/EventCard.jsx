import React from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, CheckCircle, AlertCircle, Settings } from 'lucide-react';

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

  const categoryBadges = {
    Workshop: 'badge-workshop',
    Bootcamp: 'badge-bootcamp',
    Hackathon: 'badge-hackathon',
    Cultural: 'badge-cultural'
  };

  const badgeClass = categoryBadges[event.category] || 'badge-workshop';

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: isRegistered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
      position: 'relative'
    }}>
      {/* Banner Image */}
      <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
        <img
          src={event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.event_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, transparent 60%)'
        }} />

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <span className={`badge ${badgeClass}`}>
            {event.category}
          </span>
        </div>

        {/* Smart Recommendation Tag if applicable */}
        {event.recommendation_score > 2 && (
          <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
            <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.3)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.5)' }}>
              <Sparkles size={12} /> Recommended
            </span>
          </div>
        )}

        {/* Registration status banner if registered */}
        {isRegistered && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '14px',
            background: 'rgba(16, 185, 129, 0.25)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            color: '#34d399',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <CheckCircle size={13} /> You're Confirmed
          </div>
        )}

        {isWaitlisted && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '14px',
            background: 'rgba(245, 158, 11, 0.25)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            color: '#fcd34d',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <AlertCircle size={13} /> Waitlist #{waitlistPos || 1}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          marginBottom: '10px',
          lineHeight: 1.3
        }}>
          {event.event_name}
        </h3>

        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          marginBottom: '18px',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </p>

        {/* Event Meta Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '20px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={15} color="#3b82f6" />
            <span style={{ color: 'var(--text-primary)' }}>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="#8b5cf6" />
            <span>
              {event.start_time?.slice(0, 5)} – {event.end_time?.slice(0, 5)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} color="#06b6d4" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Capacity / Seats Pill */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seat Status</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isFull ? '#f59e0b' : '#34d399' }}>
              {isFull ? 'Event Full (Waitlist Open)' : `${availableSeats} Seats Left`}
            </div>
          </div>

          {/* Action Button */}
          {event.is_frozen ? (
            <button
              disabled
              className="btn-secondary"
              style={{
                fontSize: '0.82rem',
                padding: '8px 14px',
                opacity: 0.6,
                cursor: 'not-allowed',
                color: '#f87171',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              Registrations Closed
            </button>
          ) : isAdmin ? (
            <button
              onClick={() => onManage ? onManage(event) : null}
              className="btn-secondary"
              style={{
                fontSize: '0.82rem',
                padding: '8px 14px',
                borderColor: 'rgba(99, 102, 241, 0.4)',
                color: '#a5b4fc',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Settings size={14} /> Manage Event
            </button>
          ) : isRegistered || isWaitlisted ? (
            <button
              onClick={() => onViewDetails(event)}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              View Ticket
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className={isFull ? 'btn-secondary' : 'btn-primary'}
              style={{
                fontSize: '0.82rem',
                padding: '8px 16px',
                borderColor: isFull ? 'rgba(245, 158, 11, 0.4)' : undefined,
                color: isFull ? '#fcd34d' : undefined
              }}
            >
              {isFull ? 'Join Waitlist' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
