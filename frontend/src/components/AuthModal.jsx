import React, { useState } from 'react';
import { X, UserPlus, LogIn, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'register' }) {
  const { login, registerUser } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'register' | 'login'

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'CMPN',
    interests: 'AI, Machine Learning, Cloud'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const success = await registerUser(formData);
        if (success) {
          onClose();
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = ['CMPN', 'IT', 'EXTC', 'AIDS', 'ETRX'];

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

        {/* Tab Header */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
          <button
            onClick={() => setMode('register')}
            className={mode === 'register' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <UserPlus size={16} />
            Student Sign Up
          </button>
          <button
            onClick={() => setMode('login')}
            className={mode === 'login' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <LogIn size={16} />
            User Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aryan Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              College Email ID
            </label>
            <input
              type="email"
              required
              placeholder="e.g. student@vesit.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your secure password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
            />
          </div>

          {mode === 'register' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-field"
                  >
                    {departments.map(d => (
                      <option key={d} value={d} style={{ background: '#1e293b' }}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Account Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field"
                  >
                    <option value="student" style={{ background: '#1e293b' }}>Attendee / Student</option>
                    <option value="scanner" style={{ background: '#1e293b' }}>Gate Scanner Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Technical / Cultural Interests
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI, Cloud, Cybersecurity, Hackathon"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
          >
            {isSubmitting
              ? 'Processing...'
              : (mode === 'register' ? 'Create Account & Start Booking' : 'Sign In to Portal')}
          </button>
        </form>
      </div>
    </div>
  );
}
