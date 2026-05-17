import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Teams: fetching from', apiUrl);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Teams: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
      });
  }, []);

  const filteredTeams = teams.filter((team) => {
    const normalizedQuery = query.toLowerCase();
    return (
      String(team.name || '').toLowerCase().includes(normalizedQuery) ||
      String(Array.isArray(team.members) ? team.members.join(' ') : team.members || '')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  });

  const openModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  if (error) return <div className="alert alert-danger">Error loading teams: {error}</div>;

  return (
    <section className="page-section">
      <div className="card shadow-sm border-0 app-card">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4 border-bottom">
          <div>
            <h2 className="h3 mb-1 fw-bold">Teams</h2>
            <p className="text-secondary mb-0">Browse team rosters and collaboration groups.</p>
          </div>
          <a
            className="btn btn-outline-primary btn-sm"
            href="/api/teams/"
            target="_blank"
            rel="noreferrer"
          >
            Open API
          </a>
        </div>

        <form className="row g-2 p-4 border-bottom bg-light" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="teams-filter" className="form-label fw-semibold">Search teams</label>
            <input
              id="teams-filter"
              type="text"
              className="form-control"
              placeholder="Filter by team name or member"
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
                <th>Team Name</th>
                <th>Members</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-secondary">
                    No teams match your current filter.
                  </td>
                </tr>
              )}
              {filteredTeams.map((team, index) => (
                <tr key={team.id || index}>
                  <td>{team.name || '-'}</td>
                  <td>{Array.isArray(team.members) ? team.members.join(', ') : team.members || '-'}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => openModal(team)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedTeam && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Team Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-2"><strong>Name:</strong> {selectedTeam.name || '-'}</p>
                  <p className="mb-0">
                    <strong>Members:</strong>{' '}
                    {Array.isArray(selectedTeam.members)
                      ? selectedTeam.members.join(', ')
                      : selectedTeam.members || '-'}
                  </p>
                </div>
                <div className="modal-footer">
                  <a className="btn btn-outline-primary" href="/api/teams/" target="_blank" rel="noreferrer">
                    View Teams API
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

export default Teams;
