import React, { useState } from 'react';
import { QrCode, Scan, CheckCircle2, AlertCircle, X, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function QRScannerModal({ onClose, onScanSuccess }) {
  const { token } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (scannedToken) => {
    const code = scannedToken || tokenInput;
    if (!code || !code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ qr_code_token: code.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Scan verification failed.');
      } else {
        setResult(data);
        if (!data.already_checked_in) {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
        if (onScanSuccess) onScanSuccess();
      }
    } catch (err) {
      setError('Failed to reach attendance service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scan size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Venue Gate QR Scanner</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scan attendee QR passes or enter ticket ID for gate check-in
            </p>
          </div>
        </div>

        {/* Viewfinder Target */}
        <div style={{
          border: '2px dashed rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '28px 20px',
          textAlign: 'center',
          marginBottom: '20px',
          background: 'rgba(59, 130, 246, 0.03)'
        }}>
          <QrCode size={48} color="#60a5fa" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.8 }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Point handheld barcode reader or enter QR ticket code below
          </p>

          {/* Input Box */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <input
              type="text"
              placeholder="e.g. QR-EVT1-USR2-XXXXX"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              className="form-input"
              style={{ textAlign: 'center', fontFamily: 'monospace' }}
              autoFocus
            />
            <button
              onClick={() => handleScan()}
              disabled={loading || !tokenInput.trim()}
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Scan size={16} /> {loading ? 'Scanning...' : 'Verify'}
            </button>
          </div>
        </div>

        {/* Scan Result */}
        {result && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <CheckCircle2 size={24} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                {result.message}
              </div>
              {result.attendee && (
                <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '6px' }}>
                  <strong>Attendee:</strong> {result.attendee.name} ({result.attendee.department})<br />
                  <strong>Event:</strong> {result.attendee.event_name}<br />
                  <strong>Checked in at:</strong> {new Date(result.attendee.check_in_time).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error / Alert */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircle size={24} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ color: '#fda4af', fontSize: '0.88rem', fontWeight: 600 }}>
              {error}
            </div>
          </div>
        )}

        {/* Footer */}
        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ width: '100%', padding: '10px' }}
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
}
