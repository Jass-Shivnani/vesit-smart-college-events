import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, CheckCircle2, Clock, MapPin, Calendar, ShieldCheck, Printer, Download, Sparkles } from 'lucide-react';

export default function QRModal({ registration, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (registration && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        registration.qr_code_token || `TICKET-${registration.registration_id}`,
        {
          width: 200,
          margin: 1,
          color: {
            dark: '#020617',
            light: '#ffffff'
          }
        },
        (err) => {
          if (err) console.error('QR Render error', err);
        }
      );
    }
  }, [registration]);

  if (!registration) return null;

  const isPresent = registration.attendance_status === 'present';
  const isWaitlist = registration.status === 'waitlisted';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog-content" 
        style={{ padding: '0', overflow: 'hidden', maxWidth: '420px', background: 'transparent', border: 'none', boxShadow: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Bottom Sheet Handle */}
        <div className="sheet-drag-handle" style={{ marginBottom: '12px' }} />

        {/* BookMyShow-style Notch Cut Ticket Container */}
        <div style={{
          background: '#141923',
          borderRadius: '24px',
          border: '1px solid var(--border-card)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(244, 63, 94, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Top Ticket Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #be123c, #f43f5e)',
            padding: '22px 20px 18px',
            color: '#fff',
            position: 'relative'
          }}>
            {/* Close Button Inside Header */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.2)',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(4px)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                CAMPUS PASS
              </span>

              <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 600 }}>
                #{registration.registration_id}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '6px', paddingRight: '36px' }}>
              {registration.event_name}
            </h2>

            <div style={{ fontSize: '0.82rem', opacity: 0.92, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} />
              <span>{registration.venue || 'Auditorium Hall A'}</span>
            </div>
          </div>

          {/* Middle Details Grid */}
          <div style={{ padding: '20px 24px', background: '#141923' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  DATE &amp; DAY
                </span>
                <strong style={{ color: '#f8fafc' }}>{registration.date || '2026-09-25'}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  TIME SLOT
                </span>
                <strong style={{ color: '#f8fafc' }}>
                  {registration.start_time?.slice(0, 5) || '10:00'} - {registration.end_time?.slice(0, 5) || '12:00'}
                </strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  ATTENDEE
                </span>
                <strong style={{ color: '#f8fafc' }}>{registration.student_name || 'Riya Khialani'}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  DEPARTMENT
                </span>
                <strong style={{ color: '#fb7185' }}>{registration.department || 'CMPN'}</strong>
              </div>
            </div>
          </div>

          {/* Perforated Notch Divider */}
          <div style={{ position: 'relative', height: '28px', background: '#141923', display: 'flex', alignItems: 'center' }}>
            {/* Left Notch Circle */}
            <div style={{
              position: 'absolute',
              left: '-14px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--bg-app)',
              borderRight: '1px solid var(--border-card)'
            }} />

            {/* Dashed Line */}
            <div style={{
              width: '100%',
              margin: '0 24px',
              borderTop: '2px dashed rgba(255, 255, 255, 0.15)'
            }} />

            {/* Right Notch Circle */}
            <div style={{
              position: 'absolute',
              right: '-14px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--bg-app)',
              borderLeft: '1px solid var(--border-card)'
            }} />
          </div>

          {/* Bottom QR & Barcode Section */}
          <div style={{
            padding: '16px 24px 24px',
            background: '#141923',
            textAlign: 'center'
          }}>
            {/* Status Badge */}
            <div style={{ marginBottom: '14px' }}>
              {isPresent ? (
                <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  <CheckCircle2 size={15} /> Admitted at Gate ({new Date(registration.check_in_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              ) : isWaitlist ? (
                <span className="badge badge-warning" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  Waitlist Position #{registration.waitlist_position || 1}
                </span>
              ) : (
                <span className="badge" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '6px 14px',
                  fontSize: '0.82rem'
                }}>
                  <ShieldCheck size={15} /> CONFIRMED PASS • ADMIT ONE
                </span>
              )}
            </div>

            {/* QR Code Canvas */}
            <div style={{
              background: '#ffffff',
              padding: '14px',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}>
              <canvas ref={canvasRef} style={{ display: 'block' }} />
            </div>

            {/* Barcode Token String */}
            <div style={{
              marginTop: '12px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em'
            }}>
              {registration.qr_code_token || `QR-EVT${registration.event_id}-TKT${registration.registration_id}`}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Present this QR code on your mobile phone at the venue gate for instant check-in
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Print Pass
              </button>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
