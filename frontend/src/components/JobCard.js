import { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STATUS_STYLE = {
  Applied:   { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  Interview: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  Offer:     { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  Rejected:  { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
};

function JobCard({ job, headers, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({ ...job });
  const [loading, setLoading] = useState(false);

  const style = STATUS_STYLE[job.status] || STATUS_STYLE.Applied;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/jobs/${job.id}`, {
        method:  'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify(form)
      });
      if (res.ok) { setEditing(false); onUpdate(); }
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete application to ${job.company_name}?`)) return;
    await fetch(`${API}/jobs/${job.id}`, { method: 'DELETE', headers });
    onUpdate();
  };

  const quickStatus = async (newStatus) => {
    await fetch(`${API}/jobs/${job.id}`, {
      method:  'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...job, status: newStatus })
    });
    onUpdate();
  };

  // Edit mode
  if (editing) {
    return (
      <div style={s.card}>
        <div style={s.editGrid}>
          {[
            ['company_name', 'Company Name', 'text'],
            ['job_role',     'Job Role',     'text'],
            ['job_url',      'Job URL',      'url'],
            ['applied_date', 'Applied Date', 'date'],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label style={s.label}>{label}</label>
              <input style={s.input} type={type} name={name}
                value={form[name] || ''}
                onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} />
            </div>
          ))}
          <div>
            <label style={s.label}>Status</label>
            <select style={s.input} value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              {['Applied', 'Interview', 'Offer', 'Rejected'].map(st => (
                <option key={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <label style={s.label}>Notes</label>
          <textarea style={{ ...s.input, width: '100%', height: '72px', resize: 'vertical' }}
            value={form.notes || ''}
            onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <button style={s.saveBtn} onClick={handleUpdate} disabled={loading}>
            {loading ? 'Saving...' : '✓ Save'}
          </button>
          <button style={s.cancelBtn} onClick={() => { setEditing(false); setForm({ ...job }); }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div style={{ ...s.card, borderLeft: `4px solid ${style.border}` }}>
      <div style={s.top}>
        <div style={{ flex: 1 }}>
          <div style={s.company}>{job.company_name}</div>
          <div style={s.role}>{job.job_role}</div>
          {job.job_url && (
            <a href={job.job_url} target="_blank" rel="noreferrer" style={s.url}>
              View Job Posting ↗
            </a>
          )}
        </div>
        <div style={s.right}>
          <span style={{ ...s.badge, background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
            {job.status}
          </span>
          <div style={s.date}>📅 {job.applied_date}</div>
        </div>
      </div>

      {job.notes && (
        <div style={s.notes}>📝 {job.notes}</div>
      )}

      <div style={s.bottom}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Applied', 'Interview', 'Offer', 'Rejected']
            .filter(st => st !== job.status)
            .map(st => (
              <button key={st} style={s.moveBtn} onClick={() => quickStatus(st)}>
                → {st}
              </button>
            ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={s.editBtn}   onClick={() => setEditing(true)}>Edit</button>
          <button style={s.deleteBtn} onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card:      { background: 'white', borderRadius: '12px', padding: '20px 22px', marginBottom: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  top:       { display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' },
  company:   { fontSize: '17px', fontWeight: 700, color: '#1F4E79', marginBottom: '3px' },
  role:      { fontSize: '14px', color: '#374151', marginBottom: '4px' },
  url:       { fontSize: '13px', color: '#2E86AB' },
  right:     { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  badge:     { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' },
  date:      { fontSize: '12px', color: '#9CA3AF' },
  notes:     { fontSize: '13px', color: '#6B7280', background: '#F9FAFB', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px' },
  bottom:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' },
  moveBtn:   { padding: '4px 10px', fontSize: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'white', cursor: 'pointer', color: '#374151' },
  editBtn:   { padding: '6px 14px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  deleteBtn: { padding: '6px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', cursor: 'pointer', color: '#DC2626', fontWeight: 600, fontSize: '13px' },
  editGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label:     { display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' },
  input:     { width: '100%', padding: '8px 10px', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  saveBtn:   { padding: '8px 20px', background: '#1F4E79', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 },
  cancelBtn: { padding: '8px 16px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
};

export default JobCard;
