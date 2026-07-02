import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiActivity, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/scans');
      setScans(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = scans.length > 0 
    ? Math.round(scans.reduce((acc, curr) => acc + curr.score, 0) / scans.length)
    : 0;

  const chartData = {
    labels: [...scans].reverse().map(s => new Date(s.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Security Score over Time',
        data: [...scans].reverse().map(s => s.score),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: 'gray' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { ticks: { color: 'gray' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Security Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">Total Scans</p>
            <p className="text-3xl font-bold text-white">{scans.length}</p>
          </div>
          <div className="bg-brand-blue/20 p-3 rounded-lg text-brand-blue">
            <FiActivity size={24} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-white">{avgScore}</p>
          </div>
          <div className="bg-brand-cyan/20 p-3 rounded-lg text-brand-cyan">
            <FiShield size={24} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">Status</p>
            <p className="text-2xl font-bold text-white">
              {avgScore > 80 ? 'Excellent' : avgScore > 50 ? 'Fair' : avgScore === 0 ? 'N/A' : 'Poor'}
            </p>
          </div>
          <div className={`${avgScore > 80 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'} p-3 rounded-lg`}>
            {avgScore > 80 ? <FiCheckCircle size={24} /> : <FiAlertTriangle size={24} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Score Trends</h2>
          {scans.length > 0 ? (
             <Line options={chartOptions} data={chartData} />
          ) : (
            <div className="text-gray-400 text-center py-10">No scan data available to generate chart.</div>
          )}
        </div>

        {/* History */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Recent Scans</h2>
          {scans.length === 0 ? (
            <p className="text-gray-400">No scans found.</p>
          ) : (
            <div className="space-y-4">
              {scans.slice(0, 5).map(scan => (
                <div key={scan._id} className="border-b border-gray-700 pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium truncate max-w-[150px] block" title={scan.url}>{scan.url}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${scan.score >= 80 ? 'bg-green-500/20 text-green-400' : scan.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {scan.score}/100
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex justify-between">
                    <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
