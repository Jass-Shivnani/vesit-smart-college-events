import React from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle2, Award, Building2 } from 'lucide-react';

export default function AnalyticsCharts({ analyticsData }) {
  if (!analyticsData || !analyticsData.metrics) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}>📊 Fetching Real-Time Analytics...</div>
        <p style={{ fontSize: '0.85rem' }}>Synchronizing event registrations and gate attendance records.</p>
      </div>
    );
  }

  const metrics = analyticsData.metrics || {};
  const eventBreakdown = analyticsData.event_breakdown || analyticsData.eventBreakdown || [];
  const departmentBreakdown = analyticsData.department_breakdown || analyticsData.departmentBreakdown || [];

  const maxEventRegistrations = eventBreakdown.length > 0
    ? Math.max(...eventBreakdown.map(e => (Number(e.confirmed) || 0) + (Number(e.waitlisted) || 0)), 1)
    : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Registrations
            </span>
            <Users size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>
            {metrics?.total_registrations || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', marginTop: '4px' }}>
            {metrics?.total_confirmed || 0} Confirmed • {metrics?.total_waitlisted || 0} Waitlisted
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Avg Attendance Rate
            </span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
            {metrics?.overall_attendance_rate || 0}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {metrics?.total_present || 0} Students Checked In
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Most Popular Event
            </span>
            <Award size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={metrics?.most_popular_event}>
            {metrics?.most_popular_event || 'AI Workshop'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a78bfa', marginTop: '4px' }}>
            Highest Student Demand
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Top Department
            </span>
            <Building2 size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#67e8f9' }}>
            {metrics?.highest_participating_dept || 'CMPN'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Highest Engagement
          </div>
        </div>
      </div>

      {/* Visual Bar Graph: Registrations per Event */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <BarChart3 size={20} color="#3b82f6" />
          <h3 style={{ fontSize: '1.15rem' }}>Event Registration & Attendance Analytics</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {eventBreakdown.map(ev => {
            const confirmedWidth = Math.min(100, Math.round((ev.confirmed / maxEventRegistrations) * 100));
            const presentWidth = ev.confirmed > 0 ? Math.round((ev.present / ev.confirmed) * 100) : 0;

            return (
              <div key={ev.event_id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600 }}>{ev.event_name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Confirmed: <strong style={{ color: '#60a5fa' }}>{ev.confirmed}</strong>/{ev.capacity} | Present: <strong style={{ color: '#34d399' }}>{ev.present}</strong> ({ev.attendance_rate}%)
                    {ev.waitlisted > 0 && <span style={{ color: '#f59e0b', marginLeft: '6px' }}>(Waitlist: {ev.waitlisted})</span>}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex'
                }}>
                  <div
                    style={{
                      width: `${confirmedWidth}%`,
                      background: ev.fill_rate >= 100 ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : '#3b82f6',
                      borderRadius: '6px',
                      transition: 'width 0.5s ease-out'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <TrendingUp size={20} color="#10b981" />
          <h3 style={{ fontSize: '1.15rem' }}>Department Participation Distribution</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {departmentBreakdown.map((dept, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                {dept.department}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, marginTop: '4px' }}>
                {dept.count} Registrations ({dept.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
