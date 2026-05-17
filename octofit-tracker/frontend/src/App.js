import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import { useState } from 'react';

function App() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const navItems = [
    { path: '/users', label: 'Users' },
    { path: '/teams', label: 'Teams' },
    { path: '/activities', label: 'Activities' },
    { path: '/workouts', label: 'Workouts' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  const closeAboutModal = () => setShowAboutModal(false);

  return (
    <Router>
      <div className="App app-shell">
        <nav className="navbar navbar-expand-lg octo-navbar">
          <div className="container py-2">
            <NavLink className="navbar-brand fw-bold" to="/users">
              <img src="/octofitapp-small.svg" alt="OctoFit Logo" className="navbar-logo" />
              OctoFit Tracker
            </NavLink>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="navbar-nav nav-pills flex-row gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    className={({ isActive }) =>
                      `nav-link px-3 rounded-pill fw-semibold ${isActive ? 'active' : ''}`
                    }
                    to={item.path}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={() => setShowAboutModal(true)}
              >
                About
              </button>
            </div>
          </div>
        </nav>

        <main className="container py-4">
          <div className="card border-0 shadow-sm mb-4 app-hero-card">
            <div className="card-body py-4 px-4 px-md-5">
              <h1 className="h2 mb-2 fw-bold">Train Together, Compete Better</h1>
              <p className="mb-0 text-secondary">
                View users, teams, activities, workouts, and leaderboard performance in one place.
              </p>
            </div>
          </div>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/" element={<Users />} />
          </Routes>
        </main>

        {showAboutModal && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="modal-title h5 mb-0">About OctoFit Tracker</h2>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeAboutModal}
                    />
                  </div>
                  <div className="modal-body">
                    <p className="mb-2">
                      OctoFit Tracker helps teams stay active through shared progress, activity logs,
                      and competitive rankings.
                    </p>
                    <a
                      className="link-primary"
                      href="https://getbootstrap.com/docs/5.3/getting-started/introduction/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Built with Bootstrap UI patterns
                    </a>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeAboutModal}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" onClick={closeAboutModal} />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
