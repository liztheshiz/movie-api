// IMPORTED MODULES
const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    { check, validationResult } = require('express-validator');

const app = express(),
    Movies = Models.Movie,
    Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/CinemaDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// MIDDLEWARE
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

const cors = require('cors');
//app.use(cors());

let allowedOrigins = ['http://localhost:8081', 'http://localhost:4200', 'https://cinemadatabase.herokuapp.com', 'http://localhost:1234', 'https://cinemadatabase.netlify.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn\’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

// CUSTOM GET REQUESTS
// Return movies collection as json
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then(movies => res.json(movies));
});

// Gets data about a single movie, by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title }).then(movie => {
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

// Gets data about a single user, by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.username }).then(user => {
        if (user) {
            res.status(201).json(user);
        } else {
            res.status(404).send('User with the username ' + req.params.username + ' was not found.');
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Gets description of a given genre
app.get('/movies/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.name }).then(movie => {
        if (movie) {
            res.status(201).send(movie.Genre.Description);
        } else {
            res.status(404).send('Genre with the name ' + req.params.name + ' was not found.')
        }
    });
});

// Gets data about a director, by name
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name }).then(movie => {
        if (movie) {
            res.status(201).json(movie.Director);
        } else {
            res.status(404).send('Director with the name ' + req.params.name + ' was not found.')
        }
    });
});

// Adds new user doc to users collection
app.post('/users',
    [   // Validation checks
        check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }),
        check('Username', 'Username must contain only alphanumeric characters').isAlphanumeric(),
        check('Password', 'Password must be at least 8 characters').isLength({ min: 8 }),
        check('Email', 'Email does not appear to be valid').isEmail(),
        check('Birthday', 'Birthday must use format MM/DD/YY').optional({ checkFalsy: true }).isDate({ format: 'MM/DD/YY' })
    ],
    (req, res) => {
        // First check for validation errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }).then(user => {
            if (user) {
                res.status(400).send('Username ' + req.body.Username + ' already exists');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                    FavoriteMovies: []
                })
                    .then(user => { res.status(201).json(user) })
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
app.put('/users/:username', passport.authenticate('jwt', { session: false }),
    [   // Validation checks
        check('Username', 'Username must be at least 5 characters').optional({ checkFalsy: true }).isLength({ min: 5 }),
        check('Username', 'Username must contain only alphanumeric characters').optional({ checkFalsy: true }).isAlphanumeric(),
        check('Password', 'Password must be at least 8 characters').optional({ checkFalsy: true }).isLength({ min: 8 }),
        check('Email', 'Email does not appear to be valid').optional({ checkFalsy: true }).isEmail(),
        check('Birthday', 'Birthday must use format MM/DD/YY').optional({ checkFalsy: true }).isDate({ format: 'MM/DD/YY' })
    ],
    (req, res) => {
        // First check for validation errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = '';
        console.log(`initial password field: ${hashedPassword}`);
        console.log(`initial hashedpassword: ${hashedPassword}`);
        if (!req.body.Password == '') {
            hashedPassword = Users.hashPassword(req.body.Password);
            console.log('if statement called!');
        }
        const obj = {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
        console.log(obj);
        // Only passes non-empty fields into update object
        Object.keys(obj).forEach((i) => obj[i] == '' && delete obj[i]);

        Users.findOneAndUpdate({ Username: req.params.username }, {
            $set: obj
        }, { new: true })
            .then(user => { res.status(201).json(user) })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

// Adds movie to user's list of favorite movies
app.post('/users/:username/FavoriteMovies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $addToSet: { FavoriteMovies: req.params.movieid }   // WON'T THROW ERROR IF MOVIE ALREADY PRESENT
    }, { new: true })
        .then(user => { res.status(201).json(user) })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Deletes a movie from user's list by title
app.delete('/users/:username/FavoriteMovies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $pull: { FavoriteMovies: req.params.movieid }
    }, { new: true })
        .then(user => { res.status(200).send('Movie ' + req.params.movieid + ' was deleted from ' + user.Username + '\'s list.') })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Deletes a user from users collection by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
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
const port = process.env.PORT || 8081;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});