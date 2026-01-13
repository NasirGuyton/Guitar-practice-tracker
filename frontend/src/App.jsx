import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div className="app">
      <h1>Guitar Practice Tracker</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;
