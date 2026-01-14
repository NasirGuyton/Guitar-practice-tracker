import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <h1>Guitar Practice Tracker</h1>
      <p>Welcome</p>

      <button onClick={() => navigate("/session")}>
        Create New Session
      </button>
    </div>
  );
}

export default Home;
