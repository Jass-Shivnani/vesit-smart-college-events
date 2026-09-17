import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Wifi, Shield, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileGatewayModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const { showToast } = useAuth();

  // Host PC IP Address on local Wi-Fi
  const mobileUrl = 'http://192.168.1.34:3000';

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        mobileUrl,
        {
          width: 220,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (err) => {
          if (err) console.error('QR Render error', err);
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    showToast('Mobile URL copied to clipboard!', 'info');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        background: '#0f172a',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '24px',
        padding: '28px',
        position: 'relative',
        textAlign: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}>
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

        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
        }}>
          <Smartphone size={28} color="#fff" />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
          Connect Mobile Devices
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Scan this QR code with your phone camera to open the application on mobile
        </p>

        {/* QR Canvas */}
        <div style={{
          background: '#ffffff',
          padding: '14px',
          borderRadius: '18px',
          display: 'inline-block',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          marginBottom: '16px'
        }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>

        {/* IP Address Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '10px 16px',
          maxWidth: '340px',
          margin: '0 auto 18px'
        }}>
          <Wifi size={16} color="#34d399" />
          <code style={{ fontSize: '0.9rem', color: '#93c5fd', fontWeight: 600 }}>{mobileUrl}</code>
          <button
            onClick={handleCopyUrl}
            title="Copy URL"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: 'left',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '14px',
          padding: '14px 18px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} color="#34d399" />
            <span>Connect your mobile to the same Wi-Fi network as this PC.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} color="#34d399" />
            <span>Students can view their scannable BookMyShow passes on their phone.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} color="#34d399" />
            <span>Gate volunteers can use their phone's camera to scan attendee QR passes.</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', marginTop: '20px', padding: '10px' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
