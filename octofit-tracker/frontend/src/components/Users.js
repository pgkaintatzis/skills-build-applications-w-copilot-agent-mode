import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Users: fetching from', apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Users: fetched data', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error('Users: fetch error', err);
        setError(err.message);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const normalizedQuery = query.toLowerCase();
    return (
      String(user.username || '').toLowerCase().includes(normalizedQuery) ||
      String(user.email || '').toLowerCase().includes(normalizedQuery)
    );
  });

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (error) return <div className="alert alert-danger">Error loading users: {error}</div>;

  return (
    <section className="page-section">
      <div className="card shadow-sm border-0 app-card">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4 border-bottom">
          <div>
            <h2 className="h3 mb-1 fw-bold">Users</h2>
            <p className="text-secondary mb-0">Manage profiles and contact details.</p>
          </div>
          <a
            className="btn btn-outline-primary btn-sm"
            href="/api/users/"
            target="_blank"
            rel="noreferrer"
          >
            Open API
          </a>
        </div>

        <form className="row g-2 p-4 border-bottom bg-light" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="users-filter" className="form-label fw-semibold">Search users</label>
            <input
              id="users-filter"
              type="text"
              className="form-control"
              placeholder="Filter by username or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 d-grid align-self-end">
            <button type="button" className="btn btn-primary" onClick={() => setQuery('')}>
              Clear Filter
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 octo-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-secondary">
                    No users match your current filter.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{user.username || '-'}</td>
                  <td>
                    <a className="link-primary" href={`mailto:${user.email || ''}`}>
                      {user.email || 'No email'}
                    </a>
                  </td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => openModal(user)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">User Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Username:</strong> {selectedUser.username || '-'}</p>
                  <p className="mb-0"><strong>Email:</strong> {selectedUser.email || '-'}</p>
                </div>
                <div className="modal-footer">
                  <a className="btn btn-outline-primary" href={`mailto:${selectedUser.email || ''}`}>
                    Email User
                  </a>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </section>
  );
}

export default Users;
