/* eslint no-unused-vars: 0 */
/* eslint no-console: 0 */

// note: essentially all of the comments that appear in the "albums.js" file are relevant,
// perhaps only with slight alterations, to this file also, as the following is substantially
// based off of that file - with minor adjustments

const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uniqid = require('uniqid');

const id = uniqid();

// set storage for book images
const storage = multer.diskStorage({
  destination: './client/bookFiles/',
  filename(req, file, cb) {
    cb(null, id + path.extname(file.originalname));
  },
});

// initialize upload variable
const upload = multer({
  storage,
}).single('bookCover');

const router = express.Router();

const listOfBooks = require('./books.json');

router.get('/', (req, res, next) => {
  res.status(200).send(listOfBooks);
});

router.post('/add', upload, (req, res, next) => {
  const filePath = `http://localhost:3000/bookFiles/${req.file.filename}`;
  const newBook = {
    title: req.body.title,
    author: req.body.author,
    releaseYear: req.body.releaseYear,
    bookCover: req.file.destination + req.file.filename,
    path: filePath,
    Id: id,
  };

  listOfBooks.push(newBook);

  const newList = JSON.stringify(listOfBooks);
  fs.writeFile('./api/books/books.json', newList, 'utf8', console.log);

  res.status(200).send(newBook);
});


router.delete('/:Id', (req, res, next) => {
  const delBook = req.body;
  const delCover = delBook.bookCover;
  let i = 0;
  for (i = 0; i < listOfBooks.length; i++) {
    if (listOfBooks[i].Id === delBook.Id) {
      listOfBooks.splice(i, 1);
      break;
    }
  }

  fs.unlink(delCover, (err) => {
    if (err) {
      console.error(err);
    }
  });

  const newList = JSON.stringify(listOfBooks);
  fs.writeFile('./api/books/books.json', newList, 'utf8', console.log);
  res.status(200).send(`Removed the book ${delBook.title} by ${delBook.author}`);
});


module.exports = router;
