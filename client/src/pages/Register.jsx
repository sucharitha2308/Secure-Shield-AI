import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple opacity-10 blur-[120px]"></div>
      </div>
      
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl z-10 relative">
        <div className="text-center mb-8">
          <FiShield className="text-5xl text-brand-purple mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join SecureShield AI today</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-primary-light/30 border border-gray-600 rounded-lg py-3 pl-10 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500" />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-primary-light/30 border border-gray-600 rounded-lg py-3 pl-10 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition"
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
                className="w-full bg-primary-light/30 border border-gray-600 rounded-lg py-3 pl-10 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:from-purple-600 hover:to-blue-600 py-3 rounded-lg text-white font-bold transition shadow-lg"
          >
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-brand-purple hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
