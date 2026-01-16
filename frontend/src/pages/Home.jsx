import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sessions")
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  return (
    <div className="app">
      <h1>Guitar Practice Tracker</h1>

      <button onClick={() => navigate("/session")}>
        Create New Session
      </button>

      <h2 style={{ marginTop: "2rem" }}>Past Sessions</h2>

      {sessions.length === 0 && <p>No sessions yet.</p>}

      <ul>
  {sessions.map(session => (
    <li
  key={session.id}
  onClick={() => navigate(`/session/${session.id}`)}
>
  <strong>{session.song || "Untitled"}</strong>
  {" — "}
  {session.artist || "Unknown Artist"}
  <br />
  <small>{session.date}</small>
</li>

  ))}
</ul>

    </div>
  );
}

export default Home;
