require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes  = require('./routes/jobs');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running ✅', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
