import { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AddJob({ headers, onClose, onAdd }) {
  const [form, setForm] = useState({
    company_name: '', job_role: '', job_url: '',
    status: 'Applied', applied_date: new Date().toISOString().slice(0, 10), notes: ''
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.company_name || !form.job_role || !form.applied_date)
      return setError('Company name, job role, and date are required.');

    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/jobs`, {
        method:  'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      onAdd(data);
    } catch {
      setError('Failed to add job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <h3 style={s.title}>Add New Application</h3>
          <button style={s.close} onClick={onClose}>✕</button>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Company Name *</label>
            <input style={s.input} name="company_name"
              placeholder="e.g. Infosys, Wipro, TCS" value={form.company_name} onChange={handle} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Job Role *</label>
            <input style={s.input} name="job_role"
              placeholder="e.g. React Developer" value={form.job_role} onChange={handle} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Job URL</label>
            <input style={s.input} name="job_url" type="url"
              placeholder="https://..." value={form.job_url} onChange={handle} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Applied Date *</label>
            <input style={s.input} type="date" name="applied_date"
              value={form.applied_date} onChange={handle} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Status</label>
            <select style={s.input} name="status" value={form.status} onChange={handle}>
              {['Applied', 'Interview', 'Offer', 'Rejected'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ ...s.field, marginTop: '4px' }}>
          <label style={s.label}>Notes (interview date, salary, contact, etc.)</label>
          <textarea style={{ ...s.input, height: '80px', resize: 'vertical' }}
            name="notes" placeholder="e.g. Interview scheduled for March 15, ₹6 LPA offered..."
            value={form.notes} onChange={handle} />
        </div>

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : '+ Add Application'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay:   { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal:     { background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title:     { margin: 0, color: '#1F4E79', fontSize: '20px', fontWeight: 700 },
  close:     { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 },
  grid:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field:     { display: 'flex', flexDirection: 'column' },
  label:     { fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  input:     { padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%' },
  actions:   { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  cancelBtn: { padding: '10px 20px', border: '1.5px solid #D1D5DB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  submitBtn: { padding: '10px 24px', background: 'linear-gradient(135deg, #1F4E79, #2E86AB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' },
  error:     { background: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
};

export default AddJob;
