export function exportToCSV(jobs) {
  if (!jobs || jobs.length === 0) {
    alert('No jobs to export.');
    return;
  }

  const headers = ['Company Name', 'Job Role', 'Status', 'Applied Date', 'Job URL', 'Notes'];

  const rows = jobs.map(job => [
    `"${job.company_name  || ''}"`,
    `"${job.job_role      || ''}"`,
    `"${job.status        || ''}"`,
    `"${job.applied_date  || ''}"`,
    `"${job.job_url       || ''}"`,
    `"${(job.notes        || '').replace(/"/g, "'")}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob       = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url        = URL.createObjectURL(blob);
  const link       = document.createElement('a');

  link.href     = url;
  link.download = `job_applications_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
