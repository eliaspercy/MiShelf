/* eslint-disable no-console */
const express = require('express');

const http = require('http'),
app = require('../app');

// app.use(express.static('client'));

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => console.log('App listening on port 3000'));