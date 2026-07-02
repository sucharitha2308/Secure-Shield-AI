import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiActivity, FiLock, FiChevronRight } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-primary-dark font-sans text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue opacity-20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-purple opacity-20 blur-[120px]"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-24">
        <div className="flex items-center space-x-2">
          <FiShield className="text-3xl text-brand-cyan" />
          <span className="text-2xl font-bold tracking-tighter gradient-text">SecureShield AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/register" className="bg-brand-blue hover:bg-blue-600 px-6 py-2 rounded-full font-medium transition shadow-[0_0_15px_rgba(59,130,246,0.5)]">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center text-center mt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Enterprise-Grade Application Security
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Secure Your Web Apps with <span className="gradient-text">AI Intelligence</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Comprehensive security scanning, OWASP vulnerability mapping, and actionable AI-driven insights to protect your digital assets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="flex items-center bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-full text-lg font-bold transition shadow-lg w-full sm:w-auto justify-center">
              Start Scanning Free <FiChevronRight className="ml-2" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto w-full px-4"
        >
          {[
            { icon: <FiShield />, title: "Automated Scanning", desc: "Detect vulnerabilities in HTTP headers, cookies, and SSL/TLS configurations instantly." },
            { icon: <FiActivity />, title: "Real-time Monitoring", desc: "Keep track of your security posture over time with an intuitive dashboard and scoring system." },
            { icon: <FiLock />, title: "AI-Powered Reports", desc: "Get deep insights and remediation steps mapped to OWASP standards using advanced AI." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl text-left border border-white/10 hover:border-brand-cyan/50 transition">
              <div className="text-brand-cyan text-4xl mb-4 bg-brand-cyan/10 w-16 h-16 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
