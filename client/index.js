// const albumsGet = document.getElementById('albumsGet');
// const albumAddingForm = document.getElementById('albumAddingForm');
const notificationText = document.getElementById('notification');
const theAlbums = document.getElementById('theAlbums');
const theBooks = document.getElementById('theBooks');
const theFilms = document.getElementById('theFilms');
const displayArea = document.getElementById('display');
const pic = document.getElementById('pic');
const getZone = document.getElementById('scrollable');
const charts = document.getElementById('theCharts');
const fiters = document.getElementById('fitlers');
const albumsSort = document.getElementById('albumsSort');
const booksSort = document.getElementById('booksSort');
const filmsSort = document.getElementById('filmsSort');
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

const showAll = document.getElementById('showAll');
const ifRead = document.getElementById('read');
const ifUnread = document.getElementById('unread');


var listOfAlbums;
var listOfBooks;
var listOfFilms;

var listened = [];
var unlistened = [];
var read = [];
var unread = [];
var watched = [];
var unwatched = [];

pic.src = 'placeholder.jpg';

const { body } = document;
const html = document.documentElement;

const height = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight,
);
const picHeight = height - 400;
const scrollHeight = picHeight - 60;


notificationText.innerHTML = 'Welcome back fella!';
theAlbums.innerHTML = 'Click GET for list of albums';
theBooks.innerHTML = 'Click GET for list of books';
theFilms.innerHTML = 'Click GET for list of films';




const sendHttpRequest = async (method, url, itemType, data, item) => fetch(url, {
  method,
  body: (method === 'DELETE') ? JSON.stringify(data) : data,
  headers: (method === 'DELETE') ? { 'Content-Type': 'application/json' } : {},
}).then((response) => {
  sentence(notificationText, method, itemType, item);
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


const words = ['Groovy', 'Excellent', 'How cool', 'Nice one', 'Sweet', 'Swell', 'Utter pengness', 'Rate that', 'Coolio'];


function randGen(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function sentence(textDestination, method, itemType, data) {
  if (method === 'POST') {
    if (itemType === 'album') {
      textDestination.innerHTML = `Added the album ${data.title} by ${data.artist}. ${randGen(words)}!`;
    } else if (itemType === 'book') {
      textDestination.innerHTML = `Added the book ${data.title} by ${data.author}. ${randGen(words)}!`;
    } else if (itemType === 'film') {
      textDestination.innerHTML = `Added the film ${data.title}, directed by ${data.director}. ${randGen(words)}!`;
    }
  } else if (method === 'GET') {
    if (itemType === 'album') {
      textDestination.innerHTML = 'Albums updated.';
    } else if (itemType === 'book') {
      textDestination.innerHTML = 'Books updated.';
    } else if (itemType === 'film') {
      textDestination.innerHTML = 'Films updated.';
    }
  } else if (method === 'DELETE') {
    if (itemType === 'album') {
      textDestination.innerHTML = `Deleted the album ${data.title} by ${data.artist}. `;
    } else if (itemType === 'book') {
      textDestination.innerHTML = `Deleted the book ${data.title} by ${data.author}. `;
    } else if (itemType === 'film') {
      textDestination.innerHTML = `Deleted the film ${data.title}, directed by ${data.director}. `;
    }
  }
}

function randomSelect(itemType, items) {
  notificationText.innerHTML = `Random ${itemType} selected: ${randGen(items)}`;
}


function appender(itemType, data, i) {
  const newItem = document.createElement('DIV');
  const newLine = document.createElement('P');
  const deleteBtn = document.createElement('BUTTON');
  const displayBtn = document.createElement('BUTTON');
  const whiteSpace = document.createElement('P');
  whiteSpace.innerHTML = '<br>';
  newLine.setAttribute('id', itemType + (i + 1).toString());
  newLine.setAttribute('class', data.title);


  if (itemType === 'album') {

    let listenedIds = []
    let unlistenedIds = []
    let k = 0
    for (k = 0; k < listened.length; k++) {
      listenedIds.push(listened[k].Id);
    };
    for (k = 0; k < unlistened.length; k++) {
      unlistenedIds.push(unlistened[k].Id);
    };
    if (listenedIds.includes(data.Id)) {
      newLine.style.color = 'green';
    } else if (unlistenedIds.includes(data.Id)) {
      newLine.style.color = 'red';
    };

    newLine.innerHTML = `<strong>${data.title}</strong> by <strong>${data.artist}</strong> (${data.releaseYear}) <b>`;

    deleteBtn.innerHTML = 'Delete album';
    deleteBtn.onclick = async () => {
      notificationText.innerHTML = 'Deleting album...';
      sendHttpRequest('DELETE', `http://localhost:3000/albums/${data.Id}`, 'album', data, data);
    };

    displayBtn.innerHTML = 'Show cover';
    displayBtn.onclick = async () => {
      const sourceOfPicture = `.${data.albumCover}`;
      pic.src = sourceOfPicture;
      pic.style.display = 'block';
      pic.style.height = `${picHeight}px`;
    };

    newLine.onclick = async () => {
      if (!newLine.style.color) {
        newLine.style.color = 'green';
        listened.push(data);
        notificationText.innerHTML = `Marked ${data.title} as listened`;

      } else if (newLine.style.color === 'green') {
        newLine.style.color = 'red';
        unlistened.push(data);
        let j = 0;
        for (j = 0; j < listened.length; j++) {
          if (listened[j].Id === data.Id) {
            listened.splice(j, 1);
            break;
          };  
        };
        notificationText.innerHTML = `Marked ${data.title} as unlistened`;

      } else {
        newLine.style.color = null;
        let j = 0;
        for (j = 0; j < unlistened.length; j++) {
          if (unlistened[j].Id === data.Id) {
            unlistened.splice(j, 1);
            break;
          };  
        };
        notificationText.innerHTML = `Unmarked ${data.title}`;
      };
    };
  } else if (itemType === 'book') {

    let readIds = []
    let unreadIds = []
    let k = 0
    for (k = 0; k < read.length; k++) {
      readIds.push(read[k].Id);
    };
    for (k = 0; k < unread.length; k++) {
      unreadIds.push(unread[k].Id);
    };
    if (readIds.includes(data.Id)) {
      newLine.style.color = 'green';
    } else if (unreadIds.includes(data.Id)) {
      newLine.style.color = 'red';
    };

    newLine.innerHTML = `<strong>${data.title}</strong> by <strong>${data.author}</strong> (${data.releaseYear}) <b>`;
    deleteBtn.innerHTML = 'Delete book';
    deleteBtn.onclick = async () => {
      notificationText.innerHTML = 'Deleting book...';
      sendHttpRequest('DELETE', `http://localhost:3000/books/${data.Id}`, 'book', data, data);
    };
    displayBtn.innerHTML = 'Show cover';
    displayBtn.onclick = async () => {
      const sourceOfPicture = `.${data.bookCover}`;
      pic.src = sourceOfPicture;
      pic.style.display = 'block';
      pic.style.height = `${picHeight}px`;
    };
    newLine.onclick = async () => {
      if (!newLine.style.color) {
        newLine.style.color = 'green';
        read.push(data);
        notificationText.innerHTML = `Marked ${data.title} as read`;

      } else if (newLine.style.color === 'green') {
        newLine.style.color = 'red';
        unread.push(data);
        let j = 0;
        for (j = 0; j < read.length; j++) {
          if (read[j].Id === data.Id) {
            read.splice(j, 1);
            break;
          };  
        };
        notificationText.innerHTML = `Marked ${data.title} as unread`;
        
      } else {
        newLine.style.color = null;
        let j = 0;
        for (j = 0; j < unread.length; j++) {
          if (unread[j].Id === data.Id) {
            unread.splice(j, 1);
            break;
          };  
        };
        notificationText.innerHTML = `Unmarked ${data.title}`;
      };
    };
  } else if (itemType === 'film') {

    let watchedIds = []
    let unwatchedIds = []
    let k = 0
    for (k = 0; k < watched.length; k++) {
      watchedIds.push(watched[k].Id);
    };
    for (k = 0; k < unwatched.length; k++) {
      unwatchedIds.push(unwatched[k].Id);
    };
    if (watchedIds.includes(data.Id)) {
      newLine.style.color = 'green';
    } else if (unwatchedIds.includes(data.Id)) {
      newLine.style.color = 'red';
    };

    newLine.innerHTML = `<strong>${data.title}</strong>, directed by <strong>${data.director}</strong> (${data.releaseYear}) <b>`;
    deleteBtn.innerHTML = 'Delete film';
    deleteBtn.onclick = async () => {
      notificationText.innerHTML = 'Deleting film...';
      sendHttpRequest('DELETE', `http://localhost:3000/films/${data.Id}`, 'film', data, data);
    };
    displayBtn.innerHTML = 'Show poster';
    displayBtn.onclick = async () => {
      const sourceOfPicture = `.${data.filmPoster}`;
      pic.src = sourceOfPicture;
      pic.style.display = 'block';
      pic.style.height = `${picHeight}px`;
    };
    newLine.onclick = async () => {
      if (!newLine.style.color) {
        newLine.style.color = 'green';
        watched.push(data);
        notificationText.innerHTML = `Marked ${data.title} as watched`;

      } else if (newLine.style.color === 'green') {
        newLine.style.color = 'red';
        unwatched.push(data);
        let j = 0;
        for (j = 0; j < watched.length; j++) {
          if (watched[j].Id === data.Id) {
            watched.splice(j, 1);
            break;
          };  
        };
        notificationText.innerHTML = `Marked ${data.title} as unwatched`;
        
      } else {
        newLine.style.color = null;
        let j = 0;
        for (j = 0; j < unwatched.length; j++) {
          if (unwatched[j].Id === data.Id) {
            unwatched.splice(j, 1);
            break;
          };  
        };
        notificationText.innerHTML = `Unmarked ${data.title}`;
      };
    };
  }

  newItem.append(newLine);
  newItem.append(displayBtn);
  newItem.append(deleteBtn);
  newItem.append(whiteSpace);

  return newItem;
}


// albums
albumsGet.onclick = async () => {
  notificationText.innerHTML = 'Retrieving albums...';
  // pic.src = '';
  theAlbums.style.height = `${scrollHeight}px`;
  albumsSort.style.display = 'block';
  sendHttpRequest('GET', 'http://localhost:3000/albums', 'album')
    .then((responseData) => {
      console.log(responseData);
      if (responseData.length === 0) {
        theAlbums.innerHTML = 'No albums have been added! <br> <br>';
      } else {
        theAlbums.innerHTML = 'Albums: (click GET to update) <br> <br>';
        let i;
        for (i = 0; i < responseData.length; i++) {
          theAlbums.append(appender('album', responseData[i], i, responseData));
        };
      };
      listOfAlbums = responseData;
    })
    .catch((err) => {
      console.log(err);
      notificationText.innerHTML = `Oops, something went wrong! (${err})`;
    });
};


albumAddingForm.onsubmit = async (e) => {
  e.preventDefault();
  notificationText.innerHTML = 'Adding album...';

  const fd = new FormData(albumAddingForm);

  data = {
    title: fd.get('title'),
    artist: fd.get('artist'),
    releaseYear: fd.get('releaseYear'),
    albumCover: fd.get('albumCover'),
  };

  console.log(data);
  if (!data.title || !data.artist || !data.releaseYear || !data.albumCover) {
    notificationText.innerHTML = 'Tried to add an album... but failed!';
    return alert('Insufficient input!');
  }
  sendHttpRequest('POST', 'http://localhost:3000/albums', 'album', fd, data)
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((err) => {
      console.log(err);
      notificationText.innerHTML = `Oops, something went wrong! (${err})`;
    });
};


// books
booksGet.onclick = async () => {
  notificationText.innerHTML = 'Retrieving books...';
  // pic.src = '';
  theBooks.style.height = `${scrollHeight}px`;
  booksSort.style.display = 'block';
  sendHttpRequest('GET', 'http://localhost:3000/books', 'book')
    .then((responseData) => {
      console.log(responseData);
      // listOfBooks = responseData;
      if (responseData.length === 0) {
        theBooks.innerHTML = 'No books have been added! <br> <br>';
      } else {
        theBooks.innerHTML = 'Books: (click GET to update) <br> <br>';
        let i;
        for (i = 0; i < responseData.length; i++) {
          theBooks.append(appender('book', responseData[i], i, responseData));
        };
      };
      listOfBooks = responseData;
    })
    .catch((err) => {
      console.log(err);
      notificationText.innerHTML = `Oops, something went wrong! (${err})`;
    });
};

bookAddingForm.onsubmit = async (e) => {
  e.preventDefault();
  notificationText.innerHTML = 'Adding book...';

  const fd = new FormData(bookAddingForm);

  data = {
    title: fd.get('title'),
    author: fd.get('author'),
    releaseYear: fd.get('releaseYear'),
    bookCover: fd.get('bookCover'),
  };

  if (!data.title || !data.author || !data.releaseYear || !data.bookCover) {
    notificationText.innerHTML = 'Tried to add a book... but failed!';
    return alert('Insufficient input!');
  }
  sendHttpRequest('POST', 'http://localhost:3000/books', 'book', fd, data)
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((err) => {
      console.log(err);
      notificationText.innerHTML = `Oops, something went wrong! (${err})`;
    });
};


// films
filmsGet.onclick = async () => {
  notificationText.innerHTML = 'Retrieving films...';
  // pic.src = '';
  theFilms.style.height = `${scrollHeight}px`;
  filmsSort.style.display = 'block';
  sendHttpRequest('GET', 'http://localhost:3000/films', 'film')
    .then((responseData) => {
      console.log(responseData);
      // listOfFilms = responseData;
      if (responseData.length === 0) {
        theFilms.innerHTML = 'No films have been added! <br> <br>';
      } else {
        theFilms.innerHTML = 'Films: (click GET to update) <br> <br>';
        let i;
        for (i = 0; i < responseData.length; i++) {
          theFilms.append(appender('film', responseData[i], i, responseData));
        };
      };
      listOfFilms = responseData;
    })
    .catch((err) => {
      console.log(err);
      notificationText.innerHTML = `Oops, something went wrong! (${err})`;
    });
};

filmAddingForm.onsubmit = async (e) => {
  e.preventDefault();
  notificationText.innerHTML = 'Adding film...';

  const fd = new FormData(filmAddingForm);

  data = {
    title: fd.get('title'),
    director: fd.get('director'),
    releaseYear: fd.get('releaseYear'),
    filmPoster: fd.get('filmPoster'),
  };

  if (!data.title || !data.director || !data.releaseYear || !data.filmPoster) {
    notificationText.innerHTML = 'Tried to add a film... but failed!';
    return alert('Insufficient input!');
  }
  sendHttpRequest('POST', 'http://localhost:3000/films', 'film', fd, data)
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((err) => {
      console.log(err);
      notificationText.innerHTML = `Oops, something went wrong! (${err})`;
    });
};


// chart/list generator/filter

// var sortedAlbums;
// var sortedBooks;
// var sortedFilms;

var sortedItems;
var type;

function getId(str) {
  return str.split('&&')[1];
}

function listFilter(filter, itemType) {
  charts.style.height = `${scrollHeight}px`;
  sortBtns.style.display = 'block';
  notificationText.innerHTML = `Sorting ${itemType}s...`
  charts.innerHTML = '<br> Sorted Items:';
  if (itemType === 'album') {
    var lst = listOfAlbums;
    type = 'album';
    ifRead.innerHTML = 'Show listened';
    ifUnread.innerHTML = 'Show unlistened';
  } else if (itemType === 'book') {
    var lst = listOfBooks;
    type = 'book';
    ifRead.innerHTML = 'Show read';
    ifUnread.innerHTML = 'Show unread';
  } else if (itemType === 'film') {
    var lst = listOfFilms;
    type = 'film';
    ifRead.innerHTML = 'Show watched';
    ifUnread.innerHTML = 'Show unwatched';
  };
  if (filter === 'title') {
    let i = 0;
    let j = 0;
    let listOfTitles = [];
    for (i = 0; i < lst.length; i++) {
      listOfTitles.push(lst[i].title + '&&' + lst[i].Id);
    };
    listOfTitles = listOfTitles.sort();
    let sortedIds = [];
    for (i = 0; i < listOfTitles.length; i++) {
      sortedIds.push(getId(listOfTitles[i]));
    };
    sortedItems = [];
    for (i = 0; i < sortedIds.length; i++) {
      for (j = 0; j < sortedIds.length; j++) {
        if (sortedIds[i] === lst[j].Id) {
          sortedItems.push(lst[j]);
        };
      };
    };
    for (i = 0; i < sortedItems.length; i++) {
      charts.innerHTML = charts.innerHTML + '<br> <br>' + (i+1).toString() + `.  <strong>${sortedItems[i].title}</strong> by <strong>${(itemType === 'album') ? sortedItems[i].artist : (itemType === 'book') ? sortedItems[i].author : sortedItems[i].director}</strong> (${sortedItems[i].releaseYear}) <b>`
    };
    notificationText.innerHTML = `Sorted ${itemType}s.`

  } else if (filter === 'artist') {

    let i = 0;
    let j = 0;
    let listOfArtists = [];
    if (itemType === 'album') {
      for (i = 0; i < lst.length; i++) {
        listOfArtists.push(lst[i].artist + '&&' + lst[i].Id);
      };
    } else if (itemType === 'book') {
      for (i = 0; i < lst.length; i++) {
        listOfArtists.push(lst[i].author + '&&' + lst[i].Id);
      };
    } else if (itemType === 'film') {
      for (i = 0; i < lst.length; i++) {
        listOfArtists.push(lst[i].director + '&&' + lst[i].Id);
      };
    }
    listOfArtists = listOfArtists.sort();
    let sortedIds = [];
    for (i = 0; i < listOfArtists.length; i++) {
      sortedIds.push(getId(listOfArtists[i]));
    };
    sortedItems = [];
    for (i = 0; i < sortedIds.length; i++) {
      for (j = 0; j < sortedIds.length; j++) {
        if (sortedIds[i] === lst[j].Id) {
          sortedItems.push(lst[j]);
        };
      };
    };
    for (i = 0; i < sortedItems.length; i++) {
      charts.innerHTML = charts.innerHTML + '<br> <br>' + (i+1).toString() + `.  <strong>${sortedItems[i].title}</strong> by <strong>${(itemType === 'album') ? sortedItems[i].artist : (itemType === 'book') ? sortedItems[i].author : sortedItems[i].director}</strong> (${sortedItems[i].releaseYear}) <b>`
    };
    notificationText.innerHTML = `Sorted ${itemType}s.`

  } else if (filter === 'year') {
    let i = 0;
    let j = 0;
    let listOfYears = [];
    for (i = 0; i < lst.length; i++) {
      listOfYears.push(lst[i].releaseYear + '&&' + lst[i].Id);
    };
    listOfYears = listOfYears.sort();
    let sortedIds = [];
    for (i = 0; i < listOfYears.length; i++) {
      sortedIds.push(getId(listOfYears[i]));
    };
    sortedItems = [];
    for (i = 0; i < sortedIds.length; i++) {
      for (j = 0; j < sortedIds.length; j++) {
        if (sortedIds[i] === lst[j].Id) {
          sortedItems.push(lst[j]);
        };
      };
    };
    for (i = 0; i < sortedItems.length; i++) {
      charts.innerHTML = charts.innerHTML + '<br> <br>' + (i+1).toString() + `.  <strong>${sortedItems[i].title}</strong> by <strong>${(itemType === 'album') ? sortedItems[i].artist : (itemType === 'book') ? sortedItems[i].author : sortedItems[i].director}</strong> (${sortedItems[i].releaseYear}) <b>`
    };
    notificationText.innerHTML = `Sorted ${itemType}s.`

  };
};

function isRead(itemType, action) {
  let toShow = [];
  let i = 0;
  let Ids = [];

  if (itemType === 'album') {
    var lst = (action === 'read') ? listened : unlistened;
  } else if (itemType === 'book') {
    var lst = (action === 'read') ? read : unread;
  } else if (itemType === 'film') {
    var lst = (action === 'read') ? watched : unwatched;
  };

  for (i = 0; i < lst.length; i++) {
    Ids.push(lst[i].Id);
  };

  for (i = 0; i < sortedItems.length; i++) {
    if (Ids.includes(sortedItems[i].Id)) {
      toShow.push(sortedItems[i]);
    };
  };

  charts.innerHTML = '';
  for (i = 0; i < toShow.length; i++) {
    charts.innerHTML = charts.innerHTML + '<br> <br>' + (i+1).toString() + `.  <strong>${toShow[i].title}</strong> by <strong>${(itemType === 'album') ? toShow[i].artist : (itemType === 'book') ? toShow[i].author : toShow[i].director}</strong> (${toShow[i].releaseYear}) <b>`
  };
};

function show(itemType) {
  charts.innerHTML = '';
  let i = 0;
  for (i = 0; i < sortedItems.length; i++) {
    charts.innerHTML = charts.innerHTML + '<br> <br>' + (i+1).toString() + `.  <strong>${sortedItems[i].title}</strong> by <strong>${(itemType === 'album') ? sortedItems[i].artist : (itemType === 'book') ? sortedItems[i].author : sortedItems[i].director}</strong> (${sortedItems[i].releaseYear}) <b>`
  };
};

albumArtistSort.addEventListener('click', () => {listFilter('artist', 'album')});
albumTitleSort.addEventListener('click', () => {listFilter('title', 'album')});
albumYearSort.addEventListener('click', () => {listFilter('year', 'album')});
bookAuthorSort.addEventListener('click', () => {listFilter('artist', 'book')});
bookTitleSort.addEventListener('click', () => {listFilter('title', 'book')});
bookYearSort.addEventListener('click', () => {listFilter('year', 'book')});
filmDirectorSort.addEventListener('click', () => {listFilter('artist', 'film')});
filmTitleSort.addEventListener('click', () => {listFilter('title', 'film')});
filmYearSort.addEventListener('click', () => {listFilter('year', 'film')});

ifRead.addEventListener('click', () => {isRead(type, 'read')});
ifUnread.addEventListener('click', () => {isRead(type, 'unread')});

showAll.addEventListener('click', () => {show(type)});
