// the layout and content of the following has been moderately influenced by this youtube playlist: https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q

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
app.use((req, res, next) => { // eslint-disable-line consistent-return
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

module.exports = app;
