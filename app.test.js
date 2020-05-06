'use strict';

const app = require("./app");
const server = require("./src/server");
const fs = require('fs')
const request = require('supertest');

describe("Testing the API", () => {
 

  // albums

  test("POST requests for albums", async ()=>{
             
    return request(app).post("/albums/add")
            .field('title', 'rimbaud')
            .field('artist', 'rimbaud')
            .field('releaseYear', '1854')
            .attach('albumCover', 'testimg.jpg')
            .expect(200);          

  });
            
  test('If albums have previously be posted, when the album request is made the response is a HTTP 200 code', () => {

    return request(app)
            .get('/albums')
            .expect(200);

  });
    
  test('Deleting a previously added album, response code 200', () => {
        
    var listOfAlbums = require('./api/albums/albums.json')
    var testAlbum = listOfAlbums[listOfAlbums.length-1]

    return request(app)
            .delete(`/albums/${testAlbum.Id}`)
            .send(testAlbum)
            .expect(200);

  });


  // books

  test("POST requests for books", async ()=>{
             
    return request(app).post("/books/add")
            .field('title', 'rimbaud')
            .field('author', 'rimbaud')
            .field('releaseYear', '1854')
            .attach('bookCover', 'testimg.jpg')
            .expect(200);          

  });
            
  test('If albums have previously be posted, when the album request is made the response is a HTTP 200 code', () => {

    return request(app)
            .get('/books')
            .expect(200);

  });
    
  test('Deleting a previously added album, response code 200', () => {
        
    var listOfBooks = require('./api/books/books.json')
    var testBook = listOfBooks[listOfBooks.length-1]

    return request(app)
            .delete(`/books/${testBook.Id}`)
            .send(testBook)
            .expect(200);

  });


  // films

  test("POST requests for albums", async ()=>{
             
    return request(app).post("/films/add")
            .field('title', 'rimbaud')
            .field('director', 'rimbaud')
            .field('releaseYear', '1854')
            .attach('filmPoster', 'testimg.jpg')
            .expect(200);          

  });
            
  test('If films have previously be posted, when the GET request is made the response is a HTTP 200 code', () => {

    return request(app)
            .get('/films')
            .expect(200);

  });
    
  test('Deleting a previously added film, response code 200', () => {
        
    var listOfFilms = require('./api/films/films.json')
    var testFilm = listOfFilms[listOfFilms.length-1]

    return request(app)
            .delete(`/films/${testFilm.Id}`)
            .send(testFilm)
            .expect(200);

  });

    
      
      
});