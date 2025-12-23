import { usePokemon } from '../context/PokemonContext';

function Home() {
    const {
        searchTerm,
        setSearchTerm,
        searchPokemon,
        loading,
        error,
        searchedPokemon,
        addToTeam
    } = usePokemon();

    return (
        <div className="page home-page">
            <section className="search-section">
                <form className="search-bar" onSubmit={searchPokemon}>
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
        </div>
    );
}

export default Home;
