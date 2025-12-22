const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let savedPokemon = [];

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
