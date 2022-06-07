// IMPORTED MODULES
const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const app = express(),
    Movies = Models.Movie,
    Users = Models.User;

mongoose.connect('mongodb://localhost:27017/CinemaDB', { useNewUrlParser: true, useUnifiedTopology: true });

// MIDDLEWARE
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

/*
// IN-MEMORY ARRAYS
let movies = [
    {
        title: 'Nausicaa Of The Valley Of The Wind',
        description: 'description here',
        genre: 'Animation',
        director: 'Hayao Miyazaki',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Fried Green Tomatoes',
        description: 'description here',
        genre: 'Comedy-drama',
        director: 'Jon Avnet',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        description: 'description here',
        genre: 'Sci-fi Fantasy',
        director: 'George Lucas',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Mulholland Drive',
        description: 'description here',
        genre: 'Mystery',
        director: 'David Lynch',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'The Power Of The Dog',
        description: 'description here',
        genre: 'Drama',
        director: 'Jane Campion',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Mad Max 2: The Road Warrior',
        description: 'description here',
        genre: 'Action',
        director: 'George Miller',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Mad Max: Fury Road',
        description: 'description here',
        genre: 'Action',
        director: 'George Miller',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'La Strada',
        description: 'Gelsomina, a simple-minded young woman is bought from her mother by Zampanò, a brutish strongman who takes her with him on the road.',
        genre: 'Drama',
        director: 'Federico Fellini',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Hero',
        description: 'description here',
        genre: 'Wuxia',
        director: 'Zhang Yimou',
        imageUrl: 'url here',
        featured: 'true/false here'
    },
    {
        title: 'Crouching Tiger, Hidden Dragon',
        description: 'description here',
        genre: 'Wuxia',
        director: 'Ang Lee',
        imageUrl: 'url here',
        featured: 'true/false here'
    }
];

let genres = [
    {
        name: 'Animation',
        description: 'description here.'
    },
    {
        name: 'Comedy-drama',
        description: 'description here.'
    },
    {
        name: 'Sci-fi Fantasy',
        description: 'description here.'
    },
    {
        name: 'Drama',
        description: 'description here.'
    },
    {
        name: 'Mystery',
        description: 'description here.'
    },
    {
        name: 'Action',
        description: 'description here.'
    },
    {
        name: 'Wuxia',
        description: 'description here.'
    }
];

let directors = [
    {
        name: 'Hayao Miyazaki',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'Jon Avnet',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'George Lucas',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'David Lynch',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'Jane Campion',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'George Miller',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'Federico Fellini',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'Zhang Yimou',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    },
    {
        name: 'Ang Lee',
        bio: 'bio here',
        birthYear: 'birth year here',
        deathYear: 'death year here'
    }
];

let users = [];
*/

// CUSTOM GET REQUESTS
// Return list of movies as json
app.get('/movies', (req, res) => {
    Movies.find().then(movies => res.json(movies));
});

// Gets data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    Movies.findOne({Title: req.params.title}).then(movie => {
        if (movie) {
            res.status(201).json(movie);
        } else {
            res.status(404).send('Movie with the title ' + req.params.title + ' was not found.');
        }
    });
});

// Gets data about a genre, by name
app.get('/movies/genres/:name', (req, res) => {
    Movies.findOne({'Genre.Name': req.params.name}).then(movie => {
        if (movie) {
            res.status(201).send(movie.Genre.Description);
        } else {
            res.status(404).send('Genre with the name ' + req.params.name + ' was not found.')
        }
    });
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
    let user = req.body;

    if (!user.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else if (false /* Check if username already exists */) {
        const message = 'Username already exists';
        res.status(400).send(message);
    } else {
        user.topMovies = []; // Initialize empty top movies array for user
        users.push(user);
        res.status(201).json(user);
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
    let movie = req.body;
    let user = users.find((user) => { return user.name === req.params.name });

    if (!user) {
        res.status(404).send('User with the name ' + req.params.name + ' was not found.');
    }

    if (!movie.title) {
        const message = 'Missing title in request body';
        res.status(400).send(message);
    } else if (false /* Check if movie already in list */) {
        const message = 'Movie is already included in list';
        res.status(400).send(message);
    } else {
        user.topMovies.push(movie);
        res.status(201).send(movie);
    }
});

// Deletes a movie from user's list by title
app.delete('/users/:name/topMovies/:title', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    let movie = user.topMovies.find((movie) => { return movie.title === req.params.title });

    if (movie) {
        user.topMovies = user.topMovies.filter((obj) => { return obj.title !== req.params.title });
        res.status(201).send('Movie ' + req.params.title + ' was deleted from ' + user.name + '\'s list.');
    }
});

// Deletes a user from users list by name
app.delete('/users/:name', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });

    if (!user) {
        res.status(404).send('User with the name ' + req.params.name + ' was not found.');
    } else {
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