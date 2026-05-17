import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Leaderboard: fetching from', apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
      });
  }, []);

  const filteredEntries = entries.filter((entry) =>
    String(entry.team || '').toLowerCase().includes(query.toLowerCase())
  );

  const openModal = (entry, rank) => {
    setSelectedEntry({ ...entry, rank });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  if (error) return <div className="alert alert-danger">Error loading leaderboard: {error}</div>;

  return (
    <section className="page-section">
      <div className="card shadow-sm border-0 app-card">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4 border-bottom">
          <div>
            <h2 className="h3 mb-1 fw-bold">Leaderboard</h2>
            <p className="text-secondary mb-0">Compare points and top-performing teams.</p>
          </div>
          <a
            className="btn btn-outline-primary btn-sm"
            href="/api/leaderboard/"
            target="_blank"
            rel="noreferrer"
          >
            Open API
          </a>
        </div>

        <form className="row g-2 p-4 border-bottom bg-light" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="leaderboard-filter" className="form-label fw-semibold">Search leaderboard</label>
            <input
              id="leaderboard-filter"
              type="text"
              className="form-control"
              placeholder="Filter by team"
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
                <th>Rank</th>
                <th>Team</th>
                <th>Points</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-secondary">
                    No leaderboard entries match your current filter.
                  </td>
                </tr>
              )}
              {filteredEntries.map((entry, index) => (
                <tr key={entry.id || index}>
                  <td>
                    <span className="badge rounded-pill rank-pill">#{index + 1}</span>
                  </td>
                  <td>{entry.team || '-'}</td>
                  <td>{entry.points ?? '-'}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openModal(entry, index + 1)}
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

      {showModal && selectedEntry && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Leaderboard Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Rank:</strong> #{selectedEntry.rank}</p>
                  <p className="mb-2"><strong>Team:</strong> {selectedEntry.team || '-'}</p>
                  <p className="mb-0"><strong>Points:</strong> {selectedEntry.points ?? '-'}</p>
                </div>
                <div className="modal-footer">
                  <a
                    className="btn btn-outline-primary"
                    href="/api/leaderboard/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Leaderboard API
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

export default Leaderboard;
