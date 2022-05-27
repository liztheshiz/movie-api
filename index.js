// IMPORTED MODULES
const express = require('express');
    morgan = require('morgan');

const app = express();

// MIDDLEWARE
app.use(morgan('common'));
app.use(express.static('public'));

// CUSTOM GET REQUESTS
// movies to be returned on /movies request
let topMovies = [
    {
        title: 'Monty Python and the Holy Grail',
        director: ''
    },
    {
        title: 'Nausicaa of the Valley of the Wind',
        director: 'Hayao Miyazaki'
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    },
    {
        title: '',
        director: ''
    }
];

// return list of movies as json
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
});