import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/pokemon';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(API_URL);
      setMyTeam(response.data);
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setSearchedPokemon(null);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      const data = response.data;
      setSearchedPokemon({
        id: data.id,
        name: data.name,
        image: data.sprites.front_default || data.sprites.other['official-artwork'].front_default
      });
    } catch (err) {
      setError('Pokemon not found!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToTeam = async () => {
    if (!searchedPokemon) return;
    try {
      await axios.post(API_URL, searchedPokemon);
      fetchTeam();
      setSearchedPokemon(null);
      setSearchTerm('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to team');
    }
  };

  const updateNickname = async (id, newNickname) => {
    try {
      await axios.put(`${API_URL}/${id}`, { nickname: newNickname });
      setMyTeam(myTeam.map(p =>
        p.id === id ? { ...p, nickname: newNickname } : p
      ));
    } catch (err) {
      console.error('Failed to update nickname', err);
    }
  };

  const removeFromTeam = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMyTeam(myTeam.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to release pokemon', err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>PokéTeam Manager</h1>
      </header>

      <section className="search-section">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Pokemon name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}

        {searchedPokemon && (
          <div className="card" style={{ borderColor: 'var(--accent-color)' }}>
            <h3>New Discovery!</h3>
            <img src={searchedPokemon.image} alt={searchedPokemon.name} />
            <h2>{searchedPokemon.name}</h2>
            <button className="btn-success" onClick={addToTeam}>
              Catch {searchedPokemon.name}!
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">My Team ({myTeam.length})</h2>
        {myTeam.length === 0 ? (
          <p style={{ color: '#888' }}>Your team is empty. Go catch some Pokemon!</p>
        ) : (
          <div className="team-grid">
            {myTeam.map((pokemon) => (
              <TeamCard
                key={pokemon.id}
                pokemon={pokemon}
                onUpdate={updateNickname}
                onDelete={removeFromTeam}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TeamCard({ pokemon, onUpdate, onDelete }) {
  const [nickname, setNickname] = useState(pokemon.nickname || '');

  const handleUpdate = () => {
    onUpdate(pokemon.id, nickname);
  };

  return (
    <div className="card">
      <img src={pokemon.image} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>

      <div className="actions">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button onClick={handleUpdate}>Save</button>
      </div>

      <div style={{ marginTop: '0.5rem', width: '100%' }}>
        {pokemon.nickname && <p style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>"{pokemon.nickname}"</p>}
      </div>

      <button className="btn-danger" style={{ width: '100%' }} onClick={() => onDelete(pokemon.id)}>
        Release
      </button>
    </div>
  );
}

export default App;
