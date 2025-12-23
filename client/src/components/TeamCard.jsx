import { useState, useEffect } from 'react';

function TeamCard({ pokemon, onUpdate, onDelete }) {
    const [nickname, setNickname] = useState(pokemon.nickname || '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setNickname(pokemon.nickname || '');
    }, [pokemon.id, pokemon.nickname]);

    const handleUpdate = () => {
        onUpdate(pokemon.id, nickname);
        setIsEditing(false);
    };

    const displayName = pokemon.nickname || pokemon.name;

    return (
        <div className="card">
            <img src={pokemon.image} alt={pokemon.name} />

            <h2 style={{ margin: 0 }}>{displayName}</h2>

            <p style={{ margin: '0.2rem 0 1rem', fontSize: '0.9em', textTransform: 'capitalize', color: '#aaa' }}>
                {pokemon.name}
            </p>

            {isEditing ? (
                <div className="actions">
                    <input
                        type="text"
                        placeholder="New Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        autoFocus
                    />
                    <button className="btn-primary" onClick={handleUpdate}>Save</button>
                </div>
            ) : (
                <button
                    style={{ marginBottom: '1rem', width: '100%', padding: '0.4rem' }}
                    onClick={() => setIsEditing(true)}
                >
                    {pokemon.nickname ? 'Rename' : 'Add Nickname'}
                </button>
            )}

            <button className="btn-danger" style={{ width: '100%' }} onClick={() => onDelete(pokemon.id)}>
                Release
            </button>
        </div>
    );
}

export default TeamCard;
