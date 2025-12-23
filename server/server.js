const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let savedPokemon = [];

app.get('/api/search/:query', async (req, res) => {
    const { query } = req.params;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        const data = response.data;

        const pokemon = {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default || data.sprites.other['official-artwork'].front_default
        };
        res.json(pokemon);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'Pokemon not found' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Error searching Pokemon' });
        }
    }
});

app.get('/api/pokemon', (req, res) => {
    res.json(savedPokemon);
});

app.post('/api/pokemon', (req, res) => {
    const { id, name, image } = req.body;

    if (savedPokemon.find(p => p.id === id)) {
        return res.status(400).json({ message: 'Pokemon already in your team!' });
    }

    const newPokemon = {
        id,
        name,
        nickname: '',
        image
    };

    savedPokemon.push(newPokemon);
    res.status(201).json(newPokemon);
});

app.put('/api/pokemon/:id', (req, res) => {
    const { id } = req.params;
    const { nickname } = req.body;

    const pokemonIndex = savedPokemon.findIndex(p => p.id == id);
    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokemon not found in team' });
    }

    savedPokemon[pokemonIndex].nickname = nickname;
    res.json(savedPokemon[pokemonIndex]);
});

app.delete('/api/pokemon/:id', (req, res) => {
    const { id } = req.params;
    savedPokemon = savedPokemon.filter(p => p.id != id);
    res.json({ message: 'Pokemon released', id });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});