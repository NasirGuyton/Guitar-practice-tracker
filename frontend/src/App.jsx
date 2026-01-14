import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/session")
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setNotes(data.notes);
      });
  }, []);

  const saveNotes = () => {
    fetch("http://127.0.0.1:5000/api/session", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    })
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setStatus("Saved");
        setTimeout(() => setStatus(""), 1500);
      });
  };

  if (!session) return <p>Loading session...</p>;

  return (
    <div className="app">
      <h1>Practice Session</h1>
      <p>Date: {session.date}</p>

      <textarea
        placeholder="Song Practiced Today"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={saveNotes}>Save Notes</button>
      <p className="status">{status}</p>
    </div>
  );
}

export default App;
