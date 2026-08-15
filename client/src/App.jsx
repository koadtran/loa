import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Odin-Book</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}

export default App;
