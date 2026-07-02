import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShield, FiAlertCircle } from 'react-icons/fi';

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setError('');

    try {
      const res = await axios.post('/api/scan', { targetUrl: url });
      
      // Navigate to results page with report ID
      if (res.data.success) {
        navigate(`/report/${res.data.data.reportId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan URL. Ensure the backend is running and the URL is reachable.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">New Security Scan</h1>
        <p className="text-gray-400">Enter a website URL to analyze its security posture, headers, and SSL certificate.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        {isScanning && (
          <div className="absolute inset-0 bg-primary-dark/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Target...</h3>
            <p className="text-gray-300 text-sm">Gathering headers, cookies, SSL info, and generating AI report.</p>
            <p className="text-brand-cyan text-xs mt-2">This may take up to 30 seconds.</p>
          </div>
        )}

        <form onSubmit={handleScan}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start">
              <FiAlertCircle className="mt-1 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500 text-xl" />
              </div>
              <input 
                type="text" 
                placeholder="https://example.com"
                className="w-full bg-primary-dark border border-gray-600 rounded-xl py-4 pl-12 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !url}
              className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
            >
              <FiShield className="mr-2" /> Start Scan
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-700">
          <div>
            <h4 className="font-bold text-white mb-2">Deep Analysis</h4>
            <p className="text-sm text-gray-400">Scans HTTP security headers, cookies flags, and identifies missed configurations.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">SSL/TLS Checks</h4>
            <p className="text-sm text-gray-400">Verifies certificate validity, issuer, and protocol strength.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">AI Insights</h4>
            <p className="text-sm text-gray-400">Provides an executive summary and maps findings to the OWASP Top 10.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
