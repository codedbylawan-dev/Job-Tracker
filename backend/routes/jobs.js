const express = require("express");
const auth = require("../middleware/auth");
const db = require("../database");

const router = express.Router();

const VALID_STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

// ── GET all jobs ─────────────────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await db
      .prepare("SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC")
      .all(req.user.id);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
});

// ── GET stats ────────────────────────────────────────────────
router.get("/stats", auth, async (req, res) => {
  try {
    const stats = await db
      .prepare(
        `
      SELECT status, COUNT(*) as count
      FROM jobs
      WHERE user_id = ?
      GROUP BY status
    `,
      )
      .all(req.user.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// ── POST add job ─────────────────────────────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const { company_name, job_role, job_url, status, applied_date, notes } =
      req.body;

    if (!company_name || !job_role || !applied_date)
      return res
        .status(400)
        .json({
          error: "Company name, job role, and applied date are required.",
        });

    const jobStatus = VALID_STATUSES.includes(status) ? status : "Applied";

    const result = await db
      .prepare(
        `
      INSERT INTO jobs (user_id, company_name, job_role, job_url, status, applied_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        req.user.id,
        company_name.trim(),
        job_role.trim(),
        job_url || "",
        jobStatus,
        applied_date,
        notes || "",
      );

    const newJob = await db
      .prepare("SELECT * FROM jobs WHERE id = ?")
      .get(result.lastID);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to add job." });
  }
});

// ── PUT update job ───────────────────────────────────────────
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await db
      .prepare("SELECT id FROM jobs WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!job) return res.status(404).json({ error: "Job not found." });

    const { company_name, job_role, job_url, status, applied_date, notes } =
      req.body;

    if (!company_name || !job_role || !applied_date)
      return res
        .status(400)
        .json({
          error: "Company name, job role, and applied date are required.",
        });

    const jobStatus = VALID_STATUSES.includes(status) ? status : "Applied";

    await db
      .prepare(
        `
      UPDATE jobs
      SET company_name = ?, job_role = ?, job_url = ?,
          status = ?, applied_date = ?, notes = ?
      WHERE id = ?
    `,
      )
      .run(
        company_name.trim(),
        job_role.trim(),
        job_url || "",
        jobStatus,
        applied_date,
        notes || "",
        req.params.id,
      );

    const updated = await db
      .prepare("SELECT * FROM jobs WHERE id = ?")
      .get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update job." });
  }
});

// ── DELETE job ───────────────────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await db
      .prepare("SELECT id FROM jobs WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!job) return res.status(404).json({ error: "Job not found." });

    await db.prepare("DELETE FROM jobs WHERE id = ?").run(req.params.id);
    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job." });
  }
});

module.exports = router;
