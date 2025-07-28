import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Amazon Scraper</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Amazon..."
          style={{ padding: '0.5rem', marginRight: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            {item.image && (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img src={item.image} alt={item.title} style={{ width: '100px', marginRight: '1rem' }} />
              </a>
            )}
            <div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#0070f3', textDecoration: 'none' }}>
                {item.title}
              </a>
              {item.price && <p style={{ margin: '0.25rem 0' }}>{item.price} €</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
