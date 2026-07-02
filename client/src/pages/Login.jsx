import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue opacity-10 blur-[120px]"></div>
      </div>
      
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl z-10 relative">
        <div className="text-center mb-8">
          <FiShield className="text-5xl text-brand-cyan mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your SecureShield account</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500" />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-primary-light/30 border border-gray-600 rounded-lg py-3 pl-10 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-primary-light/30 border border-gray-600 rounded-lg py-3 pl-10 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-blue-600 hover:to-cyan-600 py-3 rounded-lg text-white font-bold transition shadow-lg"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Don't have an account? <Link to="/register" className="text-brand-cyan hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
