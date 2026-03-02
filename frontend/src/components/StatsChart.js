import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const STATUS_COLORS = {
  Applied:   '#3B82F6',
  Interview: '#F59E0B',
  Offer:     '#10B981',
  Rejected:  '#EF4444',
};

function StatsChart({ stats, jobs }) {
  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
  const counts   = statuses.map(s => {
    const found = stats.find(x => x.status === s);
    return found ? found.count : 0;
  });

  const total         = jobs.length;
  const interviews    = counts[1];
  const offers        = counts[2];
  const interviewRate = total      ? Math.round((interviews / total)      * 100) : 0;
  const offerRate     = interviews ? Math.round((offers     / interviews) * 100) : 0;

  // Pie chart
  const pieData = {
    labels:   statuses,
    datasets: [{
      data:            counts,
      backgroundColor: statuses.map(s => STATUS_COLORS[s]),
      borderColor:     'white',
      borderWidth:     3,
    }]
  };

  // Bar chart — apps per month
  const monthMap = {};
  jobs.forEach(job => {
    const month = job.applied_date?.slice(0, 7);
    if (month) monthMap[month] = (monthMap[month] || 0) + 1;
  });
  const sortedMonths = Object.keys(monthMap).sort();
  const monthLabels  = sortedMonths.map(m => {
    const [y, mo] = m.split('-');
    return new Date(y, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
  });

  const barData = {
    labels:   monthLabels,
    datasets: [{
      label:           'Applications',
      data:            sortedMonths.map(m => monthMap[m]),
      backgroundColor: '#1F4E79',
      borderRadius:    6,
    }]
  };

  const kpis = [
    { label: 'Total Applied',   value: total,            color: '#1F4E79' },
    { label: 'Interviews',      value: interviews,        color: '#F59E0B' },
    { label: 'Offers',          value: offers,            color: '#10B981' },
    { label: 'Interview Rate',  value: `${interviewRate}%`, color: '#6366F1' },
    { label: 'Offer Rate',      value: `${offerRate}%`,     color: '#EC4899' },
  ];

  return (
    <div style={s.wrapper}>
      {/* KPI Cards */}
      <div style={s.kpiRow}>
        {kpis.map(k => (
          <div key={k.label} style={s.kpiCard}>
            <div style={{ ...s.kpiValue, color: k.color }}>{k.value}</div>
            <div style={s.kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={s.chartRow}>
        <div style={s.chartBox}>
          <Pie data={pieData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title:  { display: true, text: 'Status Breakdown', font: { size: 14, weight: '600' } }
            }
          }} />
        </div>
        <div style={s.chartBox}>
          {sortedMonths.length > 0 ? (
            <Bar data={barData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title:  { display: true, text: 'Applications Per Month', font: { size: 14, weight: '600' } }
              },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }} />
          ) : (
            <div style={s.emptyChart}>
              <p style={{ fontSize: '32px' }}>📅</p>
              <p>Add more applications to see monthly trends</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper:    { marginBottom: '32px' },
  kpiRow:     { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' },
  kpiCard:    { background: 'white', borderRadius: '12px', padding: '18px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', flex: '1', minWidth: '110px', textAlign: 'center' },
  kpiValue:   { fontSize: '30px', fontWeight: 800, lineHeight: 1 },
  kpiLabel:   { fontSize: '12px', color: '#6B7280', marginTop: '6px', fontWeight: 500 },
  chartRow:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  chartBox:   { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  emptyChart: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9CA3AF', gap: '8px' },
};

export default StatsChart;
