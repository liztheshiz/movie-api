// IMPORTED MODULES
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

const app = express();

// MIDDLEWARE
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

// IN-MEMORY ARRAYS
let movies = [
    {
        title: 'Monty Python and the Holy Grail',
        description: 'description here',
        genre: 'genre here',
        director: 'Terry Gilliam and Terry Jones',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Nausicaa Of The Valley Of The Wind',
        description: 'description here',
        genre: 'genre here',
        director: 'Hayao Miyazaki',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Fried Green Tomatoes',
        description: 'description here',
        genre: 'genre here',
        director: 'Jon Avnet',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        description: 'description here',
        genre: 'genre here',
        director: 'George Lucas',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Roma',
        description: 'description here',
        genre: 'genre here',
        director: 'Alfonso Cuarón',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Mulholland Drive',
        description: 'description here',
        genre: 'genre here',
        director: 'David Lynch',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'The Power Of The Dog',
        description: 'description here',
        genre: 'genre here',
        director: 'Jane Campion',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Mad Max 2: The Road Warrior',
        description: 'description here',
        genre: 'genre here',
        director: 'George Miller',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'La Strada',
        description: 'description here',
        genre: 'genre here',
        director: 'Federico Fellini',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Hero',
        description: 'description here',
        genre: 'genre here',
        director: 'Yi-Mou Zhang',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Crouching Tiger, Hidden Dragon',
        description: 'description here',
        genre: 'genre here',
        director: 'Ang Lee',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Rio Bravo',
        description: 'description here',
        genre: 'genre here',
        director: 'Howard Hawk',
        imageUrl: 'url here',
        featured: 'true/false here'
    }
];

let genres = [
    {
        name: 'Action',
        description: 'Action description here.'
    },
    {
        name: 'Western',
        description: 'Western description here.'
    }
];

let directors = [
    {
        name: 'Hayao Miyazaki',
        bio: 'Action description here.',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'John Avnett',
        bio: 'Action description here.',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    }
];

let users = [];

// CUSTOM GET REQUESTS
// Return list of movies as json
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Gets data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    let movie = movies.find((movie) => { return movie.title === req.params.title });

    if (movie) {
        res.status(201).json(movie);
    } else {
        res.status(404).send('Movie with the title ' + req.params.name + ' was not found.');
    }
});

// Gets data about a genre, by name
app.get('/movies/genres/:name', (req, res) => {
    let genre = genres.find((genre) => { return genre.name === req.params.name });
  
    if (genre) {
        res.status(201).send(genre.name + ': ' + genre.description);
    } else {
        res.status(404).send('Genre with the name ' + req.params.name + ' was not found.');
    }
});

// Gets data about a director, by name
app.get('/movies/directors/:name', (req, res) => {
    let director = directors.find((director) => { return director.name === req.params.name });
  
    if (director) {
        res.status(201).json(director);
    } else {
        res.status(404).send('Director with the name ' + req.params.name + ' was not found.');
    }
});

// Adds data for a new user to list of users
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else if (false /* Check if username already exists */) {
        const message = 'Username already exists';
        res.status(400).send(message);
    } else {
        user.topMovies = {}; // Initialize empty top movies list for user
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// Update the "name" of a user by current name
app.put('/users/:name/:newName', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
  
    if (!user) {
        res.status(404).send('User with the name ' + req.params.name + ' was not found.');
    } else if (false /* Check if username already exists */) {
        const message = 'Username already exists';
        res.status(400).send(message);
    } else {
        user.name = parseInt(req.params.newName);
        res.status(201).send('User ' + req.params.name + ' was assigned new name ' + req.params.newName);
    }
});

// Adds movie to user's list of top movies
app.post('/users/:name/topMovies', (req, res) => {
    let newMovie = req.body;

    if (!newMovie.title) {
        const message = 'Missing title in request body';
        res.status(400).send(message);
    } else if (false /* Check if movie already in list */) {
        const message = 'Movie is already included in list';
        res.status(400).send(message);
    } else {
        user.topMovies.push(newMovie);
        res.status(201).send(newMovie);
    }
});

// Deletes a movie from user's list by title
app.delete('/users/:name/topMovies', (req, res) => {
    let movie = user.topMovies.find((movie) => { return movie.title === req.params.title });

    if (movie) {
        user.topMovies = user.topMovies.filter((obj) => { return obj.title !== req.params.title });
        res.status(201).send('Movie ' + req.params.title + ' was deleted from ' + user.name + '\'s list.');
    }
});

// Deletes a user from users list by name
app.delete('/users/:name', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });

    if (user) {
        users = users.filter((obj) => { return obj.name !== req.params.name });
        res.status(201).send('User ' + req.params.name + ' was deleted.');
    }
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