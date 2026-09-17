import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast } = useAuth();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="#34d399" />,
    error: <XCircle size={20} color="#fb7185" />,
    warning: <AlertTriangle size={20} color="#fbbf24" />,
    info: <Info size={20} color="#60a5fa" />
  };

  const borderColors = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    info: 'rgba(59, 130, 246, 0.4)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: '#131b2e',
        border: `1px solid ${borderColors[toast.type] || borderColors.info}`,
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        color: '#fff',
        maxWidth: '420px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {icons[toast.type] || icons.info}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
    </div>
  );
}
