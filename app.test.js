/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
/* eslint global-require: 0 */

const request = require('supertest');
const app = require('./app');

describe('Testing the API', () => {
  // albums

  test('POST requests for albums', async () => request(app).post('/albums/add')
    .field('title', 'rimbaud')
    .field('artist', 'rimbaud')
    .field('releaseYear', '1854')
    .attach('albumCover', 'testimg.jpg')
    .expect(200));

  test('If albums have previously be posted, when the album request is made the response is a HTTP 200 code', () => request(app)
    .get('/albums')
    .expect(200));

  test('Deleting a previously added album, response code 200', () => {
    const listOfAlbums = require('./api/albums/albums.json');
    const testAlbum = listOfAlbums[listOfAlbums.length - 1];

    return request(app)
      .delete(`/albums/${testAlbum.Id}`)
      .send(testAlbum)
      .expect(200);
  });


  // books

  test('POST requests for books', async () => request(app).post('/books/add')
    .field('title', 'rimbaud')
    .field('author', 'rimbaud')
    .field('releaseYear', '1854')
    .attach('bookCover', 'testimg.jpg')
    .expect(200));

  test('If albums have previously be posted, when the album request is made the response is a HTTP 200 code', () => request(app)
    .get('/books')
    .expect(200));

  test('Deleting a previously added album, response code 200', () => {
    const listOfBooks = require('./api/books/books.json');
    const testBook = listOfBooks[listOfBooks.length - 1];

    return request(app)
      .delete(`/books/${testBook.Id}`)
      .send(testBook)
      .expect(200);
  });


  // films

  test('POST requests for albums', async () => request(app).post('/films/add')
    .field('title', 'rimbaud')
    .field('director', 'rimbaud')
    .field('releaseYear', '1854')
    .attach('filmPoster', 'testimg.jpg')
    .expect(200));

  test('If films have previously be posted, when the GET request is made the response is a HTTP 200 code', () => request(app)
    .get('/films')
    .expect(200));

  test('Deleting a previously added film, response code 200', () => {
    const listOfFilms = require('./api/films/films.json');
    const testFilm = listOfFilms[listOfFilms.length - 1];

    return request(app)
      .delete(`/films/${testFilm.Id}`)
      .send(testFilm)
      .expect(200);
  });
});
