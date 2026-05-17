import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Activities: fetching from', apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Activities: fetched data', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
        setError(err.message);
      });
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const normalizedQuery = query.toLowerCase();
    return (
      String(activity.user || '').toLowerCase().includes(normalizedQuery) ||
      String(activity.team || '').toLowerCase().includes(normalizedQuery) ||
      String(activity.activity_type || '').toLowerCase().includes(normalizedQuery)
    );
  });

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  if (error) return <div className="alert alert-danger">Error loading activities: {error}</div>;

  return (
    <section className="page-section">
      <div className="card shadow-sm border-0 app-card">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4 border-bottom">
          <div>
            <h2 className="h3 mb-1 fw-bold">Activities</h2>
            <p className="text-secondary mb-0">Track training sessions by user and team.</p>
          </div>
          <a
            className="btn btn-outline-primary btn-sm"
            href="/api/activities/"
            target="_blank"
            rel="noreferrer"
          >
            Open API
          </a>
        </div>

        <form className="row g-2 p-4 border-bottom bg-light" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="activities-filter" className="form-label fw-semibold">Search activities</label>
            <input
              id="activities-filter"
              type="text"
              className="form-control"
              placeholder="Filter by user, team, or type"
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
                <th>User</th>
                <th>Team</th>
                <th>Activity Type</th>
                <th>Duration (min)</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-secondary">
                    No activities match your current filter.
                  </td>
                </tr>
              )}
              {filteredActivities.map((activity, index) => (
                <tr key={activity.id || index}>
                  <td>{activity.user || '-'}</td>
                  <td>{activity.team || '-'}</td>
                  <td>{activity.activity_type || '-'}</td>
                  <td>{activity.duration_minutes ?? '-'}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openModal(activity)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedActivity && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Activity Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>User:</strong> {selectedActivity.user || '-'}</p>
                  <p className="mb-2"><strong>Team:</strong> {selectedActivity.team || '-'}</p>
                  <p className="mb-2"><strong>Type:</strong> {selectedActivity.activity_type || '-'}</p>
                  <p className="mb-0"><strong>Duration:</strong> {selectedActivity.duration_minutes ?? '-'} minutes</p>
                </div>
                <div className="modal-footer">
                  <a
                    className="btn btn-outline-primary"
                    href="/api/activities/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Activities API
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

export default Activities;
