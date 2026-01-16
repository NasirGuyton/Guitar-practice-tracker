import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Session() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:5000/api/sessions/${id}`)
        .then(res => res.json())
        .then(data => {
          setSession(data);
          setNotes(data.notes);
        });
    }
    else {
      fetch("http://127.0.0.1:5000/api/sessions", {
        method: "POST"
      })
        .then(res => res.json())
        .then(data => {
          setSession(data);
          setNotes("");
        });
    }
  }, [id]);

  const saveSession = () => 

    fetch(`http://127.0.0.1:5000/api/sessions/${session.id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    notes,
    artist: session.artist,
    song: session.song
  })
})

  if (!session) return <p>Loading session...</p>;

  return (
    
    <div className="app">
      <h1>Practice Session</h1>
      <p>{session.date}</p>
      
      <input
  placeholder="Artist"
  value={session.artist}
  onChange={(e) =>
    setSession({ ...session, artist: e.target.value })
  }
/>

<input
  placeholder="Song"
  value={session.song}
  onChange={(e) =>
    setSession({ ...session, song: e.target.value })
  }
/>


      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={saveSession}>Save</button>
      <button onClick={() => navigate("/")} style={{ marginLeft: "1rem" }}>
        Back
      </button>
    </div>
  );
}

export default Session;
