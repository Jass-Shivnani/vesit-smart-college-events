import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Edit,
  Scan,
  Users,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Lock,
  Unlock,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import QRScannerModal from '../components/QRScannerModal';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage({ onOpenAuth }) {
  const { user, token, isAdmin, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'events', 'attendees'
  const [events, setEvents] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    metrics: {
      total_events: 5,
      total_registrations: 9,
      total_confirmed: 8,
      total_waitlisted: 1,
      total_present: 2,
      overall_attendance_rate: 25,
      most_popular_event: 'Cloud Native DevOps Hackathon',
      highest_participating_dept: 'CMPN'
    },
    event_breakdown: [
      { event_id: 1, event_name: 'AI & Machine Learning Workshop', category: 'Workshop', capacity: 50, confirmed: 3, waitlisted: 0, present: 2, attendance_rate: 67, fill_rate: 6 },
      { event_id: 2, event_name: 'Cybersecurity & Ethical Hacking', category: 'Workshop', capacity: 40, confirmed: 0, waitlisted: 0, present: 0, attendance_rate: 0, fill_rate: 0 },
      { event_id: 3, event_name: 'Modern Web Architecture Bootcamp', category: 'Bootcamp', capacity: 60, confirmed: 2, waitlisted: 0, present: 0, attendance_rate: 0, fill_rate: 3 },
      { event_id: 4, event_name: 'Cloud Native DevOps Hackathon', category: 'Hackathon', capacity: 3, confirmed: 3, waitlisted: 1, present: 0, attendance_rate: 0, fill_rate: 100 },
      { event_id: 5, event_name: 'VESIT Annual Tech Symphony & Cultural Eve', category: 'Cultural', capacity: 250, confirmed: 0, waitlisted: 0, present: 0, attendance_rate: 0, fill_rate: 0 }
    ],
    department_breakdown: [
      { department: 'CMPN', count: 3, percentage: 33 },
      { department: 'IT', count: 3, percentage: 33 },
      { department: 'EXTC', count: 3, percentage: 33 }
    ]
  });
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? String(dateStr) : d.toLocaleDateString();
    } catch (e) {
      return String(dateStr);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    event_name: '',
    category: 'Workshop',
    date: '2026-09-28',
    start_time: '10:00:00',
    end_time: '12:00:00',
    venue: '',
    capacity: 50,
    description: '',
    banner_image: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchAnalytics();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
        if (!selectedEventForAttendees && data.events.length > 0) {
          setSelectedEventForAttendees(data.events[0]);
          fetchAttendees(data.events[0].event_id);
        }
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.metrics) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  const fetchAttendees = async (eventId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/registrations/event/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations)) {
        setAttendees(data.registrations);
      }
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove registrations.')) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event deleted successfully.', 'info');
        fetchEvents();
        fetchAnalytics();
      }
    } catch (err) {
      showToast('Failed to delete event.', 'error');
    }
  };

  const handleToggleFreeze = async (eventId, currentFrozen) => {
    try {
      const res = await fetch(`/api/events/${eventId}/freeze`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_frozen: !currentFrozen })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchEvents();
      } else {
        showToast(data.message || 'Failed to update event status', 'error');
      }
    } catch (e) {
      showToast('Error updating event registration status', 'error');
    }
  };

  const handleExportCSV = (event) => {
    if (!attendees || attendees.length === 0) {
      showToast('No attendee records to export for this event.', 'warning');
      return;
    }

    const headers = ['Registration ID', 'Student Name', 'Email', 'Department', 'Seat Status', 'Attendance', 'Check-In Time'];
    const rows = attendees.map(a => [
      a.registration_id,
      `"${a.student_name || ''}"`,
      `"${a.student_email || ''}"`,
      `"${a.department || ''}"`,
      a.status,
      a.attendance_status,
      a.check_in_time ? `"${new Date(a.check_in_time).toLocaleString()}"` : 'Not Checked In'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vesit_attendance_${event?.event_name ? event.event_name.replace(/[^a-zA-Z0-9]/g, '_') : 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance CSV roster downloaded!', 'success');
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const isEdit = !!editingEvent;
    const url = isEdit ? `/api/events/${editingEvent.event_id}` : '/api/events';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? 'Event updated successfully.' : 'New event published!', 'success');
        setShowCreateModal(false);
        setEditingEvent(null);
        fetchEvents();
        fetchAnalytics();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Network error while saving event', 'error');
    }
  };

  const handleToggleAttendance = async (registrationId, currentStatus) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    try {
      const res = await fetch(`/api/attendance/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ attendance_status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Attendance marked as ${newStatus}.`, 'success');
        if (selectedEventForAttendees) {
          fetchAttendees(selectedEventForAttendees.event_id);
        }
        fetchAnalytics();
      }
    } catch (err) {
      showToast('Failed to update attendance', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px' }}>
          <ShieldAlert size={48} color="#fb7185" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h2>Admin Privileges Required</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>
            {user ? (
              <>You are signed in as <strong>{user.name} ({user.role})</strong>. Administrator privileges are required to manage events and view student rosters.</>
            ) : (
              <>Please sign in with an Administrator account to access this portal.</>
            )}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In to Admin Account
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px 80px' }}>
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LayoutDashboard size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Admin Management Portal</h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              VESIT Event Oversight • Real-time Capacity, Conflict &amp; Attendance Automation
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowQRScanner(true)}
            className="btn-secondary"
            style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#93c5fd' }}
          >
            <Scan size={16} /> QR Gate Scanner
          </button>

          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({
                event_name: '',
                category: 'Workshop',
                date: '2026-09-28',
                start_time: '10:00:00',
                end_time: '12:00:00',
                venue: 'Seminar Hall A',
                capacity: 50,
                description: '',
                banner_image: ''
              });
              setShowCreateModal(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} /> Add New Event
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '28px'
      }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderBottom: activeTab === 'analytics' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'analytics' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600,
            background: 'transparent'
          }}
        >
          <BarChart3 size={16} /> Analytics &amp; KPIs
        </button>

        <button
          onClick={() => setActiveTab('events')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderBottom: activeTab === 'events' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'events' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600,
            background: 'transparent'
          }}
        >
          <Calendar size={16} /> Manage Events ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('attendees')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderBottom: activeTab === 'attendees' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'attendees' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600,
            background: 'transparent'
          }}
        >
          <Users size={16} /> Registrations &amp; Attendance
        </button>
      </div>

      {/* TAB 1: Analytics */}
      {activeTab === 'analytics' && (
        <div>
          <AnalyticsCharts analyticsData={analyticsData} />
        </div>
      )}

      {/* TAB 2: Manage Events CRUD */}
      {activeTab === 'events' && (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Event Name</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Date &amp; Time</th>
                <th style={{ padding: '12px' }}>Venue</th>
                <th style={{ padding: '12px' }}>Capacity / Reg</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.event_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 600 }}>{ev.event_name}</td>
                  <td style={{ padding: '14px 12px' }}><span className="badge badge-workshop">{ev.category}</span></td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>
                    {formatDate(ev.date)}<br/>
                    <small>{ev.start_time?.slice(0,5)} - {ev.end_time?.slice(0,5)}</small>
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{ev.venue}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontWeight: 600, color: ev.registered_count >= ev.capacity ? '#f59e0b' : '#34d399' }}>
                      {ev.registered_count || 0}
                    </span> / {ev.capacity}
                    {ev.waitlist_count > 0 && <small style={{ color: '#fcd34d', display: 'block' }}>+{ev.waitlist_count} waitlist</small>}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleToggleFreeze(ev.event_id, ev.is_frozen)}
                        title={ev.is_frozen ? 'Re-open Registrations' : 'Freeze / Close Registrations'}
                        className="btn-secondary"
                        style={{
                          padding: '6px 10px',
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: ev.is_frozen ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          borderColor: ev.is_frozen ? '#ef4444' : '#10b981',
                          color: ev.is_frozen ? '#fca5a5' : '#6ee7b7'
                        }}
                      >
                        {ev.is_frozen ? <Lock size={12} /> : <Unlock size={12} />}
                        {ev.is_frozen ? 'Frozen' : 'Open'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setFormData({
                            event_name: ev.event_name,
                            category: ev.category,
                            date: new Date(ev.date).toISOString().split('T')[0],
                            start_time: ev.start_time,
                            end_time: ev.end_time,
                            venue: ev.venue,
                            capacity: ev.capacity,
                            description: ev.description || '',
                            banner_image: ev.banner_image || ''
                          });
                          setShowCreateModal(true);
                        }}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.event_id)}
                        className="btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Registrations & Attendance */}
      {activeTab === 'attendees' && (
        <div>
          {/* Select Event Filter & Export Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Select Event:</span>
              <select
                className="form-input"
                style={{ maxWidth: '380px' }}
                value={selectedEventForAttendees?.event_id || ''}
                onChange={(e) => {
                  const ev = events.find(item => item.event_id === Number(e.target.value));
                  setSelectedEventForAttendees(ev);
                  if (ev) fetchAttendees(ev.event_id);
                }}
              >
                {events.map(ev => (
                  <option key={ev.event_id} value={ev.event_id}>
                    {ev.event_name} ({formatDate(ev.date)})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleExportCSV(selectedEventForAttendees)}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '0.84rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  borderColor: '#3b82f6',
                  color: '#93c5fd'
                }}
              >
                <Download size={15} />
                Export Attendance CSV
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px' }}>
            {attendees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No students registered for this event yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Student</th>
                    <th style={{ padding: '12px' }}>Department</th>
                    <th style={{ padding: '12px' }}>Seat Status</th>
                    <th style={{ padding: '12px' }}>Attendance Status</th>
                    <th style={{ padding: '12px' }}>QR Token</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Gate Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map(item => {
                    const isPresent = item.attendance_status === 'present';
                    const isWaitlisted = item.status === 'waitlisted';

                    return (
                      <tr key={item.registration_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600 }}>{item.student_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.student_email}</div>
                        </td>
                        <td style={{ padding: '12px' }}>{item.department}</td>
                        <td style={{ padding: '12px' }}>
                          {isWaitlisted ? (
                            <span className="badge badge-waitlist">Waitlist #{item.waitlist_position}</span>
                          ) : (
                            <span className="badge badge-success">Confirmed Seat</span>
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {isPresent ? (
                            <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle size={14} /> Present
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Absent</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#93c5fd' }}>
                          {item.qr_code_token}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {!isWaitlisted && (
                            <button
                              onClick={() => handleToggleAttendance(item.registration_id, item.attendance_status)}
                              className={isPresent ? 'btn-secondary' : 'btn-primary'}
                              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                            >
                              {isPresent ? 'Mark Absent' : 'Mark Present'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div 
            className="modal-dialog-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px' }}
          >
            {/* Mobile Bottom Sheet Handle */}
            <div className="sheet-drag-handle" />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>
              {editingEvent ? 'Edit College Event' : 'Create New College Event'}
            </h3>

            <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Event Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  placeholder="e.g. Generative AI Hands-on Workshop"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Venue
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Auditorium Hall A"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details regarding prerequisites, topics, and schedule..."
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Banner Image URL (Optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.banner_image}
                  onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={() => {
            fetchAnalytics();
            if (selectedEventForAttendees) {
              fetchAttendees(selectedEventForAttendees.event_id);
            }
          }}
        />
      )}
    </div>
  );
}
