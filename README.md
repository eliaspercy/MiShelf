# prog-summative-2020-master

The primary purpose of this project was the construction of a dynamic website using static HTML pages loading dynamic JSON content from a server via AJAX, with the server written in nodejs to provide the JSON content through a REST API.

To run, locate this folder in the terminal, first type 'npm install' and then type 'npm start' for the server to begin. The site can be accessed via the index.html file in the client folder or via http://localhost:3000/

To use the site, simply add an item (album, book or film) by filling in the relevant form at the top of the screen (including an image!) and clicking ADD (will stimulate a POST request to the server). To retrieve and update the list of items added, just click GET. By clicking on an item on the leftmost list, it will change colour indicating it being (un)listened/read/watched. A random item can be retrieved by clicking the button at the bottom left. The cover art uploaded with each item can be displayed (on the rightmost div) by clicking on the display button attached to each item, and each item can be deleted (through a DELETE request) by clicking on its associated delete button. The list of items can be sorted by the obvious sort buttons, and the sorted items can be filtered using the obvious filter buttons (filtering between read, unread etc). A random item from the sorted and filtered lists can also be obtained (ie the list has been narrowed, for example, to only unread items, so you can obtain a random unread item). 

Some albums, books and films have been left in the site (as in, their information is left in the corresponding JSON files and images are in their folders), these can be used or removed through the site.
 
