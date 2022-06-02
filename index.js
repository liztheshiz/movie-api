// IMPORTED MODULES
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

const app = express();

// MIDDLEWARE
app.use(morgan('common'));
app.use(bodyParser.json());
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

// Gets the data about a genre, by name
app.get('/movies/:genre', (req, res) => {
    
});

// Gets the data about a director, by name
app.get('/movies/:director', (req, res) => {
    
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

// Update the "name" of a user by current name NEEDS WORK!!!!!!!!
app.put('/users/:name', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
  
    if (user) {
        user[req.params.name] = parseInt(req.params.name); // Unsure about this line of code!!
        res.status(201).send('User ' + req.params.name + ' was assigned new name ' + req.params.name + ' in ' + req.params.name);
    } else {
        res.status(404).send('User with the name ' + req.params.name + ' was not found.');
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