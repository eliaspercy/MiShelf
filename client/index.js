// initialising constants
const notificationText = document.getElementById('notification');
const theAlbumsText = document.getElementById('theAlbumsText');
const theBooksText = document.getElementById('theBooksText');
const theFilmsText = document.getElementById('theFilmsText');
const pic = document.getElementById('pic');
const theAlbums = document.getElementById('theAlbums');
const theBooks = document.getElementById('theBooks');
const theFilms = document.getElementById('theFilms');
const albumsGet = document.getElementById('albumsGet');
const albumAddingForm = document.getElementById('albumAddingForm');
const booksGet = document.getElementById('booksGet');
const bookAddingForm = document.getElementById('bookAddingForm');
const filmsGet = document.getElementById('filmsGet');
const filmAddingForm = document.getElementById('filmAddingForm');
const albumsSort = document.getElementById('albumsSort');
const booksSort = document.getElementById('booksSort');
const filmsSort = document.getElementById('filmsSort');
const charts = document.getElementById('theCharts');
const chartsText = document.getElementById('theChartsText');
const sortBtns = document.getElementById('sortBtns');
const albumArtistSort = document.getElementById('albumArtistSort');
const albumTitleSort = document.getElementById('albumTitleSort');
const albumYearSort = document.getElementById('albumYearSort');
const bookAuthorSort = document.getElementById('bookAuthorSort');
const bookTitleSort = document.getElementById('bookTitleSort');
const bookYearSort = document.getElementById('bookYearSort');
const filmDirectorSort = document.getElementById('filmDirectorSort');
const filmTitleSort = document.getElementById('filmTitleSort');
const filmYearSort = document.getElementById('filmYearSort');
const randomAlbum = document.getElementById('albumRandomSelect');
const randomBook = document.getElementById('bookRandomSelect');
const randomFilm = document.getElementById('filmRandomSelect');
const randomAlbumDiv = document.getElementById('randomAlbum');
const randomBookDiv = document.getElementById('randomBook');
const randomFilmDiv = document.getElementById('randomFilm');
const showAll = document.getElementById('showAll');
const ifRead = document.getElementById('read');
const ifUnread = document.getElementById('unread');
const randomItemSelector = document.getElementById('randomSelect');
const randomBtn = document.getElementById('randomBtn');

let listOfAlbums;
let listOfBooks;
let listOfFilms;

const read = [];
const unread = [];

const { body } = document;
const html = document.documentElement;

// Calculating the clients genuine height and applying values for the height of the
// picture-containing div in addition to the height of any inter-scrollable divs
// within the page.
const height = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight,
);
const picHeight = height - 100;
const scrollHeight = picHeight - 195;


// initializing text in the HTML
notificationText.innerHTML = 'Welcome back fella!';
theAlbumsText.innerHTML = 'Click GET for list of albums';
theBooksText.innerHTML = 'Click GET for list of books';
theFilmsText.innerHTML = 'Click GET for list of films';

// function for catching errors after a
function errorCatch(err) {
  console.log(err); // eslint-disable-line no-console
  notificationText.innerHTML = `Oops, something went wrong! (${err})`;
  if (err.message === 'NetworkError when attempting to fetch resource.') {
    alert('The server is not running!'); // eslint-disable-line no-alert
  }
}

// function for capitalising the premier letter of a string, applied when inserting
// itemType variables into the HTML in cases where the itemType is at the beginning
// of the sentence or is a header
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// words and phrases used for incorporation into notification text
const words = ['Groovy', 'Excellent', 'How cool', 'Nice one', 'Sweet', 'Swell', 'Utter pengness', 'Rate that', 'Coolio'];

// generates a totally random number, using maths
function randGen(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// generates the sentence appearing in the notification bar following a successful HTTP request
function sentence(method, itemType, data) {
  if (method === 'POST') {
    if (itemType === 'album') {
      notificationText.innerHTML = `Added the album ${data.title} by ${data.artist}. ${randGen(words)}!`;
    } else if (itemType === 'book') {
      notificationText.innerHTML = `Added the book ${data.title} by ${data.author}. ${randGen(words)}!`;
    } else if (itemType === 'film') {
      notificationText.innerHTML = `Added the film ${data.title}, directed by ${data.director}. ${randGen(words)}!`;
    }
  } else if (method === 'GET') {
    if (itemType === 'album') {
      notificationText.innerHTML = 'Albums updated.';
    } else if (itemType === 'book') {
      notificationText.innerHTML = 'Books updated.';
    } else if (itemType === 'film') {
      notificationText.innerHTML = 'Films updated.';
    }
  } else if (method === 'DELETE') {
    if (itemType === 'album') {
      notificationText.innerHTML = `Deleted the album ${data.title} by ${data.artist}. `;
    } else if (itemType === 'book') {
      notificationText.innerHTML = `Deleted the book ${data.title} by ${data.author}. `;
    } else if (itemType === 'film') {
      notificationText.innerHTML = `Deleted the film ${data.title}, directed by ${data.director}. `;
    }
  }
}


// uses the file location to exhibit the image associated with the corresponding item
function displayImage(path) {
  pic.src = path;
  pic.style.display = 'block';
  pic.style.maxHeight = `${picHeight}px`;
  pic.style.width = 'auto';
  pic.style.maxWidth = '90%';
}

// randomly chooses an item from a list, conveyed via the notification bar
function randomSelect(itemType, items) {
  if (items.length === 0) {
    notificationText.innerHTML = "Can't randomly select from nothing!";
  }
  const randomItem = randGen(items);
  notificationText.innerHTML = `Random ${itemType} selected: ${randomItem.title} by ${(itemType === 'album') ? randomItem.artist : (itemType === 'book') ? randomItem.author : randomItem.director}. ${randGen(words)}!`;
  displayImage(randomItem.path);
}

// catch-all function for sending HTTP requests
const sendHttpRequest = async (method, url, itemType, data, item) => fetch(url, {
  method,
  body: (method === 'DELETE') ? JSON.stringify(data) : data,
  headers: (method === 'DELETE') ? { 'Content-Type': 'application/json' } : {},
}).then((response) => {
  sentence(method, itemType, item);
  if (response.status >= 400) {
    return response.json().then((errResData) => {
      const error = new Error('Oops');
      error.data = errResData;
      throw error;
    });
  }
  if (method === 'GET') {
    return response.json();
  }
  return response;
});

// function for creating the lists via appending new elements to the
// HTML containing variable information
function appender(itemType, data, i) {
  const newItem = document.createElement('DIV');
  const newLine = document.createElement('P');
  const deleteBtn = document.createElement('BUTTON');
  const displayBtn = document.createElement('BUTTON');
  const whiteSpace = document.createElement('P');
  whiteSpace.innerHTML = '<br>';
  const tempIds = [];
  const untempIds = [];
  let k = 0;
  for (k = 0; k < read.length; k++) {
    tempIds.push(read[k].Id);
  }
  for (k = 0; k < unread.length; k++) {
    untempIds.push(unread[k].Id);
  }
  if (tempIds.includes(data.Id)) {
    newLine.style.color = 'green';
  } else if (untempIds.includes(data.Id)) {
    newLine.style.color = 'red';
  }
  let txt;
  if (itemType === 'album') {
    newLine.innerHTML = `<strong>${data.title}</strong>, recorded by <strong>${data.artist}</strong> (${data.releaseYear}) <b>`;
    txt = 'listened';
  } else if (itemType === 'book') {
    newLine.innerHTML = `<strong>${data.title}</strong>, written by <strong>${data.author}</strong> (${data.releaseYear}) <b>`;
    txt = 'read';
  } else if (itemType === 'film') {
    newLine.innerHTML = `<strong>${data.title}</strong>, directed by <strong>${data.director}</strong> (${data.releaseYear}) <b>`;
    txt = 'watched';
  }
  deleteBtn.innerHTML = `Delete ${itemType}`;
  deleteBtn.onclick = () => {
    notificationText.innerHTML = `Deleting ${itemType}...`;
    let j = 0;
    for (j = 0; i < read.length; j++) {
      if (read.length === 0) {
        break;
      }
      if (read[j].Id === data.Id) {
        read.splice(j, 1);
        break;
      }
    }
    for (j = 0; j < unread.length; j++) {
      if (unread.length === 0) {
        break;
      }
      if (unread[j].Id === data.Id) {
        unread.splice(j, 1);
        break;
      }
    }
    sendHttpRequest('DELETE', `http://localhost:3000/${itemType}s/${data.Id}`, itemType, data, data)
      .catch((err) => {
        errorCatch(err);
      });
  };
  displayBtn.innerHTML = `Show ${(itemType === 'film') ? 'poster' : 'cover'}`;
  displayBtn.onclick = () => {
    displayImage(data.path);
  };
  newLine.onclick = () => {
    if (!newLine.style.color) {
      newLine.style.color = 'green';
      read.push(data);
      notificationText.innerHTML = `Marked ${data.title} as ${txt}`;
    } else if (newLine.style.color === 'green') {
      newLine.style.color = 'red';
      unread.push(data);
      let j = 0;
      for (j = 0; j <= read.length; j++) {
        if (read[j].Id === data.Id) {
          read.splice(j, 1);
          break;
        }
      }
      notificationText.innerHTML = `Marked ${data.title} as un${txt}`;
    } else {
      newLine.style.color = null;
      let j = 0;
      for (j = 0; j <= unread.length; j++) {
        if (unread[j].Id === data.Id) {
          unread.splice(j, 1);
          break;
        }
      }
      notificationText.innerHTML = `Unmarked ${data.title}`;
    }
  };
  newItem.append(newLine);
  newItem.append(displayBtn);
  newItem.append(deleteBtn);
  newItem.append(whiteSpace);
  return newItem;
}


let theItems;
let itemsSort;
let theItemsText;
let randomItemDiv;

// generic catch-all function for all get requests in this app
function getRequest(itemType) {
  notificationText.innerHTML = `Retrieving ${itemType}s...`;
  if (itemType === 'album') {
    theItems = theAlbums;
    itemsSort = albumsSort;
    theItemsText = theAlbumsText;
    randomItemDiv = randomAlbumDiv;
  } else if (itemType === 'book') {
    theItems = theBooks;
    itemsSort = booksSort;
    theItemsText = theBooksText;
    randomItemDiv = randomBookDiv;
  } else if (itemType === 'film') {
    theItems = theFilms;
    itemsSort = filmsSort;
    theItemsText = theFilmsText;
    randomItemDiv = randomFilmDiv;
  }
  theItems.style.height = `${scrollHeight}px`;
  itemsSort.style.display = 'block';
  randomItemDiv.style.display = 'block';
  theItems.innerHTML = '';
  sendHttpRequest('GET', `http://localhost:3000/${itemType}s`, itemType)
    .then((responseData) => {
      pic.setAttribute('alt', `${capitalise(itemType)} has been deleted...`);
      if (responseData.length === 0) {
        theItemsText.innerHTML = `No ${itemType}s have been added! <br> <br>`;
      } else {
        theItemsText.innerHTML = `<br>${capitalise(itemType)}s: (click GET to update) <br> <br>`;
        let i;
        for (i = 0; i < responseData.length; i++) {
          theItems.append(appender(itemType, responseData[i], i, responseData));
        }
      }
      if (itemType === 'album') {
        listOfAlbums = responseData;
      } else if (itemType === 'book') {
        listOfBooks = responseData;
      } else if (itemType === 'film') {
        listOfFilms = responseData;
      }
    })
    .catch((err) => {
      errorCatch(err);
    });
}

// generic catch-all function for all post requests in this app
function postRequests(itemType, form) { // eslint-disable-line consistent-return
  notificationText.innerHTML = `Adding ${itemType}s...`;
  const fd = new FormData(form);
  let data;
  if (itemType === 'album') {
    data = {
      title: fd.get('title'),
      artist: fd.get('artist'),
      releaseYear: fd.get('releaseYear'),
      albumCover: fd.get('albumCover'),
    };
  } else if (itemType === 'book') {
    data = {
      title: fd.get('title'),
      author: fd.get('author'),
      releaseYear: fd.get('releaseYear'),
      bookCover: fd.get('bookCover'),
    };
  } else if (itemType === 'film') {
    data = {
      title: fd.get('title'),
      director: fd.get('director'),
      releaseYear: fd.get('releaseYear'),
      filmPoster: fd.get('filmPoster'),
    };
  }
  if (
    !data.title
    || !(data.artist || data.author || data.director)
    || !data.releaseYear
    || !(data.albumCover || data.bookCover || data.filmPoster)
  ) {
    notificationText.innerHTML = `Tried to add ${(itemType === 'album') ? 'an' : 'a'} ${itemType}... but failed!`;
    return alert('Insufficient input!'); // eslint-disable-line no-alert
  }
  sendHttpRequest('POST', `http://localhost:3000/${itemType}s/add`, itemType, fd, data)
    .catch((err) => {
      errorCatch(err);
    });
}


// albums
albumsGet.onclick = () => { getRequest('album'); };
albumAddingForm.onsubmit = (e) => {
  e.preventDefault();
  postRequests('album', albumAddingForm);
};
randomAlbum.onclick = () => { randomSelect('album', listOfAlbums); };


// books
booksGet.onclick = () => { getRequest('book'); };
bookAddingForm.onsubmit = (e) => {
  e.preventDefault();
  postRequests('book', bookAddingForm);
};
randomBook.onclick = () => { randomSelect('book', listOfBooks); };


// films
filmsGet.onclick = () => { getRequest('film'); };
filmAddingForm.onsubmit = (e) => {
  e.preventDefault();
  postRequests('film', filmAddingForm);
};
randomFilm.onclick = () => { randomSelect('film', listOfFilms); };


// chart/list generator/filter

let sortedItems;
let toShow;
let type;

// obtains the part of a string occurring after "&&", for when dealing with filters
function getId(str) {
  return str.split('&&')[1];
}

// function for appending the data to the middle div
function chartsAppend(itemList, itemType) {
  charts.innerHTML = '';
  let i = 0;
  for (i = 0; i < itemList.length; i++) {
    if (i === 0) {
      charts.innerHTML = `${(i + 1).toString()}.  <strong>${itemList[i].title}</strong> by <strong>${(itemType === 'album') ? itemList[i].artist : (itemType === 'book') ? itemList[i].author : itemList[i].director}</strong> (${itemList[i].releaseYear}) <b>`;
    } else {
      charts.innerHTML = `${charts.innerHTML}<br> <br>${(i + 1).toString()}.  <strong>${itemList[i].title}</strong> by <strong>${(itemType === 'album') ? itemList[i].artist : (itemType === 'book') ? itemList[i].author : itemList[i].director}</strong> (${itemList[i].releaseYear}) <b>`;
    }
  }
}

// function for dealing with the filters, for sorting items
function listFilter(filter, itemType) {
  let lst;
  charts.style.height = `${scrollHeight}px`;
  sortBtns.style.display = 'block';
  randomBtn.style.display = 'block';
  notificationText.innerHTML = `Sorting ${itemType}s...`;
  charts.innerHTML = '';
  chartsText.innerHTML = `<center><br> Sorted ${itemType}s:</center> <br>`;
  if (itemType === 'album') {
    lst = listOfAlbums;
    type = 'album';
    ifRead.innerHTML = 'Show listened';
    ifUnread.innerHTML = 'Show unlistened';
    randomItemSelector.innerHTML = 'Get a random album from list';
  } else if (itemType === 'book') {
    lst = listOfBooks;
    type = 'book';
    ifRead.innerHTML = 'Show read';
    ifUnread.innerHTML = 'Show unread';
    randomItemSelector.innerHTML = 'Get a random book from list';
  } else if (itemType === 'film') {
    lst = listOfFilms;
    type = 'film';
    ifRead.innerHTML = 'Show watched';
    ifUnread.innerHTML = 'Show unwatched';
    randomItemSelector.innerHTML = 'Get a random film from list';
  }
  let filterList = [];
  let i = 0;
  let j = 0;
  if (filter === 'title') {
    for (i = 0; i < lst.length; i++) {
      filterList.push(`${lst[i].title}&&${lst[i].Id}`);
    }
    notificationText.innerHTML = `Sorted ${itemType}s by title`;
  } else if (filter === 'artist') {
    if (itemType === 'album') {
      for (i = 0; i < lst.length; i++) {
        filterList.push(`${lst[i].artist}&&${lst[i].Id}`);
      }
    } else if (itemType === 'book') {
      for (i = 0; i < lst.length; i++) {
        filterList.push(`${lst[i].author}&&${lst[i].Id}`);
      }
    } else if (itemType === 'film') {
      for (i = 0; i < lst.length; i++) {
        filterList.push(`${lst[i].director}&&${lst[i].Id}`);
      }
    }
    notificationText.innerHTML = `Sorted ${itemType}s by ${(itemType === 'album') ? 'artist' : (itemType === 'book') ? 'author' : 'director'}`;
  } else if (filter === 'year') {
    for (i = 0; i < lst.length; i++) {
      filterList.push(`${lst[i].releaseYear}&&${lst[i].Id}`);
    }
    notificationText.innerHTML = `Sorted ${itemType}s by release year`;
  }
  filterList = filterList.sort();
  const sortedIds = [];
  for (i = 0; i < filterList.length; i++) {
    sortedIds.push(getId(filterList[i]));
  }
  sortedItems = [];
  for (i = 0; i < sortedIds.length; i++) {
    for (j = 0; j < sortedIds.length; j++) {
      if (sortedIds[i] === lst[j].Id) {
        sortedItems.push(lst[j]);
      }
    }
  }
  toShow = sortedItems;
  for (i = 0; i < sortedItems.length; i++) {
    if (i === 0) {
      charts.innerHTML = `${(i + 1).toString()}.  <strong>${sortedItems[i].title}</strong> by <strong>${(itemType === 'album') ? sortedItems[i].artist : (itemType === 'book') ? sortedItems[i].author : sortedItems[i].director}</strong> (${sortedItems[i].releaseYear}) <b>`;
    } else {
      charts.innerHTML = `${charts.innerHTML}<br> <br>${(i + 1).toString()}.  <strong>${sortedItems[i].title}</strong> by <strong>${(itemType === 'album') ? sortedItems[i].artist : (itemType === 'book') ? sortedItems[i].author : sortedItems[i].director}</strong> (${sortedItems[i].releaseYear}) <b>`;
    }
  }
}

// function for dealing with filtering read and unread items
function isRead(itemType, action) {
  toShow = [];
  let i = 0;
  const Ids = [];
  const lst = (action === 'read') ? read : unread;
  if (itemType === 'album') {
    notificationText.innerHTML = (action === 'read') ? 'Displaying albums marked as listened' : 'Displaying albums marked as unlistened';
  } else if (itemType === 'book') {
    notificationText.innerHTML = (action === 'read') ? 'Displaying books marked as read' : 'Displaying books marked as unread';
  } else if (itemType === 'film') {
    notificationText.innerHTML = (action === 'read') ? 'Displaying films marked as watched' : 'Displaying films marked as unwatched';
  }
  for (i = 0; i < lst.length; i++) {
    Ids.push(lst[i].Id);
  }
  for (i = 0; i < sortedItems.length; i++) {
    if (Ids.includes(sortedItems[i].Id)) {
      toShow.push(sortedItems[i]);
    }
  }
  chartsAppend(toShow, itemType);
}

// for displaying all items
function show(itemType) {
  notificationText.innerHTML = `Showing all ${itemType}s`;
  charts.innerHTML = '';
  toShow = sortedItems;
  chartsAppend(toShow, itemType);
}

// event listeners
albumArtistSort.addEventListener('click', () => { listFilter('artist', 'album'); });
albumTitleSort.addEventListener('click', () => { listFilter('title', 'album'); });
albumYearSort.addEventListener('click', () => { listFilter('year', 'album'); });
bookAuthorSort.addEventListener('click', () => { listFilter('artist', 'book'); });
bookTitleSort.addEventListener('click', () => { listFilter('title', 'book'); });
bookYearSort.addEventListener('click', () => { listFilter('year', 'book'); });
filmDirectorSort.addEventListener('click', () => { listFilter('artist', 'film'); });
filmTitleSort.addEventListener('click', () => { listFilter('title', 'film'); });
filmYearSort.addEventListener('click', () => { listFilter('year', 'film'); });
randomItemSelector.addEventListener('click', () => { randomSelect(type, toShow); });
ifRead.addEventListener('click', () => { isRead(type, 'read'); });
ifUnread.addEventListener('click', () => { isRead(type, 'unread'); });
showAll.addEventListener('click', () => { show(type); });
