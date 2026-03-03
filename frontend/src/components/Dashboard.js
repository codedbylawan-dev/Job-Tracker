import { useState, useEffect } from "react";
import AddJob from "./AddJob";
import JobCard from "./JobCard";
import StatsChart from "./StatsChart";
import { exportToCSV } from "../utils/exportCSV";

const API = import.meta.env.VITE_API_URL;

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

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/jobs`, { headers });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch jobs error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/jobs/stats`, { headers });
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  const refresh = async () => {
    await Promise.all([fetchJobs(), fetchStats()]);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    (async () => {
      await refresh();
      setLoading(false);
    })();
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
      <div style={s.loaderPage}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <span style={s.logo}>🎯 Job Tracker</span>
        <div style={s.navRight}>
          <span>
            Hi, <strong>{username}</strong>
          </span>
          <button style={s.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.topBar}>
          <div>
            <h2 style={s.heading}>My Applications</h2>
            <p style={s.subheading}>
              {jobs.length} total application{jobs.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div style={s.actions}>
            <button style={s.toggleBtn} onClick={() => setShowChart((p) => !p)}>
              {showChart ? "Hide Analytics" : "Show Analytics"}
            </button>
            <button style={s.exportBtn} onClick={() => exportToCSV(jobs)}>
              Export CSV
            </button>
            <button style={s.addBtn} onClick={() => setShowAdd(true)}>
              + Add Job
            </button>
          </div>
        </div>

        {showChart && jobs.length > 0 && (
          <StatsChart stats={stats} jobs={jobs} />
        )}

        <div style={s.controls}>
          <input
            style={s.search}
            placeholder="Search by company or role..."
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
                }}
              >
                {st}
                <span style={s.countBadge}>
                  {st === "All" ? jobs.length : statusCounts[st]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <p>No applications found.</p>
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
  loaderPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    background: "white",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navRight: { display: "flex", gap: "16px", alignItems: "center" },
  logo: { fontWeight: 800, fontSize: "20px", color: "#1F4E79" },
  logoutBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "28px 20px" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  heading: { margin: 0 },
  subheading: { color: "#6B7280", fontSize: "14px" },
  actions: { display: "flex", gap: "10px" },
  toggleBtn: { padding: "8px 12px" },
  exportBtn: { padding: "8px 12px" },
  addBtn: {
    padding: "8px 16px",
    background: "#1F4E79",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
  controls: { marginBottom: "20px" },
  search: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  filterRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
    display: "flex",
    gap: "6px",
  },
  countBadge: {
    fontSize: "12px",
    background: "#eee",
    padding: "2px 6px",
    borderRadius: "10px",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#6B7280",
  },
};

export default Dashboard;
