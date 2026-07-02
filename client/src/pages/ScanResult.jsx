import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiDownload, FiShield, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const ScanResult = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`/api/report/${id}`);
      setReport(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await axios.get(`/api/report/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SecureShield_Report_${report.scan.url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading PDF', err);
    }
  };

  if (loading) return <div>Loading report...</div>;
  if (!report) return <div>Report not found.</div>;

  const { scan, executiveSummary, detectedRisks } = report;
  const { results } = scan;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold mb-1">Scan Results</h1>
          <p className="text-brand-cyan text-lg">{scan.url}</p>
          <p className="text-sm text-gray-400 mt-1">Scanned on: {new Date(scan.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Security Score</p>
            <div className={`text-4xl font-bold ${scan.score >= 80 ? 'text-green-500' : scan.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {scan.score}/100
            </div>
          </div>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            <FiDownload className="mr-2" /> Download PDF
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <div className="glass-panel p-6 rounded-2xl border-l-4 border-brand-purple">
        <h2 className="text-xl font-bold mb-3 flex items-center"><FiInfo className="mr-2 text-brand-purple"/> AI Executive Summary</h2>
        <p className="text-gray-300 leading-relaxed">{executiveSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center"><FiAlertTriangle className="mr-2 text-yellow-500"/> Detected Risks</h2>
          {detectedRisks && detectedRisks.length > 0 ? (
            <div className="space-y-4">
              {detectedRisks.map((risk, idx) => (
                <div key={idx} className="bg-primary-dark p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{risk.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${risk.severity === 'Critical' || risk.severity === 'High' ? 'bg-red-500/20 text-red-400' : risk.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{risk.description}</p>
                  <div className="text-xs text-brand-cyan mb-2">OWASP: {risk.owaspMapping}</div>
                  <div className="text-sm bg-white/5 p-2 rounded border border-white/10 text-gray-300">
                    <span className="font-bold">Remediation:</span> {risk.remediation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-gray-400">No major risks detected by AI.</div>
          )}
        </div>

        {/* Technical Details */}
        <div className="space-y-6">
          {/* Headers */}
          <div className="glass-panel p-6 rounded-2xl">
             <h2 className="text-xl font-bold mb-4 flex items-center"><FiShield className="mr-2 text-brand-blue"/> Security Headers ({results.headers.score}/100)</h2>
             <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
               {results.headers.details.map((h, i) => (
                 <div key={i} className="flex justify-between items-center text-sm p-2 bg-primary-dark rounded border border-gray-700">
                   <span className="font-mono text-gray-300">{h.header}</span>
                   {h.status === 'Present' ? (
                     <FiCheckCircle className="text-green-500" />
                   ) : (
                     <FiAlertTriangle className="text-yellow-500" title={h.recommendation} />
                   )}
                 </div>
               ))}
             </div>
          </div>

          {/* SSL */}
          <div className="glass-panel p-6 rounded-2xl">
             <h2 className="text-xl font-bold mb-4 flex items-center"><FiShield className="mr-2 text-brand-blue"/> SSL / TLS ({results.ssl?.score || 0}/100)</h2>
             {results.ssl ? (
               <div className="space-y-2 text-sm text-gray-300">
                 <p><span className="text-gray-500 w-24 inline-block">Issuer:</span> {results.ssl.issuer}</p>
                 <p><span className="text-gray-500 w-24 inline-block">Protocol:</span> {results.ssl.protocol}</p>
                 <p><span className="text-gray-500 w-24 inline-block">Valid From:</span> {new Date(results.ssl.validFrom).toLocaleDateString()}</p>
                 <p><span className="text-gray-500 w-24 inline-block">Valid To:</span> {new Date(results.ssl.validTo).toLocaleDateString()}</p>
               </div>
             ) : (
               <p className="text-red-400 text-sm">No SSL Data available (HTTP used or connection failed).</p>
             )}
          </div>

          {/* Tech */}
          <div className="glass-panel p-6 rounded-2xl">
             <h2 className="text-xl font-bold mb-4 flex items-center"><FiShield className="mr-2 text-brand-blue"/> Technologies</h2>
             <div className="flex flex-wrap gap-2">
               {results.technologies.detected.map((t, i) => (
                 <span key={i} className="bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full text-xs font-bold">
                   {t.name} ({t.type})
                 </span>
               ))}
               {results.technologies.detected.length === 0 && (
                 <span className="text-sm text-gray-400">No major frameworks detected.</span>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
