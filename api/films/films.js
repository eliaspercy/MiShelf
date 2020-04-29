const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uniqid = require('uniqid');

const id = uniqid();

// set storage for film images
const storage = multer.diskStorage({
  destination: './api/films/filmImages/',
  filename(req, file, cb) {
    cb(null, id + path.extname(file.originalname));
  },
});

// initialize upload variable
const upload = multer({
  storage,
}).single('filmPoster');

const router = express.Router();

const listOfFilms = require('./films.json');

router.get('/', (req, res, next) => {
  res.status(200).send(listOfFilms);
});

router.post('/', upload, (req, res, next) => {
  const newFilm = {
    title: req.body.title,
    director: req.body.director,
    releaseYear: req.body.releaseYear,
    filmPoster: req.file.destination + req.file.filename,
    Id: id,
  };
  listOfFilms.push(newFilm);
  const newList = JSON.stringify(listOfFilms);
  fs.writeFile('./api/films/films.json', newList, 'utf8', console.log);
  res.status(200).send(newFilm);
});

router.delete('/:Id', (req, res, next) => {
  const delFilm = req.body;
  const delPoster = delFilm.filmPoster;
  let i = 0;
  for (i = 0; i < listOfFilms.length; i++) {
    if (listOfFilms[i].Id === delFilm.Id) {
      listOfFilms.splice(i, 1);
      break;
    }
  }
  fs.unlink(delPoster, (err) => {
    if (err) {
      console.error(err);
    }
  });
  const newList = JSON.stringify(listOfFilms);
  fs.writeFile('./api/films/films.json', newList, 'utf8', console.log);
  res.status(200).send(`Removed the film ${delFilm.title}, directed by ${delFilm.director}`);
});

module.exports = router;
