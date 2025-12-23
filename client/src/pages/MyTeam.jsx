import { usePokemon } from '../context/PokemonContext';
import TeamCard from '../components/TeamCard';

function MyTeam() {
    const { myTeam, updateNickname, removeFromTeam } = usePokemon();

    return (
        <div className="page team-page">
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
        </div>
    );
}

export default MyTeam;