// IMPORTED MODULES
const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js');
/*const req = require('express/lib/request');
const res = require('express/lib/response');*/

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
// Return movies collection as json
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
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Gets description of a given genre
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
    Movies.findOne({'Director.Name': req.params.name}).then(movie => {
        if (movie) {
            res.status(201).json(movie.Director);
        } else {
            res.status(404).send('Director with the name ' + req.params.name + ' was not found.')
        }
    });
});

// Adds new user doc to users collection
app.post('/users', (req, res) => {
    Users.findOne({Username: req.body.Username}).then(user => {
        if (user) {
            res.status(400).send('Username ' + req.body.Username + ' already exists');
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
                FavoriteMovies: []
            })
            .then(user => {res.status(201).json(user)})
            .catch(error => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Update user's info by current Username
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    })
    .then(user => {res.status(201).json(user)})
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Adds movie to user's list of favorite movies
app.post('/users/:name/FavoriteMovies', (req, res) => {
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
app.delete('/users/:name/FavoriteMovies/:title', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    let movie = user.topMovies.find((movie) => { return movie.title === req.params.title });

    if (movie) {
        user.topMovies = user.topMovies.filter((obj) => { return obj.title !== req.params.title });
        res.status(201).send('Movie ' + req.params.title + ' was deleted from ' + user.name + '\'s list.');
    }
});

// Deletes a user from users collection by username
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