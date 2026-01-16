import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [sessions, setSessions] = useState([]);
  const [artistFilter, setArtistFilter] = useState("");
  const navigate = useNavigate();

  //Fetch sessions from backend
  const fetchSessions = (artist = "") => {
    let url = "http://127.0.0.1:5000/api/sessions";
    if (artist) {
      url += `?artist=${encodeURIComponent(artist)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setSessions(data));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleFilter = () => {
    fetchSessions(artistFilter);
  };

  //Delete session
  const deleteSession = (id) => {
    if (!window.confirm("Delete this session?")) return;

    fetch(`http://127.0.0.1:5000/api/sessions/${id}`, {
      method: "DELETE",
    }).then(() => {
      setSessions(sessions.filter((s) => s.id !== id));
    });
  };

  return (
    <div className="app">
      <h1>Guitar Practice Tracker</h1>

      <button
  className="primary"
  onClick={() => {
    //Create new session
    fetch("http://127.0.0.1:5000/api/sessions", { method: "POST" })
      .then((res) => res.json())
      .then((newSession) => {
        navigate(`/session/${newSession.id}`);
      });
  }}
>
  Create New Session
</button>


      <div className="filter-bar">
        <input
          placeholder="Filter by artist"
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
        <button
          onClick={() => {
            setArtistFilter("");
            fetchSessions();
          }}
        >
          Clear
        </button>
      </div>

      <h2 className="past-sessions">Past Sessions</h2>

      {sessions.length === 0 && <p>No sessions yet.</p>}

      <ul className="session-list">
        {sessions.map((session) => (
          <li key={session.id} className="session-item">
            <div
              className="session-clickable"
              onClick={() => navigate(`/session/${session.id}`)}
            >
              <strong>{session.song || "Untitled"}</strong> —{" "}
              {session.artist || "Unknown Artist"}
              <br />
              <span className="session-meta">{session.date}</span>
            </div>
            <button
              className="session-delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteSession(session.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
