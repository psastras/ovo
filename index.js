#!/usr/bin/env node

const express = require('express');
const request = require('request');
const process = require('process');

process.on('uncaughtException', (err) => {
  console.log('Caught exception: ' + err);
});

const app = express();

// proxies api requests to zipkin
app.use('/api/', (req, res) => {
  const url = `http://localhost:9411${req.url}`;
  req.pipe(request[req.method.toLowerCase()]({ url, json: req.body })).pipe(res);
});


app.use(express.static('dist'));

app.listen(8080, () => {
  console.log('Listening on port 8080');
});