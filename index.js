const express = require('express');
const app = express();

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

// GET requests
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});
  
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});
  
app.get('/movies', (req, res) => {
    res.json(topMovies);
});
  
  
// listen for requests
app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
});