import { useState, useEffect } from "react";
import AddJob from "./AddJob";
import JobCard from "./JobCard";
import StatsChart from "./StatsChart";
import { exportToCSV } from "../utils/exportCSV";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username") || "there";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/jobs`, { headers });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/jobs/stats`, { headers });
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const refresh = async () => {
    await Promise.all([fetchJobs(), fetchStats()]);
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const filtered = jobs
    .filter((j) => filter === "All" || j.status === filter)
    .filter(
      (j) =>
        j.company_name.toLowerCase().includes(search.toLowerCase()) ||
        j.job_role.toLowerCase().includes(search.toLowerCase()),
    );

  const statusCounts = ["Applied", "Interview", "Offer", "Rejected"].reduce(
    (acc, st) => {
      acc[st] = jobs.filter((j) => j.status === st).length;
      return acc;
    },
    {},
  );

  const statuses = ["All", "Applied", "Interview", "Offer", "Rejected"];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F3F4F6",
        }}
      >
        <div style={{ textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <span style={s.logo}>🎯 Job Tracker</span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={s.greeting}>
            Hi, <strong>{username}</strong>
          </span>
          <button style={s.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={s.container}>
        {/* Top bar */}
        <div style={s.topBar}>
          <div>
            <h2 style={s.heading}>My Applications</h2>
            <p style={s.subheading}>
              {jobs.length} total application{jobs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={s.actions}>
            <button style={s.toggleBtn} onClick={() => setShowChart((p) => !p)}>
              {showChart ? "📊 Hide Analytics" : "📊 Show Analytics"}
            </button>
            <button style={s.exportBtn} onClick={() => exportToCSV(jobs)}>
              ⬇ Export CSV
            </button>
            <button style={s.addBtn} onClick={() => setShowAdd(true)}>
              + Add Job
            </button>
          </div>
        </div>

        {/* Analytics */}
        {showChart && jobs.length > 0 && (
          <StatsChart stats={stats} jobs={jobs} />
        )}

        {/* Empty state for analytics */}
        {showChart && jobs.length === 0 && (
          <div style={s.emptyAnalytics}>
            <p style={{ fontSize: "36px" }}>📊</p>
            <p style={{ fontWeight: 600, color: "#374151" }}>
              Analytics will appear here
            </p>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              Add your first job application to get started
            </p>
          </div>
        )}

        {/* Search + Filters */}
        <div style={s.controls}>
          <input
            style={s.search}
            placeholder="🔍  Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={s.filterRow}>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  ...s.filterBtn,
                  background: filter === st ? "#1F4E79" : "white",
                  color: filter === st ? "white" : "#374151",
                  borderColor: filter === st ? "#1F4E79" : "#E5E7EB",
                }}
              >
                {st}
                {st !== "All" && (
                  <span
                    style={{
                      ...s.countBadge,
                      background:
                        filter === st ? "rgba(255,255,255,0.25)" : "#F3F4F6",
                      color: filter === st ? "white" : "#6B7280",
                    }}
                  >
                    {statusCounts[st]}
                  </span>
                )}
                {st === "All" && (
                  <span
                    style={{
                      ...s.countBadge,
                      background:
                        filter === st ? "rgba(255,255,255,0.25)" : "#F3F4F6",
                      color: filter === st ? "white" : "#6B7280",
                    }}
                  >
                    {jobs.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <p style={{ fontSize: "48px" }}>📭</p>
            <p style={{ fontWeight: 600, color: "#374151", fontSize: "16px" }}>
              {jobs.length === 0 ? "No applications yet" : "No results found"}
            </p>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              {jobs.length === 0
                ? 'Click "+ Add Job" to track your first application'
                : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              headers={headers}
              onUpdate={refresh}
            />
          ))
        )}
      </div>

      {showAdd && (
        <AddJob
          headers={headers}
          onClose={() => setShowAdd(false)}
          onAdd={() => {
            refresh();
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F3F4F6" },
  navbar: {
    background: "white",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: { fontWeight: 800, fontSize: "20px", color: "#1F4E79" },
  greeting: { color: "#6B7280", fontSize: "14px" },
  logoutBtn: {
    padding: "7px 16px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "28px 20px" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
  },
  heading: { margin: 0, color: "#111827", fontSize: "24px", fontWeight: 800 },
  subheading: { color: "#6B7280", fontSize: "14px", marginTop: "4px" },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  toggleBtn: {
    padding: "9px 16px",
    background: "#EEF2FF",
    color: "#4338CA",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
  exportBtn: {
    padding: "9px 16px",
    background: "#ECFDF5",
    color: "#065F46",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
  addBtn: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, #1F4E79, #2E86AB)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  },
  emptyAnalytics: {
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    marginBottom: "24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  controls: { marginBottom: "20px" },
  search: {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "15px",
    marginBottom: "14px",
    background: "white",
    outline: "none",
  },
  filterRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: {
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1.5px solid",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all .15s",
  },
  countBadge: {
    borderRadius: "10px",
    padding: "1px 7px",
    fontSize: "12px",
    fontWeight: 700,
  },
  empty: {
    textAlign: "center",
    padding: "70px 0",
    color: "#9CA3AF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
};

export default Dashboard;
