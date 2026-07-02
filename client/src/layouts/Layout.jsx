import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiShield, FiLogOut, FiMenu } from 'react-icons/fi';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="mr-3" /> },
    { name: 'New Scan', path: '/scanner', icon: <FiShield className="mr-3" /> },
  ];

  return (
    <div className="flex h-screen bg-primary-dark font-sans text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-primary border-r border-gray-700 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link to="/" className="text-2xl font-bold gradient-text flex items-center">
            <FiShield className="mr-2 text-brand-cyan" /> SecureShield AI
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-primary-light hover:text-white'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold truncate">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-primary border-b border-gray-700 p-4 flex justify-between items-center">
          <span className="text-xl font-bold gradient-text">SecureShield AI</span>
          <button className="text-gray-400 hover:text-white">
            <FiMenu size={24} />
          </button>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-primary-dark to-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
