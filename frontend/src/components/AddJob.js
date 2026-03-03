import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AddJob({ onClose, onAdd }) {
  const [form, setForm] = useState({
    company_name: "",
    job_role: "",
    job_url: "",
    status: "Applied",
    applied_date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.company_name || !form.job_role || !form.applied_date) {
      return setError("Company name, job role, and date are required.");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return setError("You are not logged in.");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.error || "Failed to add job.");
      }

      onAdd(data);
      onClose();
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={s.modal}>
        <div style={s.header}>
          <h3 style={s.title}>Add New Application</h3>
          <button style={s.close} onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <input
          style={s.input}
          name="company_name"
          placeholder="Company Name"
          value={form.company_name}
          onChange={handle}
        />
        <input
          style={s.input}
          name="job_role"
          placeholder="Job Role"
          value={form.job_role}
          onChange={handle}
        />
        <input
          style={s.input}
          name="job_url"
          placeholder="Job URL"
          value={form.job_url}
          onChange={handle}
        />
        <input
          style={s.input}
          type="date"
          name="applied_date"
          value={form.applied_date}
          onChange={handle}
        />

        <select
          style={s.input}
          name="status"
          value={form.status}
          onChange={handle}
        >
          {["Applied", "Interview", "Offer", "Rejected"].map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <textarea
          style={{ ...s.input, height: "80px" }}
          name="notes"
          value={form.notes}
          onChange={handle}
        />

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "+ Add Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  title: { margin: 0 },
  close: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  cancelBtn: { padding: "8px 12px" },
  submitBtn: {
    padding: "8px 12px",
    background: "#1F4E79",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
  error: {
    background: "#ffe5e5",
    padding: "8px",
    marginBottom: "10px",
    color: "red",
  },
};

export default AddJob;
