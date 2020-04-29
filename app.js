const express = require('express');

const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

// routes
const routeToAlbums = require('./api/albums/albums');
const routeToBooks = require('./api/books/books');
const routeToFilms = require('./api/films/films');


// for logging requests to console
app.use(morgan('dev'));

// body parser, extract JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// static file director
app.use(express.static('client'));

// handling CORS errors
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    '*',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, PATCH, DELETE, GET',
    );
    return res.status(200).json({});
  }
  next();
});

// route for handling requests
app.use('/albums', routeToAlbums);
app.use('/books', routeToBooks);
app.use('/films', routeToFilms);

// error handling
app.use((req, res, next) => {
  const error = new Error('error handling');
  error.status = 404;
  next(error);
});

// handle errors from anywhere in the app
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});


module.exports = app;