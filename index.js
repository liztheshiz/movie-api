// IMPORTED MODULES
const express = require('express');
    morgan = require('morgan');

const app = express();

// MIDDLEWARE
app.use(morgan('common'));
app.use(express.static('public'));

// CUSTOM GET REQUESTS
// Movies to be returned on /movies request
let movies = [
    {
        title: 'Monty Python and the Holy Grail',
        director: 'Terry Gilliam and Terry Jones'
    },
    {
        title: 'Nausicaa Of The Valley Of The Wind',
        director: 'Hayao Miyazaki'
    },
    {
        title: 'Fried Green Tomatoes',
        director: 'Jon Avnet'
    },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        director: 'George Lucas'
    },
    {
        title: 'Roma',
        director: 'Alfonso Cuarón'
    },
    {
        title: 'Mulholland Drive',
        director: 'David Lynch'
    },
    {
        title: 'The Power Of The Dog',
        director: 'Jane Campion'
    },
    {
        title: 'Mad Max 2: The Road Warrior',
        director: 'George Miller'
    },
    {
        title: 'La Strada',
        director: 'Federico Fellini'
    },
    {
        title: 'Hero',
        director: 'Yi-Mou Zhang'
    },
    {
        title: 'Crouching Tiger, Hidden Dragon',
        director: 'Ang Lee'
    },
    {
        title: 'Rio Bravo',
        director: 'Howard Hawk'
    }
];

// Return list of movies as json
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) =>
        { return movie.title === req.params.title }));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen for requests
app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
});