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
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
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
    }, {new: true})
    .then(user => {res.status(201).json(user)})
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Adds movie to user's list of favorite movies
app.post('/users/:username/FavoriteMovies/:movieid', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $addToSet: { FavoriteMovies: req.params.movieid }   // WON'T THROW ERROR IF MOVIE ALREADY PRESENT
    }, {new: true})
    .then(user => {res.status(201).json(user)})
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Deletes a movie from user's list by title
app.delete('/users/:username/FavoriteMovies/:movieid', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $pull: { FavoriteMovies: req.params.movieid }
    }, {new: true})
    .then(user => {res.status(201).send('Movie ' + req.params.movieid + ' was deleted from ' + user.Username + '\'s list.')})
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Deletes a user from users collection by username
app.delete('/users/:username', (req, res) => {
    Users.findOneAndRemove({Username: req.params.username})
    .then(user => {
            if (!user) {
                res.status(404).send('User with the name ' + req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was successfully deleted');
            }
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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