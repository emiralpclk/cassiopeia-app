import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'home', label: 'Ana Sayfa' },
  { path: '/fallar', icon: 'flare', label: 'Fallar' },
  { path: '/gecmis', icon: 'history', label: 'Geçmiş' },
  { path: '/kesfet', icon: 'explore', label: 'Keşfet' },
  { path: '/profil', icon: 'person', label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}