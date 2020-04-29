const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uniqid = require('uniqid');

const id = uniqid();

// set storage for album images
const storage = multer.diskStorage({
  destination: './api/albums/albumImages/',
  filename(req, file, cb) {
    cb(null, id + path.extname(file.originalname));
  },
});

// initialize upload variable
const upload = multer({
  storage,
}).single('albumCover');

const router = express.Router();

const listOfAlbums = require('./albums.json');

router.get('/', (req, res, next) => {
  res.status(200).send(listOfAlbums);
});


router.post('/', upload, (req, res, next) => {
  // id required to differentiate b/t albums of the same title
  const newAlbum = {
    title: req.body.title,
    artist: req.body.artist,
    releaseYear: req.body.releaseYear,
    albumCover: req.file.destination + req.file.filename,
    Id: id
  };
  // const albumCover = req.file;
  // console.log(albumCover);

  listOfAlbums.push(newAlbum);

  const newList = JSON.stringify(listOfAlbums);
  fs.writeFile('./api/albums/albums.json', newList, 'utf8', console.log);

  res.status(200).send(newAlbum);
});


router.delete('/:Id', (req, res, next) => {
  const delAlbum = req.body;
  const delCover = delAlbum.albumCover;
  let i = 0;
  for (i = 0; i < listOfAlbums.length; i++) {
    if (listOfAlbums[i].Id === delAlbum.Id) {
      listOfAlbums.splice(i, 1);
      break;
    }
  }

  fs.unlink(delCover, (err) => {
    if (err) {
      console.error(err);
    }
  });

  const newList = JSON.stringify(listOfAlbums);
  fs.writeFile('./api/albums/albums.json', newList, 'utf8', console.log);
  res.status(200).send(`Removed the album ${delAlbum.title} by ${delAlbum.artist}`);
});


module.exports = router;
