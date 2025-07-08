import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function Navbar() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  console.log("In navbar:- ",user)

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#22218b' }}>
      <div className="container-fluid">
       
        <h5 className="fw-bold" style={{ color: 'white', letterSpacing: '1px',marginBottom:'0px' }}>
          <Link className="navbar-brand text-white fw-bold" to="/">Task<span style={{ color: '#f0ad4e' }}>Flow</span></Link>
        </h5>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
            </li>
          
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/members">Members</Link>
              </li>
            )}

            {(user?.role === 'admin' || user?.role === 'manager') && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/projects">Projects</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/tasks">Tasks</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="me-4 text-white text-end">
              <div className="fw-bold">{user?.firstname} {user.lastname}</div>
              <div className="small text-uppercase text-start" style={{ opacity: 0.8 }}>{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
