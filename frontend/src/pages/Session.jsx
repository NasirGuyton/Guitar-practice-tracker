import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./session.css";

const SECTION_OPTIONS = ["Intro", "Verse", "Chorus", "Bridge", "Outro"];

function Session() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [notification, setNotification] = useState("");

  //Notification helper
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 1500); //disappear after 1.5s
  };

  //Load or create session
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:5000/api/sessions/${id}`)
        .then(res => res.json())
        .then(data =>
          setSession({
            ...data,
            sections: data.sections || []
          })
        );
    } else {
      fetch("http://127.0.0.1:5000/api/sessions", { method: "POST" })
        .then(res => res.json())
        .then(data =>
          setSession({
            ...data,
            sections: []
          })
        );
    }
  }, [id]);

  const addSection = (name) => {
    if (!name) return;

    setSession({
      ...session,
      sections: [
        ...session.sections,
        {
          id: Date.now(),
          name,
          notes: []
        }
      ]
    });
    showNotification("Section Added");
  };

  const addNote = (sectionId) => {
    setSession({
      ...session,
      sections: session.sections.map(sec =>
        sec.id === sectionId
          ? {
              ...sec,
              notes: [
                ...(sec.notes || []),
                {
                  id: Date.now(),
                  content: "",
                  speed: 80,
                  sets: 3,
                  reps: 10
                }
              ]
            }
          : sec
      )
    });
    showNotification("Note Added");
  };

  const updateNote = (sectionId, noteId, field, value) => {
    setSession({
      ...session,
      sections: session.sections.map(sec =>
        sec.id === sectionId
          ? {
              ...sec,
              notes: sec.notes.map(note =>
                note.id === noteId
                  ? { ...note, [field]: value }
                  : note
              )
            }
          : sec
      )
    });
  };

  const removeNote = (sectionId, noteId) => {
    setSession({
      ...session,
      sections: session.sections.map(s =>
        s.id === sectionId
          ? { ...s, notes: s.notes.filter(n => n.id !== noteId) }
          : s
      )
    });
    showNotification("Removed");
  };

  const removeSection = (sectionId) => {
    setSession({
      ...session,
      sections: session.sections.filter(s => s.id !== sectionId)
    });
    showNotification("Removed");
  };

  const saveSession = () => {
    fetch(`http://127.0.0.1:5000/api/sessions/${session.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    }).then(() => showNotification("Saved"));
  };

  if (!session) return <p>Loading session...</p>;

  return (
    <div className="session-container">
    
      {notification && <div className="notification-popup">{notification}</div>}

      <div className="session-header">
        <h1>Practice Session</h1>
        <p>{session.date}</p>
      </div>

      <div className="session-inputs">
        <input
          placeholder="Artist"
          value={session.artist}
          onChange={(e) => setSession({ ...session, artist: e.target.value })}
        />
        <input
          placeholder="Song"
          value={session.song}
          onChange={(e) => setSession({ ...session, song: e.target.value })}
        />
      </div>

      <div className="section-add">
        <select defaultValue="" onChange={(e) => addSection(e.target.value)}>
          <option value="" disabled>Add section</option>
          {SECTION_OPTIONS.map(sec => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
      </div>

      {session.sections.map(sec => (
        <div key={sec.id} className="section-card">
          <div className="section-header">
            <h3>{sec.name}</h3>
            <button className="danger" onClick={() => removeSection(sec.id)}>
              Remove
            </button>
          </div>

          <button className="secondary add-button" onClick={() => addNote(sec.id)}>
            + Add Note
          </button>

          {sec.notes.map(note => (
            <div key={note.id} className="note-card">
              <textarea
                placeholder="Practice notes"
                value={note.content}
                onChange={(e) => updateNote(sec.id, note.id, "content", e.target.value)}
              />

              <div className="note-controls">
                <label>
                  Speed
                  <input
                    type="number"
                    value={note.speed}
                    onChange={(e) => updateNote(sec.id, note.id, "speed", +e.target.value)}
                  />
                </label>

                <label>
                  Sets
                  <input
                    type="number"
                    value={note.sets}
                    onChange={(e) => updateNote(sec.id, note.id, "sets", +e.target.value)}
                  />
                </label>

                <label>
                  Reps
                  <input
                    type="number"
                    value={note.reps}
                    onChange={(e) => updateNote(sec.id, note.id, "reps", +e.target.value)}
                  />
                </label>
              </div>

              <button
                className="danger small"
                onClick={() => removeNote(sec.id, note.id)}
              >
                Remove Note
              </button>
            </div>
          ))}
        </div>
      ))}

      <div className="actions">
        <button className="primary" onClick={saveSession}>Save</button>
        <button className="secondary" onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
}

export default Session;
