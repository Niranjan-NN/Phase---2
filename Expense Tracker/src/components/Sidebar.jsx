import { NavLink } from 'react-router-dom';
import { Home, BarChart3, IndianRupee, Settings, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <IndianRupee size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-indigo-600 text-white">
      <div className="p-5">
        <h2 className="text-2xl font-bold flex items-center">
          <BarChart3 className="mr-2" />
          Track360
        </h2>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-5 py-3 transition-colors duration-200 ${
                    isActive 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-700'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-5 border-t border-indigo-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Settings size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Settings</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;