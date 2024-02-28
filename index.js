const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3001;

app.use(express.json());

app.listen(port, () => console.log(`Escuchando en el puerto: ${port}`));

app.get('/', (req, res) =>{
    res.send('POKE-API');
});

//Get pokemon by id or name
app.get('/pokemon/:id', async (req, res) => {
    const pokemonId = req.params.id;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const { id, name, height, weight, types } = response.data;

        res.json({
            id,
            name,
            height,
            weight,
            types
        });
    } catch (error) {
        console.error(`Error al obtener información del Pokémon: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Get a List the first n Pokemon
app.get('/pokemon/ListN/:n', async (req, res) => {
    const n = req.params.n;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${n}&offset=0`);
        res.json(response.data);

    } catch (error) {
        console.error(`Error al obtener información del Pokémon: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Get Pokemon by generation 1-9
app.get('/pokemon/generation/:generation', async (req, res) => {
    const gen = req.params.generation;

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${gen}`);
        const { id, main_region, pokemon_species} = response.data;
        res.json({
            id,
            main_region,
            pokemon_species
        });

    } catch (error) {
        console.error(`Error al obtener la lista de Pokémon por generación: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//get moves from a specific pokemon
app.get('/pokemon/:id/moves', async (req, res) => {
    const pokemonId = req.params.id;

    try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const { id, name, moves } = pokemonResponse.data;

        const movesDetails = await Promise.all(moves.map(async (move) => {
            const moveResponse = await axios.get(move.move.url);
            const { id, name, power, pp, type } = moveResponse.data;
            return { id, name, power, pp, type };
        }));

        res.json({
            id,
            name,
            moves: movesDetails
        });
    } catch (error) {
        console.error(`Error al obtener detalles de los movimientos del Pokémon: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//get a list of pokemon by type (id or name)
app.get('/pokemon/type/:type', async (req, res) => {
    const type = req.params.type;

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        const { id, name, pokemon} = response.data;
        res.json({
            id,
            name,
            pokemon
        });

    } catch (error) {
        console.error(`Error al obtener la lista de Pokémon por generación: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});