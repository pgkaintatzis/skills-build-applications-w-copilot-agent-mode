import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Workouts: fetching from', apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Workouts: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
      });
  }, []);

  const filteredWorkouts = workouts.filter((workout) => {
    const normalizedQuery = query.toLowerCase();
    return (
      String(workout.name || '').toLowerCase().includes(normalizedQuery) ||
      String(workout.description || '').toLowerCase().includes(normalizedQuery)
    );
  });

  const openModal = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
  };

  if (error) return <div className="alert alert-danger">Error loading workouts: {error}</div>;

  return (
    <section className="page-section">
      <div className="card shadow-sm border-0 app-card">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4 border-bottom">
          <div>
            <h2 className="h3 mb-1 fw-bold">Workouts</h2>
            <p className="text-secondary mb-0">Explore training plans and descriptions.</p>
          </div>
          <a
            className="btn btn-outline-primary btn-sm"
            href="/api/workouts/"
            target="_blank"
            rel="noreferrer"
          >
            Open API
          </a>
        </div>

        <form className="row g-2 p-4 border-bottom bg-light" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="workouts-filter" className="form-label fw-semibold">Search workouts</label>
            <input
              id="workouts-filter"
              type="text"
              className="form-control"
              placeholder="Filter by name or description"
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
                <th>Name</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-secondary">
                    No workouts match your current filter.
                  </td>
                </tr>
              )}
              {filteredWorkouts.map((workout, index) => (
                <tr key={workout.id || index}>
                  <td>{workout.name || '-'}</td>
                  <td>{workout.description || '-'}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openModal(workout)}
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

      {showModal && selectedWorkout && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Workout Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Name:</strong> {selectedWorkout.name || '-'}</p>
                  <p className="mb-0"><strong>Description:</strong> {selectedWorkout.description || '-'}</p>
                </div>
                <div className="modal-footer">
                  <a
                    className="btn btn-outline-primary"
                    href="/api/workouts/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Workouts API
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

export default Workouts;
