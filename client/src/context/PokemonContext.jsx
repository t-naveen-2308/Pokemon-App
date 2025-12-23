import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const PokemonContext = createContext();

const API_URL = 'http://localhost:5000/api/pokemon';
const SEARCH_API_URL = 'http://localhost:5000/api/search';

export const usePokemon = () => useContext(PokemonContext);

export const PokemonProvider = ({ children }) => {
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

    const searchPokemon = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError('');
        setSearchedPokemon(null);

        try {
            const response = await axios.get(`${SEARCH_API_URL}/${searchTerm}`);
            const data = response.data;
            setSearchedPokemon({
                id: data.id,
                name: data.name,
                image: data.image
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
            await fetchTeam();
            setSearchedPokemon(null);
            setSearchTerm('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to team');
        }
    };

    const updateNickname = async (id, newNickname) => {
        try {
            await axios.put(`${API_URL}/${id}`, { nickname: newNickname });
            setMyTeam(prev => prev.map(p =>
                p.id === id ? { ...p, nickname: newNickname } : p
            ));
        } catch (err) {
            console.error('Failed to update nickname', err);
        }
    };

    const removeFromTeam = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setMyTeam(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to release pokemon', err);
        }
    };

    const value = {
        searchTerm,
        setSearchTerm,
        searchedPokemon,
        setSearchedPokemon,
        myTeam,
        loading,
        error,
        searchPokemon,
        addToTeam,
        updateNickname,
        removeFromTeam
    };

    return (
        <PokemonContext.Provider value={value}>
            {children}
        </PokemonContext.Provider>
    );
};
